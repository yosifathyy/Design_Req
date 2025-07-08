import { supabase } from "./supabase";

export const setupChatPolicies = async () => {
  try {
    console.log("Setting up chat policies programmatically...");

    // Check if we can create policies programmatically
    // Note: This requires admin/service role privileges
    const policies = [
      // Chat creation policy
      `
      DROP POLICY IF EXISTS "Users can create chats for their requests" ON chats;
      CREATE POLICY "Users can create chats for their requests"
        ON chats FOR INSERT
        TO authenticated
        WITH CHECK (
          EXISTS (
            SELECT 1 FROM design_requests
            WHERE design_requests.id = request_id 
            AND (design_requests.user_id = auth.uid() OR design_requests.designer_id = auth.uid())
          )
        );
      `,

      // Chat participants policy
      `
      DROP POLICY IF EXISTS "Users can add participants to their chats" ON chat_participants;
      CREATE POLICY "Users can add participants to their chats"
        ON chat_participants FOR INSERT
        TO authenticated
        WITH CHECK (
          EXISTS (
            SELECT 1 FROM chats
            JOIN design_requests ON design_requests.id = chats.request_id
            WHERE chats.id = chat_id
            AND (design_requests.user_id = auth.uid() OR design_requests.designer_id = auth.uid())
          )
        );
      `,
    ];

    for (const policy of policies) {
      const { error } = await supabase.rpc("exec_sql", { sql: policy });
      if (error) {
        console.warn(
          "Could not set up policy programmatically:",
          error.message,
        );
        return false;
      }
    }

    console.log("✅ Chat policies set up successfully!");
    return true;
  } catch (error) {
    console.warn("Programmatic policy setup failed:", error);
    return false;
  }
};

export const checkChatPolicies = async () => {
  try {
    // Try to check if policies exist by querying system tables
    const { data, error } = await supabase
      .from("pg_policies")
      .select("policyname")
      .eq("tablename", "chats")
      .eq("policyname", "Users can create chats for their requests");

    if (error) {
      console.warn("Cannot check policies:", error.message);
      return false;
    }

    return data && data.length > 0;
  } catch (error) {
    console.warn("Policy check failed:", error);
    return false;
  }
};
