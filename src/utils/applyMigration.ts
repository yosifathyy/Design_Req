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

// Alternative approach using direct SQL if the RPC approach doesn't work
export const applyMigrationDirect = async (): Promise<MigrationResult> => {
  if (!isSupabaseConfigured) {
    return {
      success: false,
      error: "Supabase not configured",
    };
  }

  try {
    // Check if we need migration by trying to select from messages with project_id
    const { data, error } = await supabase
      .from("messages")
      .select("id, project_id")
      .limit(1);

    if (!error) {
      return {
        success: true,
        details: "Migration already applied",
      };
    }

    // If messages table doesn't exist or doesn't have project_id, we need to migrate
    // Create the new structure by inserting a test record (which will create the table if RLS allows)
    const { data: testUser } = await supabase
      .from("users")
      .select("id")
      .limit(1)
      .single();

    const { data: testProject } = await supabase
      .from("design_requests")
      .select("id")
      .limit(1)
      .single();

    if (!testUser || !testProject) {
      return {
        success: false,
        error: "Cannot apply migration - no test data available",
      };
    }

    // This approach won't work without proper admin privileges
    return {
      success: false,
      error: "Direct migration requires admin database access",
      details: "Please apply the migration through Supabase dashboard or CLI",
    };
  } catch (error: any) {
    return {
      success: false,
      error: "Migration check failed",
      details: error.message,
    };
  }
};
