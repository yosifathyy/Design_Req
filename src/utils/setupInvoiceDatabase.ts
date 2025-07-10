import { supabase } from "@/integrations/supabase/client";

export const setupInvoiceDatabase = async (): Promise<{ success: boolean; error?: string }> => {
  try {
    console.log("🔄 Verifying invoice database setup...");

    // Test invoice table accessibility
    const { data, error } = await supabase
      .from('invoices')
      .select('id')
      .limit(1);

    if (error) {
      console.error("Invoice table access failed:", error);
      return { success: false, error: error.message };
    }

    // Test invoice line items table
    const { error: lineItemsError } = await supabase
      .from('invoice_line_items')
      .select('id')
      .limit(1);

    if (lineItemsError) {
      console.error("Invoice line items table access failed:", lineItemsError);
      return { success: false, error: lineItemsError.message };
    }

    // Test invoice payments table
    const { error: paymentsError } = await supabase
      .from('invoice_payments')
      .select('id')
      .limit(1);

    if (paymentsError) {
      console.error("Invoice payments table access failed:", paymentsError);
      return { success: false, error: paymentsError.message };
    }

    console.log("✅ Invoice database verification completed");
    return { success: true };

  } catch (error: any) {
    console.error("Invoice database setup failed:", error);
    return { success: false, error: error.message };
  }
};

export const setupInvoiceSystem = async (): Promise<{ success: boolean; error?: string }> => {
  try {
    console.log("🔄 Setting up invoice system...");

    // Verify all invoice-related tables exist and are accessible
    const result = await setupInvoiceDatabase();
    
    if (!result.success) {
      return result;
    }

    console.log("✅ Invoice system setup completed");
    return { success: true };

  } catch (error: any) {
    console.error("Invoice system setup failed:", error);
    return { success: false, error: error.message };
  }
};
