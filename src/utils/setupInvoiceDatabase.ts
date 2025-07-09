import { supabase } from "@/lib/supabase";

export async function setupInvoiceDatabase() {
  console.log("🔧 Setting up invoice database tables...");

  try {
    // Check if invoices table exists
    const { data: tables, error: tablesError } = await supabase
      .from("information_schema.tables")
      .select("table_name")
      .eq("table_schema", "public")
      .eq("table_name", "invoices");

    if (tablesError) {
      console.error("Error checking tables:", tablesError);
      return false;
    }

    if (tables && tables.length > 0) {
      console.log("✅ Invoice tables already exist");
      return true;
    }

    console.log("📋 Creating invoice tables...");

    // Create invoices table using SQL
    const { error: invoicesError } = await supabase.rpc("exec_sql", {
      sql: `
        -- Create invoices table
        CREATE TABLE IF NOT EXISTS invoices (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            invoice_number TEXT NOT NULL UNIQUE,
            design_request_id UUID REFERENCES design_requests(id) ON DELETE CASCADE,
            user_id UUID NOT NULL REFERENCES users(id),
            designer_id UUID REFERENCES users(id),
            
            -- Invoice details
            title TEXT NOT NULL,
            description TEXT,
            
            -- Financial details
            subtotal DECIMAL(10,2) NOT NULL DEFAULT 0,
            tax_rate DECIMAL(5,2) NOT NULL DEFAULT 0,
            tax_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
            discount_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
            total_amount DECIMAL(10,2) NOT NULL,
            
            -- Status and dates
            status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'paid', 'overdue', 'cancelled')),
            due_date TIMESTAMP WITH TIME ZONE,
            sent_at TIMESTAMP WITH TIME ZONE,
            paid_at TIMESTAMP WITH TIME ZONE,
            
            -- Payment details
            payment_method TEXT CHECK (payment_method IN ('paypal', 'stripe', 'bank_transfer')),
            payment_reference TEXT,
            paypal_order_id TEXT,
            paypal_payer_id TEXT,
            
            -- Additional info
            notes TEXT,
            terms TEXT,
            
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `,
    });

    if (invoicesError) {
      console.error("Error creating invoices table:", invoicesError);
      return false;
    }

    // Create line items table
    const { error: lineItemsError } = await supabase.rpc("exec_sql", {
      sql: `
        -- Create invoice line items table
        CREATE TABLE IF NOT EXISTS invoice_line_items (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            invoice_id UUID NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
            description TEXT NOT NULL,
            quantity INTEGER NOT NULL DEFAULT 1,
            unit_price DECIMAL(10,2) NOT NULL,
            total_price DECIMAL(10,2) NOT NULL,
            item_type TEXT DEFAULT 'service' CHECK (item_type IN ('service', 'product', 'design', 'consultation')),
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `,
    });

    if (lineItemsError) {
      console.error("Error creating line items table:", lineItemsError);
      return false;
    }

    // Create payment history table
    const { error: paymentsError } = await supabase.rpc("exec_sql", {
      sql: `
        -- Create payment history table
        CREATE TABLE IF NOT EXISTS invoice_payments (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            invoice_id UUID NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
            amount DECIMAL(10,2) NOT NULL,
            payment_method TEXT NOT NULL,
            payment_reference TEXT,
            paypal_transaction_id TEXT,
            status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
            processed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            notes TEXT
        );
      `,
    });

    if (paymentsError) {
      console.error("Error creating payments table:", paymentsError);
      return false;
    }

    console.log("✅ Invoice database tables created successfully!");
    return true;
  } catch (error) {
    console.error("❌ Error setting up invoice database:", error);
    return false;
  }
}

// Function to create sample invoice data
export async function createSampleInvoiceData() {
  console.log("📝 Creating sample invoice data...");

  try {
    // Get a sample user
    const { data: users, error: usersError } = await supabase
      .from("users")
      .select("id, name, email")
      .limit(1);

    if (usersError || !users || users.length === 0) {
      console.log("No users found, cannot create sample invoices");
      return false;
    }

    const sampleUser = users[0];

    // Get current user (admin/designer)
    const {
      data: { user: currentUser },
      error: currentUserError,
    } = await supabase.auth.getUser();

    if (currentUserError || !currentUser) {
      console.log("No authenticated user, using sample user as designer");
    }

    // Create sample invoice
    const { data: invoice, error: invoiceError } = await supabase
      .from("invoices")
      .insert({
        title: "Website Design Project",
        description: "Complete website redesign with modern UI/UX",
        user_id: sampleUser.id,
        designer_id: currentUser?.id || sampleUser.id,
        subtotal: 2500.0,
        tax_rate: 8.25,
        tax_amount: 206.25,
        total_amount: 2706.25,
        status: "sent",
        due_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(), // 14 days from now
      })
      .select()
      .single();

    if (invoiceError) {
      console.error("Error creating sample invoice:", invoiceError);
      return false;
    }

    // Add line items
    const { error: lineItemsError } = await supabase
      .from("invoice_line_items")
      .insert([
        {
          invoice_id: invoice.id,
          description: "UI/UX Design",
          quantity: 1,
          unit_price: 1500.0,
          total_price: 1500.0,
          item_type: "design",
        },
        {
          invoice_id: invoice.id,
          description: "Frontend Development",
          quantity: 1,
          unit_price: 800.0,
          total_price: 800.0,
          item_type: "service",
        },
        {
          invoice_id: invoice.id,
          description: "Testing & Optimization",
          quantity: 1,
          unit_price: 200.0,
          total_price: 200.0,
          item_type: "service",
        },
      ]);

    if (lineItemsError) {
      console.error("Error creating sample line items:", lineItemsError);
      return false;
    }

    console.log("✅ Sample invoice data created successfully!");
    console.log(`Invoice ID: ${invoice.id}`);
    console.log(`Invoice Number: ${invoice.invoice_number}`);
    return true;
  } catch (error) {
    console.error("❌ Error creating sample invoice data:", error);
    return false;
  }
}

// Function to automatically set up everything
export async function setupInvoiceSystem() {
  console.log("🚀 Setting up complete invoice system...");

  const dbSetup = await setupInvoiceDatabase();
  if (!dbSetup) {
    console.error("❌ Failed to set up database tables");
    return false;
  }

  const sampleData = await createSampleInvoiceData();
  if (!sampleData) {
    console.log("⚠️ Failed to create sample data, but database is ready");
  }

  console.log("🎉 Invoice system setup complete!");
  return true;
}
