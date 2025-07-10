
import { supabase } from "@/integrations/supabase/client";

export const testSupabaseConnection = async () => {
  try {
    console.log("🔍 Testing Supabase connection...");

    // Test basic connectivity
    const { data: healthData, error: healthError } = await supabase
      .from('users')
      .select('id')
      .limit(1);

    if (healthError) {
      console.error("❌ Supabase connection failed:", healthError);
      return { success: false, error: healthError.message };
    }

    console.log("✅ Supabase connection successful");
    return { success: true, data: healthData };
  } catch (error: any) {
    console.error("❌ Supabase connection error:", error);
    return { success: false, error: error.message };
  }
};

export const checkDatabaseSchema = async () => {
  const results: Record<string, any> = {};
  
  const tables = [
    'users', 'design_requests', 'chats', 'messages', 
    'chat_participants', 'invoices', 'projects'
  ];

  for (const table of tables) {
    try {
      const { data, error } = await supabase
        .from(table as any)
        .select('*')
        .limit(1);

      results[table] = {
        exists: !error,
        error: error?.message,
        sampleData: data
      };
    } catch (err: any) {
      results[table] = {
        exists: false,
        error: err.message
      };
    }
  }

  return results;
};
