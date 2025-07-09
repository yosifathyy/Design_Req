import { supabase } from "./supabase";
import { Database } from "./database.types";

export type Invoice = Database["public"]["Tables"]["invoices"]["Row"];
export type InvoiceInsert = Database["public"]["Tables"]["invoices"]["Insert"];
export type InvoiceUpdate = Database["public"]["Tables"]["invoices"]["Update"];
export type InvoiceLineItem =
  Database["public"]["Tables"]["invoice_line_items"]["Row"];
export type InvoiceLineItemInsert =
  Database["public"]["Tables"]["invoice_line_items"]["Insert"];
export type InvoicePayment =
  Database["public"]["Tables"]["invoice_payments"]["Row"];
export type InvoicePaymentInsert =
  Database["public"]["Tables"]["invoice_payments"]["Insert"];

export interface InvoiceWithDetails extends Invoice {
  line_items: InvoiceLineItem[];
  payments: InvoicePayment[];
  design_request?: {
    id: string;
    title: string;
    description: string;
  };
  client: {
    id: string;
    name: string;
    email: string;
  };
  designer?: {
    id: string;
    name: string;
    email: string;
  };
}

export interface CreateInvoiceData {
  title: string;
  description?: string;
  designRequestId?: string;
  clientId: string;
  dueDate?: string;
  taxRate?: number;
  notes?: string;
  terms?: string;
  lineItems: {
    description: string;
    quantity: number;
    unitPrice: number;
    itemType?: InvoiceLineItem["item_type"];
  }[];
}

export const invoicesApi = {
  // Get all invoices with details
  async getAll(): Promise<InvoiceWithDetails[]> {
    const { data, error } = await supabase
      .from("invoices")
      .select(
        `
        *,
        line_items:invoice_line_items(*),
        payments:invoice_payments(*),
        design_request:design_request_id(id, title, description),
        client:user_id(id, name, email),
        designer:designer_id(id, name, email)
      `,
      )
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching invoices:", error);
      throw error;
    }

    return data as InvoiceWithDetails[];
  },

  // Get invoice by ID
  async getById(id: string): Promise<InvoiceWithDetails> {
    const { data, error } = await supabase
      .from("invoices")
      .select(
        `
        *,
        line_items:invoice_line_items(*),
        payments:invoice_payments(*),
        design_request:design_request_id(id, title, description),
        client:user_id(id, name, email),
        designer:designer_id(id, name, email)
      `,
      )
      .eq("id", id)
      .single();

    if (error) {
      console.error("Error fetching invoice:", error);
      throw error;
    }

    return data as InvoiceWithDetails;
  },

  // Get invoices for current user
  async getMyInvoices(): Promise<InvoiceWithDetails[]> {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      throw new Error("User not authenticated");
    }

    const { data, error } = await supabase
      .from("invoices")
      .select(
        `
        *,
        line_items:invoice_line_items(*),
        payments:invoice_payments(*),
        design_request:design_request_id(id, title, description),
        client:user_id(id, name, email),
        designer:designer_id(id, name, email)
      `,
      )
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching user invoices:", error);
      throw error;
    }

    return data as InvoiceWithDetails[];
  },

  // Create new invoice
  async create(invoiceData: CreateInvoiceData): Promise<InvoiceWithDetails> {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      throw new Error("User not authenticated");
    }

    // Calculate totals
    const subtotal = invoiceData.lineItems.reduce(
      (sum, item) => sum + item.quantity * item.unitPrice,
      0,
    );
    const taxRate = invoiceData.taxRate || 0;
    const taxAmount = (subtotal * taxRate) / 100;
    const totalAmount = subtotal + taxAmount;

    // Create invoice
    const { data: invoice, error: invoiceError } = await supabase
      .from("invoices")
      .insert({
        title: invoiceData.title,
        description: invoiceData.description,
        design_request_id: invoiceData.designRequestId,
        user_id: invoiceData.clientId,
        designer_id: user.id,
        subtotal,
        tax_rate: taxRate,
        tax_amount: taxAmount,
        total_amount: totalAmount,
        due_date: invoiceData.dueDate,
        notes: invoiceData.notes,
        terms: invoiceData.terms,
        status: "draft",
      })
      .select()
      .single();

    if (invoiceError) {
      console.error("Error creating invoice:", {
        error: invoiceError,
        message: invoiceError.message,
        details: invoiceError.details,
        hint: invoiceError.hint,
        code: invoiceError.code,
      });
      throw new Error(
        `Failed to create invoice: ${invoiceError.message || JSON.stringify(invoiceError)}`,
      );
    }

    // Create line items
    const lineItemsToInsert: InvoiceLineItemInsert[] =
      invoiceData.lineItems.map((item) => ({
        invoice_id: invoice.id,
        description: item.description,
        quantity: item.quantity,
        unit_price: item.unitPrice,
        total_price: item.quantity * item.unitPrice,
        item_type: item.itemType || "service",
      }));

    const { error: lineItemsError } = await supabase
      .from("invoice_line_items")
      .insert(lineItemsToInsert);

    if (lineItemsError) {
      console.error("Error creating line items:", {
        error: lineItemsError,
        message: lineItemsError.message,
        details: lineItemsError.details,
        hint: lineItemsError.hint,
        code: lineItemsError.code,
      });
      // Clean up the invoice if line items failed
      await supabase.from("invoices").delete().eq("id", invoice.id);
      throw new Error(
        `Failed to create invoice line items: ${lineItemsError.message || JSON.stringify(lineItemsError)}`,
      );
    }

    // Return the complete invoice
    return this.getById(invoice.id);
  },

  // Update invoice
  async update(
    id: string,
    updates: InvoiceUpdate,
  ): Promise<InvoiceWithDetails> {
    const { data, error } = await supabase
      .from("invoices")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error updating invoice:", error);
      throw error;
    }

    return this.getById(id);
  },

  // Send invoice to client
  async sendInvoice(id: string): Promise<InvoiceWithDetails> {
    return this.update(id, {
      status: "sent",
      sent_at: new Date().toISOString(),
    });
  },

  // Mark invoice as paid
  async markAsPaid(
    id: string,
    paymentData: {
      paymentMethod: Invoice["payment_method"];
      paymentReference?: string;
      paypalOrderId?: string;
      paypalPayerId?: string;
      transactionId?: string;
      amount: number;
    },
  ): Promise<InvoiceWithDetails> {
    // Update invoice status
    const { data: invoice, error: updateError } = await supabase
      .from("invoices")
      .update({
        status: "paid",
        paid_at: new Date().toISOString(),
        payment_method: paymentData.paymentMethod,
        payment_reference: paymentData.paymentReference,
        paypal_order_id: paymentData.paypalOrderId,
        paypal_payer_id: paymentData.paypalPayerId,
      })
      .eq("id", id)
      .select()
      .single();

    if (updateError) {
      console.error("Error updating invoice payment status:", updateError);
      throw updateError;
    }

    // Record payment
    const { error: paymentError } = await supabase
      .from("invoice_payments")
      .insert({
        invoice_id: id,
        amount: paymentData.amount,
        payment_method: paymentData.paymentMethod || "paypal",
        payment_reference: paymentData.paymentReference,
        paypal_transaction_id: paymentData.transactionId,
        status: "completed",
      });

    if (paymentError) {
      console.error("Error recording payment:", paymentError);
      // Don't throw here as the invoice is already marked as paid
    }

    // If this invoice is for a design request, mark the request as delivered
    if (invoice.design_request_id) {
      const { error: requestError } = await supabase
        .from("design_requests")
        .update({
          status: "delivered",
          updated_at: new Date().toISOString(),
        })
        .eq("id", invoice.design_request_id);

      if (requestError) {
        console.error("Error updating design request status:", requestError);
      }
    }

    return this.getById(id);
  },

  // Delete invoice
  async delete(id: string): Promise<boolean> {
    const { error } = await supabase.from("invoices").delete().eq("id", id);

    if (error) {
      console.error("Error deleting invoice:", error);
      throw error;
    }

    return true;
  },

  // Get invoice statistics
  async getStats(): Promise<{
    totalRevenue: number;
    paidInvoices: number;
    pendingInvoices: number;
    overdueInvoices: number;
    thisMonthRevenue: number;
  }> {
    const { data: invoices, error } = await supabase
      .from("invoices")
      .select("total_amount, status, paid_at, due_date");

    if (error) {
      console.error("Error fetching invoice stats:", error);
      throw error;
    }

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const stats = invoices.reduce(
      (acc, invoice) => {
        // Total revenue from paid invoices
        if (invoice.status === "paid") {
          acc.totalRevenue += invoice.total_amount;
          acc.paidInvoices += 1;

          // This month revenue
          if (invoice.paid_at && new Date(invoice.paid_at) >= startOfMonth) {
            acc.thisMonthRevenue += invoice.total_amount;
          }
        }

        // Pending invoices
        if (invoice.status === "sent") {
          acc.pendingInvoices += 1;

          // Check if overdue
          if (invoice.due_date && new Date(invoice.due_date) < now) {
            acc.overdueInvoices += 1;
          }
        }

        return acc;
      },
      {
        totalRevenue: 0,
        paidInvoices: 0,
        pendingInvoices: 0,
        overdueInvoices: 0,
        thisMonthRevenue: 0,
      },
    );

    return stats;
  },
};

// Real-time subscription for invoices
export const subscribeToInvoices = (
  callback: (invoices: InvoiceWithDetails[]) => void,
) => {
  const channel = supabase
    .channel("invoices-changes")
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "invoices",
      },
      () => {
        // Refetch invoices when changes occur
        invoicesApi.getAll().then(callback).catch(console.error);
      },
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
};
