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

export const inspectMessagesTable = async () => {
  try {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .limit(1);

    if (error) {
      return {
        success: false,
        error: error.message,
        columns: []
      };
    }

    const columns = data && data.length > 0 ? Object.keys(data[0]) : [];
    
    return {
      success: true,
      columns,
      sampleData: data
    };
  } catch (err: any) {
    return {
      success: false,
      error: err.message,
      columns: []
    };
  }
};

export const inspectChatsTable = async () => {
  try {
    const { data, error } = await supabase
      .from('chats')
      .select('*')
      .limit(1);

    if (error) {
      return {
        success: false,
        error: error.message,
        columns: []
      };
    }

    const columns = data && data.length > 0 ? Object.keys(data[0]) : [];
    
    return {
      success: true,
      columns,
      sampleData: data
    };
  } catch (err: any) {
    return {
      success: false,
      error: err.message,
      columns: []
    };
  }
};

export const listTables = async () => {
  const tables = [
    'users', 'design_requests', 'chats', 'messages', 
    'chat_participants', 'invoices', 'projects', 'project_tasks',
    'invoice_line_items', 'invoice_payments', 'files', 'contact_submissions',
    'system_alerts', 'user_badges', 'project_timeline', 'audit_logs'
  ];

  const results: Record<string, boolean> = {};

  for (const table of tables) {
    try {
      const { error } = await supabase
        .from(table as any)
        .select('id')
        .limit(1);
      
      results[table] = !error;
    } catch (err) {
      results[table] = false;
    }
  }

  return results;
};
