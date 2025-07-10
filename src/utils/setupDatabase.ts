
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
