
import { supabase } from "@/integrations/supabase/client";

export const inspectDatabase = async () => {
  const inspection: Record<string, any> = {};
  
  const tables = [
    'users', 'design_requests', 'chats', 'messages', 
    'chat_participants', 'invoices', 'projects', 'project_tasks'
  ];

  for (const table of tables) {
    try {
      // Test table accessibility
      const { data, error, count } = await supabase
        .from(table as any)
        .select('*', { count: 'exact', head: true });

      inspection[table] = {
        accessible: !error,
        recordCount: count || 0,
        error: error?.message
      };

      if (!error) {
        // Get sample record structure
        const { data: sample } = await supabase
          .from(table as any)
          .select('*')
          .limit(1);
        
        inspection[table].sampleStructure = sample?.[0] ? Object.keys(sample[0]) : [];
      }
    } catch (err: any) {
      inspection[table] = {
        accessible: false,
        error: err.message
      };
    }
  }

  return inspection;
};
