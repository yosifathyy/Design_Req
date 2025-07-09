import { supabase } from "@/lib/supabase";

// Inspect the actual structure of database tables
export const inspectMessagesTable = async () => {
  console.log("=== Inspecting Messages Table Structure ===");

  try {
    // Try to get any one row to see the actual column structure
    const { data: sample, error: sampleError } = await supabase
      .from("messages")
      .select("*")
      .limit(1);

    if (sampleError) {
      console.error("Error fetching sample:", sampleError);
      return {
        success: false,
        error: sampleError.message,
        columns: [],
      };
    }

    const columns = sample && sample.length > 0 ? Object.keys(sample[0]) : [];
    console.log("Actual columns in messages table:", columns);

    return {
      success: true,
      columns,
      sampleData: sample,
    };
  } catch (error: any) {
    console.error("Failed to inspect messages table:", error);
    return {
      success: false,
      error: error.message,
      columns: [],
    };
  }
};

export const inspectChatsTable = async () => {
  console.log("=== Inspecting Chats Table Structure ===");

  try {
    const { data: sample, error: sampleError } = await supabase
      .from("chats")
      .select("*")
      .limit(1);

    if (sampleError) {
      console.error("Error fetching chats sample:", sampleError);
      return {
        success: false,
        error: sampleError.message,
        columns: [],
      };
    }

    const columns = sample && sample.length > 0 ? Object.keys(sample[0]) : [];
    console.log("Actual columns in chats table:", columns);

    return {
      success: true,
      columns,
      sampleData: sample,
    };
  } catch (error: any) {
    console.error("Failed to inspect chats table:", error);
    return {
      success: false,
      error: error.message,
      columns: [],
    };
  }
};

// Get all available tables
export const listTables = async () => {
  console.log("=== Checking Available Tables ===");

  const tables = ["users", "messages", "chats", "design_requests"];
  const results: Record<string, boolean> = {};

  for (const table of tables) {
    try {
      const { error } = await supabase.from(table).select("*").limit(1);
      results[table] = !error;
      if (error) {
        console.log(`Table ${table}: NOT ACCESSIBLE (${error.message})`);
      } else {
        console.log(`Table ${table}: ACCESSIBLE`);
      }
    } catch (error) {
      results[table] = false;
      console.log(`Table ${table}: ERROR`);
    }
  }

  return results;
};
