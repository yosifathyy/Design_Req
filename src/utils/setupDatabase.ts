import { supabase } from "@/integrations/supabase/client";

export const setupDemoData = async (): Promise<{ success: boolean; error?: string }> => {
  try {
    console.log("🔄 Setting up demo data...");

    // Create demo users first
    const demoUsers = [
      {
        id: "demo-admin-123",
        email: "admin@demo.com",
        name: "Admin User",
        role: "admin",
        status: "active",
        xp: 1000,
        level: 5,
        avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=admin@demo.com"
      },
      {
        id: "demo-designer-456",
        email: "designer@demo.com", 
        name: "Jane Designer",
        role: "designer",
        status: "active",
        xp: 750,
        level: 4,
        avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=designer@demo.com"
      },
      {
        id: "demo-user-789",
        email: "user@demo.com",
        name: "John Client",
        role: "user", 
        status: "active",
        xp: 250,
        level: 2,
        avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=user@demo.com"
      }
    ];

    // Insert demo users
    const { error: usersError } = await supabase
      .from('users')
      .upsert(demoUsers, { onConflict: 'email' });

    if (usersError) {
      console.error("Failed to create demo users:", usersError);
      return { success: false, error: usersError.message };
    }

    // Create demo design requests
    const demoRequests = [
      {
        id: "demo-request-1",
        title: "Website Redesign",
        description: "Complete redesign of company website with modern UI/UX",
        category: "web-design",
        price: 2500,
        status: "in-progress",
        priority: "high",
        user_id: "demo-user-789",
        designer_id: "demo-designer-456"
      },
      {
        id: "demo-request-2", 
        title: "Logo Design",
        description: "New logo for startup company",
        category: "branding",
        price: 800,
        status: "completed",
        priority: "medium",
        user_id: "demo-user-789",
        designer_id: "demo-designer-456"
      }
    ];

    const { error: requestsError } = await supabase
      .from('design_requests')
      .upsert(demoRequests, { onConflict: 'id' });

    if (requestsError) {
      console.error("Failed to create demo requests:", requestsError);
      return { success: false, error: requestsError.message };
    }

    // Create demo chats
    const demoChats = [
      {
        id: "demo-chat-1",
        request_id: "demo-request-1"
      }
    ];

    const { error: chatsError } = await supabase
      .from('chats')
      .upsert(demoChats, { onConflict: 'id' });

    if (chatsError) {
      console.error("Failed to create demo chats:", chatsError);
      return { success: false, error: chatsError.message };
    }

    // Create demo messages  
    const demoMessages = [
      {
        id: "demo-message-1",
        chat_id: "demo-chat-1",
        sender_id: "demo-user-789",
        text: "Hi! I'm excited to start working on the website redesign.",
        content: "Hi! I'm excited to start working on the website redesign."
      },
      {
        id: "demo-message-2", 
        chat_id: "demo-chat-1",
        sender_id: "demo-designer-456",
        text: "Great! I'll start with some initial concepts and share them with you soon.",
        content: "Great! I'll start with some initial concepts and share them with you soon."
      }
    ];

    const { error: messagesError } = await supabase
      .from('messages')
      .upsert(demoMessages, { onConflict: 'id' });

    if (messagesError) {
      console.error("Failed to create demo messages:", messagesError);
      return { success: false, error: messagesError.message };
    }

    // Create demo invoices
    const demoInvoices = [
      {
        id: "demo-invoice-1",
        request_id: "demo-request-2",
        invoice_number: "INV-001",
        title: "Logo Design Services",
        description: "Logo design project completion",
        amount: 800,
        status: "paid",
        due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
      }
    ];

    const { error: invoicesError } = await supabase
      .from('invoices')
      .upsert(demoInvoices, { onConflict: 'id' });

    if (invoicesError) {
      console.error("Failed to create demo invoices:", invoicesError);
      return { success: false, error: invoicesError.message };
    }

    console.log("✅ Demo data setup completed successfully");
    return { success: true };

  } catch (error: any) {
    console.error("Demo data setup failed:", error);
    return { success: false, error: error.message };
  }
};

export const checkAndCreateTables = async () => {
  const results: Record<string, any> = {};
  
  const tables = [
    'users', 'design_requests', 'chats', 'messages', 
    'chat_participants', 'invoices', 'projects', 'project_tasks'
  ];

  for (const table of tables) {
    try {
      const { data, error } = await supabase
        .from(table as any)
        .select('id')
        .limit(1);

      results[table] = {
        exists: !error,
        error: error?.message
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

export const createMissingTables = async () => {
  const sqlStatements = `
-- Create users table if not exists
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  role TEXT DEFAULT 'user',
  status TEXT DEFAULT 'active',
  xp INTEGER DEFAULT 0,
  level INTEGER DEFAULT 1,
  avatar_url TEXT,
  bio TEXT,
  skills TEXT[],
  hourly_rate NUMERIC,
  last_login TIMESTAMPTZ,
  last_seen TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create design_requests table if not exists
CREATE TABLE IF NOT EXISTS public.design_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  price NUMERIC NOT NULL,
  status TEXT DEFAULT 'draft',
  priority TEXT DEFAULT 'medium',
  user_id UUID NOT NULL,
  designer_id UUID,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create chats table if not exists
CREATE TABLE IF NOT EXISTS public.chats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id UUID NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create messages table if not exists
CREATE TABLE IF NOT EXISTS public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  chat_id UUID NOT NULL,
  sender_id UUID NOT NULL,
  text TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create chat_participants table if not exists
CREATE TABLE IF NOT EXISTS public.chat_participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  chat_id UUID NOT NULL,
  user_id UUID NOT NULL,
  last_read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create invoices table if not exists
CREATE TABLE IF NOT EXISTS public.invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id UUID NOT NULL,
  invoice_number TEXT NOT NULL,
  title TEXT DEFAULT 'Design Services',
  description TEXT,
  amount NUMERIC NOT NULL,
  status TEXT DEFAULT 'pending',
  due_date TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create projects table if not exists
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  category TEXT,
  price NUMERIC,
  status TEXT DEFAULT 'draft',
  priority TEXT DEFAULT 'medium',
  user_id UUID NOT NULL,
  designer_id UUID,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create project_tasks table if not exists
CREATE TABLE IF NOT EXISTS public.project_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'pending',
  priority TEXT DEFAULT 'medium',
  assigned_to UUID,
  due_date TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Disable RLS for development (re-enable in production)
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.design_requests DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.chats DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_participants DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_tasks DISABLE ROW LEVEL SECURITY;
`;

  return { sqlStatements };
};

export const createSampleData = async (userId: string) => {
  const results: Record<string, any> = {};
  
  try {
    // Create sample design requests
    const sampleRequests = [
      {
        id: `sample-request-${userId}-1`,
        title: "Website Redesign",
        description: "Modern website redesign with responsive layout",
        category: "web-design",
        price: 2000,
        status: "in-progress",
        priority: "high",
        user_id: userId
      },
      {
        id: `sample-request-${userId}-2`,
        title: "Logo Design",
        description: "Professional logo design for startup",
        category: "branding",
        price: 500,
        status: "completed",
        priority: "medium",
        user_id: userId
      }
    ];

    const { error: requestsError } = await supabase
      .from('design_requests')
      .upsert(sampleRequests, { onConflict: 'id' });

    results.design_requests = {
      success: !requestsError,
      error: requestsError?.message
    };

    // Create sample projects
    const sampleProjects = [
      {
        id: `sample-project-${userId}-1`,
        title: "E-commerce Platform",
        description: "Full e-commerce platform development",
        category: "web-development",
        price: 5000,
        status: "active",
        priority: "high",
        user_id: userId
      }
    ];

    const { error: projectsError } = await supabase
      .from('projects')
      .upsert(sampleProjects, { onConflict: 'id' });

    results.projects = {
      success: !projectsError,
      error: projectsError?.message
    };

  } catch (error: any) {
    results.error = {
      success: false,
      error: error.message
    };
  }

  return results;
};
