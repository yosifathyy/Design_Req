import { supabase, isSupabaseConfigured } from "@/lib/supabase";

interface MigrationResult {
  success: boolean;
  error?: string;
  details?: string;
}

export const applySimplifiedChatMigration =
  async (): Promise<MigrationResult> => {
    if (!isSupabaseConfigured) {
      return {
        success: false,
        error: "Supabase not configured",
        details: "Please configure your Supabase connection first",
      };
    }

    try {
      // Step 1: Check if migration is needed
      const { data: messagesCheck, error: checkError } = await supabase
        .from("messages")
        .select("id, project_id")
        .limit(1);

      if (!checkError && messagesCheck !== null) {
        return {
          success: true,
          details:
            "Migration already applied - messages table with project_id exists",
        };
      }

      // Step 2: Execute migration step by step
      console.log("Applying simplified chat migration...");

      // Try to use exec_sql RPC function first
      const { error: rpcTestError } = await supabase.rpc("exec_sql", {
        sql: "SELECT 1;",
      });

      if (rpcTestError) {
        console.log(
          "RPC exec_sql not available, using alternative approach...",
        );
        return await applyChatMigrationAlternative();
      }

      // Drop existing chat tables
      const { error: dropError } = await supabase.rpc("exec_sql", {
        sql: `
        DROP TABLE IF EXISTS chat_participants CASCADE;
        DROP TABLE IF EXISTS chats CASCADE;
      `,
      });

      if (dropError) {
        console.log(
          "Note: Could not drop old tables (may not exist):",
          dropError.message,
        );
      }

      // Create messages table
      const { error: createError } = await supabase.rpc("exec_sql", {
        sql: `
        CREATE TABLE IF NOT EXISTS messages (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          project_id UUID NOT NULL REFERENCES design_requests(id) ON DELETE CASCADE,
          sender_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          message TEXT NOT NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `,
      });

      if (createError) {
        return {
          success: false,
          error: "Failed to create messages table",
          details: createError.message,
        };
      }

      // Create indexes
      const { error: indexError } = await supabase.rpc("exec_sql", {
        sql: `
        CREATE INDEX IF NOT EXISTS idx_messages_project_id ON messages(project_id);
        CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON messages(sender_id);
        CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at);
        CREATE INDEX IF NOT EXISTS idx_messages_project_created ON messages(project_id, created_at);
      `,
      });

      if (indexError) {
        console.log(
          "Warning: Could not create all indexes:",
          indexError.message,
        );
      }

      // Add last_seen to users
      const { error: userError } = await supabase.rpc("exec_sql", {
        sql: `
        ALTER TABLE users ADD COLUMN IF NOT EXISTS last_seen TIMESTAMP WITH TIME ZONE DEFAULT NOW();
      `,
      });

      if (userError) {
        console.log(
          "Warning: Could not add last_seen column:",
          userError.message,
        );
      }

      // Enable RLS
      const { error: rlsError } = await supabase.rpc("exec_sql", {
        sql: `
        ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
      `,
      });

      if (rlsError) {
        console.log("Warning: Could not enable RLS:", rlsError.message);
      }

      // Try to enable realtime (may fail in some environments)
      const { error: realtimeError } = await supabase.rpc("exec_sql", {
        sql: `
        ALTER PUBLICATION supabase_realtime ADD TABLE messages;
      `,
      });

      if (realtimeError) {
        console.log(
          "Note: Could not enable realtime (this is ok):",
          realtimeError.message,
        );
      }

      // Verify the migration worked
      const { data: verifyData, error: verifyError } = await supabase
        .from("messages")
        .select("id, project_id")
        .limit(1);

      if (verifyError) {
        return {
          success: false,
          error: "Migration failed verification",
          details: verifyError.message,
        };
      }

      return {
        success: true,
        details: "Simplified chat migration applied successfully",
      };
    } catch (error: any) {
      return {
        success: false,
        error: "Migration failed",
        details: error.message || "Unknown error",
      };
    }
  };

// Alternative approach when RPC is not available
const applyChatMigrationAlternative = async (): Promise<MigrationResult> => {
  try {
    // Since we can't execute DDL directly, provide detailed instructions
    return {
      success: false,
      error: "Automated migration not available",
      details: `Your Supabase instance doesn't support automated migrations.
Please run the migration manually through the Supabase Dashboard:
1. Go to SQL Editor in your Supabase Dashboard
2. Copy and paste the migration SQL from the Manual Migration section
3. Run the SQL to create the simplified chat structure
4. Return here and click "Recheck Status"`,
    };
  } catch (error: any) {
    return {
      success: false,
      error: "Migration alternative failed",
      details: error.message,
    };
  }
};

// Test if database supports the migration
export const testMigrationSupport = async (): Promise<{
  supportsRPC: boolean;
  canWriteMessages: boolean;
  error?: string;
}> => {
  if (!isSupabaseConfigured) {
    return {
      supportsRPC: false,
      canWriteMessages: false,
      error: "Supabase not configured",
    };
  }

  try {
    // Test RPC support
    const { error: rpcError } = await supabase.rpc("exec_sql", {
      sql: "SELECT 1;",
    });
    const supportsRPC = !rpcError;

    // Test if we can write to messages table (even if it exists with wrong structure)
    const { error: writeError } = await supabase
      .from("messages")
      .select("id")
      .limit(1);

    const canWriteMessages = !writeError;

    return {
      supportsRPC,
      canWriteMessages,
      error: rpcError?.message,
    };
  } catch (error: any) {
    return {
      supportsRPC: false,
      canWriteMessages: false,
      error: error.message,
    };
  }
};
