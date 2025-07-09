import { supabase, isSupabaseConfigured } from "@/lib/supabase";

export interface DatabaseTestResult {
  configured: boolean;
  messagesTableExists: boolean;
  hasProjectIdColumn: boolean;
  hasOldChatStructure: boolean;
  needsMigration: boolean;
  error?: string;
}

export const testDatabaseStructure = async (): Promise<DatabaseTestResult> => {
  if (!isSupabaseConfigured) {
    return {
      configured: false,
      messagesTableExists: false,
      hasProjectIdColumn: false,
      hasOldChatStructure: false,
      needsMigration: false,
      error: "Supabase not configured",
    };
  }

  try {
    // Test 1: Check if new messages table with project_id exists
    const { data: newMessages, error: newMessagesError } = await supabase
      .from("messages")
      .select("id, project_id, sender_id, message")
      .limit(1);

    const hasProjectIdColumn = !newMessagesError;

    // Test 2: Check if old chats table exists
    const { data: oldChats, error: oldChatsError } = await supabase
      .from("chats")
      .select("id")
      .limit(1);

    const hasOldChatStructure = !oldChatsError;

    // Test 3: Check if messages table exists at all (even with old structure)
    const { data: anyMessages, error: anyMessagesError } = await supabase
      .from("messages")
      .select("id")
      .limit(1);

    const messagesTableExists = !anyMessagesError;

    const needsMigration = !hasProjectIdColumn || hasOldChatStructure;

    return {
      configured: true,
      messagesTableExists,
      hasProjectIdColumn,
      hasOldChatStructure,
      needsMigration,
      error: hasProjectIdColumn
        ? undefined
        : newMessagesError?.message || "Unknown database error",
    };
  } catch (error: any) {
    return {
      configured: true,
      messagesTableExists: false,
      hasProjectIdColumn: false,
      hasOldChatStructure: false,
      needsMigration: true,
      error: error.message || "Database test failed",
    };
  }
};

export const logDatabaseStatus = async () => {
  console.log("=== Database Structure Test ===");
  const result = await testDatabaseStructure();

  console.log("Configured:", result.configured);
  console.log("Messages table exists:", result.messagesTableExists);
  console.log("Has project_id column:", result.hasProjectIdColumn);
  console.log("Has old chat structure:", result.hasOldChatStructure);
  console.log("Needs migration:", result.needsMigration);

  if (result.error) {
    console.log("Error:", result.error);
  }

  return result;
};
