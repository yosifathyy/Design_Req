import { supabase } from "@/lib/supabase";

export const checkAndCreateTables = async () => {
  const results: any = {};

  try {
    // Check if tables exist by trying to query them
    const tableChecks = [
      {
        name: "users",
        query: () => supabase.from("users").select("count").limit(1),
      },
      {
        name: "design_requests",
        query: () => supabase.from("design_requests").select("count").limit(1),
      },
      {
        name: "chats",
        query: () => supabase.from("chats").select("count").limit(1),
      },
      {
        name: "messages",
        query: () => supabase.from("messages").select("count").limit(1),
      },
      {
        name: "invoices",
        query: () => supabase.from("invoices").select("count").limit(1),
      },
    ];

    for (const table of tableChecks) {
      try {
        const { data, error } = await table.query();
        results[table.name] = {
          exists: !error,
          accessible: !!data,
          error: error?.message,
        };
      } catch (err: any) {
        results[table.name] = {
          exists: false,
          accessible: false,
          error: err.message,
        };
      }
    }

    return results;
  } catch (error: any) {
    throw new Error(`Database check failed: ${error.message}`);
  }
};

export const createMissingTables = async () => {
  try {
    // This function would create tables, but we can't execute DDL from the client
    // Instead, return SQL statements that need to be run manually
    const sqlStatements = `
-- Users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  role TEXT DEFAULT 'user',
  status TEXT DEFAULT 'active',
  xp INTEGER DEFAULT 0,
  level INTEGER DEFAULT 1,
  bio TEXT,
  skills TEXT[],
  hourly_rate DECIMAL,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_login TIMESTAMP WITH TIME ZONE
);

-- Design requests table
CREATE TABLE IF NOT EXISTS design_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  budget DECIMAL,
  deadline TIMESTAMP WITH TIME ZONE,
  status TEXT DEFAULT 'pending',
  user_id UUID REFERENCES users(id),
  designer_id UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Chats table
CREATE TABLE IF NOT EXISTS chats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id UUID REFERENCES design_requests(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Messages table
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  chat_id UUID REFERENCES chats(id),
  sender_id UUID REFERENCES users(id),
  text TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Invoices table
CREATE TABLE IF NOT EXISTS invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  designer_id UUID REFERENCES users(id),
  request_id UUID REFERENCES design_requests(id),
  amount DECIMAL NOT NULL,
  status TEXT DEFAULT 'pending',
  due_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Disable RLS for admin access (temporarily)
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE design_requests DISABLE ROW LEVEL SECURITY;
ALTER TABLE chats DISABLE ROW LEVEL SECURITY;
ALTER TABLE messages DISABLE ROW LEVEL SECURITY;
ALTER TABLE invoices DISABLE ROW LEVEL SECURITY;
`;

    return {
      success: false,
      sqlStatements,
      message:
        "Tables cannot be created from the client. Please run the provided SQL in your Supabase SQL Editor.",
    };
  } catch (error: any) {
    throw new Error(`Table creation failed: ${error.message}`);
  }
};

export const disableRLS = async () => {
  try {
    // Again, this needs to be done in Supabase dashboard
    const sqlStatements = `
-- Disable Row Level Security for all tables
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE design_requests DISABLE ROW LEVEL SECURITY; 
ALTER TABLE chats DISABLE ROW LEVEL SECURITY;
ALTER TABLE messages DISABLE ROW LEVEL SECURITY;
ALTER TABLE invoices DISABLE ROW LEVEL SECURITY;
`;

    return {
      success: false,
      sqlStatements,
      message:
        "RLS policies cannot be disabled from the client. Please run the provided SQL in your Supabase SQL Editor.",
    };
  } catch (error: any) {
    throw new Error(`RLS disable failed: ${error.message}`);
  }
};

export const createSampleData = async (userId: string) => {
  try {
    const results: any = {};

    // Create sample users
    const sampleUsers = [
      {
        id: "demo-client-user-id",
        email: "client@demo.com",
        name: "Demo Client",
        role: "user",
        status: "active",
        xp: 50,
        level: 2,
        bio: "Demo client user for testing",
        avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=client",
        created_at: new Date().toISOString(),
      },
      {
        id: "demo-designer-user-id",
        email: "designer@demo.com",
        name: "Demo Designer",
        role: "designer",
        status: "active",
        xp: 200,
        level: 8,
        bio: "Demo designer user for testing",
        skills: ["UI Design", "Branding", "Logo Design"],
        hourly_rate: 75,
        avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=designer",
        created_at: new Date().toISOString(),
      },
    ];

    const { data: usersData, error: usersError } = await supabase
      .from("users")
      .upsert(sampleUsers, { onConflict: "email" });

    results.users = { success: !usersError, error: usersError?.message };

    // Create sample design request
    const sampleRequest = {
      id: "demo-request-1",
      title: "Logo Design for Startup",
      description:
        "We need a modern logo for our tech startup. Looking for something clean and professional.",
      budget: 500,
      deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      status: "in_progress",
      user_id: "demo-client-user-id",
      designer_id: "demo-designer-user-id",
      created_at: new Date().toISOString(),
    };

    const { data: requestData, error: requestError } = await supabase
      .from("design_requests")
      .upsert([sampleRequest], { onConflict: "id" });

    results.requests = { success: !requestError, error: requestError?.message };

    // Create sample chat
    const sampleChat = {
      id: "demo-chat-1",
      request_id: "demo-request-1",
      created_at: new Date().toISOString(),
    };

    const { data: chatData, error: chatError } = await supabase
      .from("chats")
      .upsert([sampleChat], { onConflict: "id" });

    results.chats = { success: !chatError, error: chatError?.message };

    // Create sample messages
    const sampleMessages = [
      {
        id: "demo-message-1",
        chat_id: "demo-chat-1",
        sender_id: "demo-client-user-id",
        text: "Hi! I'm excited to work on this logo project. When can we start?",
        created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: "demo-message-2",
        chat_id: "demo-chat-1",
        sender_id: "demo-designer-user-id",
        text: "Hello! I'd love to help you with your logo. I have some initial ideas already. Let's schedule a call to discuss your vision.",
        created_at: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: "demo-message-3",
        chat_id: "demo-chat-1",
        sender_id: "demo-client-user-id",
        text: "That sounds great! I'm available tomorrow afternoon. What time works for you?",
        created_at: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      },
    ];

    const { data: messagesData, error: messagesError } = await supabase
      .from("messages")
      .upsert(sampleMessages, { onConflict: "id" });

    results.messages = {
      success: !messagesError,
      error: messagesError?.message,
    };

    // Create sample invoice
    const sampleInvoice = {
      id: "demo-invoice-1",
      user_id: "demo-client-user-id",
      designer_id: "demo-designer-user-id",
      request_id: "demo-request-1",
      amount: 500,
      status: "pending",
      due_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
      created_at: new Date().toISOString(),
    };

    const { data: invoiceData, error: invoiceError } = await supabase
      .from("invoices")
      .upsert([sampleInvoice], { onConflict: "id" });

    results.invoices = { success: !invoiceError, error: invoiceError?.message };

    return results;
  } catch (error: any) {
    throw new Error(`Sample data creation failed: ${error.message}`);
  }
};
