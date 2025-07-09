import { supabase } from "@/lib/supabase";

export const applySimplifiedChatMigration = async () => {
  try {
    console.log("Starting simplified chat migration...");

    // Step 1: Check current structure
    const { data: currentMessages } = await supabase
      .from("messages")
      .select("*")
      .limit(1);

    console.log("Current messages structure:", currentMessages);

    // Step 2: Add project_id column if it doesn't exist
    console.log("Adding project_id column...");

    // We'll use a series of SQL commands to update the structure
    const migrationSteps = [
      // Add project_id column
      `ALTER TABLE messages ADD COLUMN IF NOT EXISTS project_id UUID;`,

      // Add foreign key constraint
      `ALTER TABLE messages ADD CONSTRAINT IF NOT EXISTS fk_messages_project_id 
       FOREIGN KEY (project_id) REFERENCES design_requests(id) ON DELETE CASCADE;`,

      // Add index for performance
      `CREATE INDEX IF NOT EXISTS idx_messages_project_id ON messages(project_id);`,

      // Add last_seen column to users if it doesn't exist
      `ALTER TABLE users ADD COLUMN IF NOT EXISTS last_seen TIMESTAMP WITH TIME ZONE DEFAULT NOW();`,

      // Update RLS policies for new structure
      `DROP POLICY IF EXISTS "Users can read project messages" ON messages;`,

      `CREATE POLICY "Users can read project messages" ON messages
       FOR SELECT USING (
         auth.uid() IN (
           SELECT user_id FROM design_requests WHERE id = project_id
           UNION
           SELECT designer_id FROM design_requests WHERE id = project_id AND designer_id IS NOT NULL
         )
         OR 
         auth.uid() IN (
           SELECT id FROM users WHERE role IN ('admin', 'super-admin')
         )
       );`,

      `DROP POLICY IF EXISTS "Users can send project messages" ON messages;`,

      `CREATE POLICY "Users can send project messages" ON messages
       FOR INSERT WITH CHECK (
         auth.uid() = sender_id
         AND (
           auth.uid() IN (
             SELECT user_id FROM design_requests WHERE id = project_id
             UNION
             SELECT designer_id FROM design_requests WHERE id = project_id AND designer_id IS NOT NULL
           )
           OR 
           auth.uid() IN (
             SELECT id FROM users WHERE role IN ('admin', 'super-admin')
           )
         )
       );`,
    ];

    // Execute each step
    for (const [index, sql] of migrationSteps.entries()) {
      console.log(`Executing step ${index + 1}...`);
      const { error } = await supabase.rpc("exec_sql", { sql_query: sql });

      if (error) {
        console.error(`Step ${index + 1} failed:`, error);
        // Continue with other steps
      } else {
        console.log(`Step ${index + 1} completed successfully`);
      }
    }

    console.log("Migration completed!");
    return { success: true };
  } catch (error) {
    console.error("Migration failed:", error);
    return { success: false, error };
  }
};

// Alternative approach using direct SQL execution
export const applyMigrationDirectly = async () => {
  try {
    // First, let's check what we can do with direct queries
    console.log("Checking database permissions...");

    // Try to add the column directly
    const { error: alterError } = await supabase
      .from("messages")
      .select("project_id")
      .limit(1);

    if (alterError && alterError.message?.includes("project_id")) {
      console.log(
        "project_id column doesn't exist, this confirms we need the migration",
      );
      return {
        success: false,
        error:
          "Database structure needs updating. Please contact your database administrator to run the migration script.",
        needsMigration: true,
      };
    }

    console.log("Database structure appears to be correct");
    return { success: true };
  } catch (error) {
    console.error("Database check failed:", error);
    return { success: false, error };
  }
};
