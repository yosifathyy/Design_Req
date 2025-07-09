import { supabase } from "./supabase";
import { Database } from "./database.types";

// Simplified invoice API that uses existing design_requests table
// with additional metadata stored in the description field

export interface SimpleInvoice {
  id: string;
  invoiceNumber: string;
  title: string;
  description: string;
  clientId: string;
  clientName: string;
  clientEmail: string;
  designerId?: string;
  amount: number;
  taxRate: number;
  taxAmount: number;
  totalAmount: number;
  status: "draft" | "sent" | "paid" | "cancelled";
  dueDate?: string;
  sentAt?: string;
  paidAt?: string;
  paymentMethod?: string;
  paypalOrderId?: string;
  notes?: string;
  terms?: string;
  lineItems: {
    description: string;
    quantity: number;
    unitPrice: number;
    itemType: string;
  }[];
  createdAt: string;
  updatedAt: string;
}

// Store invoice data in design_requests table with JSON metadata
export const simpleInvoicesApi = {
  // Get all invoices
  async getAll(): Promise<SimpleInvoice[]> {
    try {
      const { data: requests, error } = await supabase
        .from("design_requests")
        .select(
          `
          *,
          client:user_id(id, name, email),
          designer:designer_id(id, name, email)
        `,
        )
        .eq("category", "invoice") // Use category to filter invoices
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching invoices:", {
          error,
          message: error.message,
          details: error.details,
        });
        throw new Error(`Failed to fetch invoices: ${error.message}`);
      }

      if (!requests) return [];

      return requests.map((request) => this.parseInvoiceFromRequest(request));
    } catch (error) {
      console.error("Error in getAll:", error);
      throw error;
    }
  },

  // Get invoice by ID
  async getById(id: string): Promise<SimpleInvoice> {
    try {
      const { data: request, error } = await supabase
        .from("design_requests")
        .select(
          `
          *,
          client:user_id(id, name, email),
          designer:designer_id(id, name, email)
        `,
        )
        .eq("id", id)
        .eq("category", "invoice")
        .single();

      if (error) {
        console.error("Error fetching invoice:", {
          error,
          message: error.message,
          details: error.details,
        });
        throw new Error(`Failed to fetch invoice: ${error.message}`);
      }

      return this.parseInvoiceFromRequest(request);
    } catch (error) {
      console.error("Error in getById:", error);
      throw error;
    }
  },

  // Create new invoice
  async create(invoiceData: {
    title: string;
    description?: string;
    clientId: string;
    dueDate?: string;
    taxRate?: number;
    notes?: string;
    terms?: string;
    lineItems: {
      description: string;
      quantity: number;
      unitPrice: number;
      itemType?: string;
    }[];
  }): Promise<SimpleInvoice> {
    try {
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

      // Generate invoice number
      const invoiceNumber = `INV-${Date.now()}`;

      // Create invoice metadata
      const invoiceMetadata = {
        invoiceNumber,
        subtotal,
        taxRate,
        taxAmount,
        totalAmount,
        dueDate: invoiceData.dueDate,
        notes: invoiceData.notes,
        terms: invoiceData.terms,
        lineItems: invoiceData.lineItems,
        status: "draft",
        type: "invoice",
      };

      // Store as design request with special category
      const { data: request, error } = await supabase
        .from("design_requests")
        .insert({
          title: invoiceData.title,
          description: JSON.stringify(invoiceMetadata), // Store metadata in description
          category: "invoice", // Special category for invoices
          priority: "medium",
          status: "draft",
          user_id: invoiceData.clientId,
          designer_id: user.id,
          price: totalAmount,
        })
        .select(
          `
          *,
          client:user_id(id, name, email),
          designer:designer_id(id, name, email)
        `,
        )
        .single();

      if (error) {
        console.error("Error creating invoice:", {
          error,
          message: error.message,
          details: error.details,
        });
        throw new Error(`Failed to create invoice: ${error.message}`);
      }

      return this.parseInvoiceFromRequest(request);
    } catch (error) {
      console.error("Error in create:", error);
      throw error;
    }
  },

  // Send invoice
  async sendInvoice(id: string): Promise<SimpleInvoice> {
    try {
      const { data: request, error } = await supabase
        .from("design_requests")
        .update({
          status: "submitted",
          updated_at: new Date().toISOString(),
        })
        .eq("id", id)
        .eq("category", "invoice")
        .select(
          `
          *,
          client:user_id(id, name, email),
          designer:designer_id(id, name, email)
        `,
        )
        .single();

      if (error) {
        console.error("Error sending invoice:", {
          error,
          message: error.message,
          details: error.details,
        });
        throw new Error(`Failed to send invoice: ${error.message}`);
      }

      return this.parseInvoiceFromRequest(request);
    } catch (error) {
      console.error("Error in sendInvoice:", error);
      throw error;
    }
  },

  // Mark as paid
  async markAsPaid(
    id: string,
    paymentData: {
      paymentMethod: string;
      paypalOrderId?: string;
      transactionId?: string;
      amount: number;
    },
  ): Promise<SimpleInvoice> {
    try {
      // Get current invoice
      const currentInvoice = await this.getById(id);

      // Update metadata with payment info
      const metadata = JSON.parse(currentInvoice.description);
      metadata.status = "paid";
      metadata.paidAt = new Date().toISOString();
      metadata.paymentMethod = paymentData.paymentMethod;
      metadata.paypalOrderId = paymentData.paypalOrderId;
      metadata.transactionId = paymentData.transactionId;

      const { data: request, error } = await supabase
        .from("design_requests")
        .update({
          status: "delivered", // Mark as delivered when paid
          description: JSON.stringify(metadata),
          updated_at: new Date().toISOString(),
        })
        .eq("id", id)
        .eq("category", "invoice")
        .select(
          `
          *,
          client:user_id(id, name, email),
          designer:designer_id(id, name, email)
        `,
        )
        .single();

      if (error) {
        console.error("Error marking invoice as paid:", {
          error,
          message: error.message,
          details: error.details,
        });
        throw new Error(`Failed to mark invoice as paid: ${error.message}`);
      }

      return this.parseInvoiceFromRequest(request);
    } catch (error) {
      console.error("Error in markAsPaid:", error);
      throw error;
    }
  },

  // Helper function to parse invoice from design request
  parseInvoiceFromRequest(request: any): SimpleInvoice {
    let metadata: any = {};

    try {
      if (request.description) {
        metadata = JSON.parse(request.description);
      }
    } catch (e) {
      console.warn("Failed to parse invoice metadata:", e);
    }

    const status =
      request.status === "delivered" && metadata.paidAt
        ? "paid"
        : request.status === "submitted"
          ? "sent"
          : request.status === "cancelled"
            ? "cancelled"
            : "draft";

    return {
      id: request.id,
      invoiceNumber: metadata.invoiceNumber || `INV-${request.id.slice(0, 8)}`,
      title: request.title,
      description: request.description,
      clientId: request.user_id,
      clientName: (request.client as any)?.name || "Unknown Client",
      clientEmail: (request.client as any)?.email || "",
      designerId: request.designer_id,
      amount: metadata.subtotal || request.price || 0,
      taxRate: metadata.taxRate || 0,
      taxAmount: metadata.taxAmount || 0,
      totalAmount: metadata.totalAmount || request.price || 0,
      status,
      dueDate: metadata.dueDate,
      sentAt: request.status === "submitted" ? request.updated_at : undefined,
      paidAt: metadata.paidAt,
      paymentMethod: metadata.paymentMethod,
      paypalOrderId: metadata.paypalOrderId,
      notes: metadata.notes,
      terms: metadata.terms,
      lineItems: metadata.lineItems || [
        {
          description: request.title,
          quantity: 1,
          unitPrice: request.price || 0,
          itemType: "service",
        },
      ],
      createdAt: request.created_at,
      updatedAt: request.updated_at,
    };
  },

  // Get stats
  async getStats() {
    try {
      const invoices = await this.getAll();

      const stats = invoices.reduce(
        (acc, invoice) => {
          if (invoice.status === "paid") {
            acc.totalRevenue += invoice.totalAmount;
            acc.paidInvoices += 1;

            // This month revenue
            const paidDate = new Date(invoice.paidAt!);
            const now = new Date();
            if (
              paidDate.getMonth() === now.getMonth() &&
              paidDate.getFullYear() === now.getFullYear()
            ) {
              acc.thisMonthRevenue += invoice.totalAmount;
            }
          }

          if (invoice.status === "sent") {
            acc.pendingInvoices += 1;

            // Check if overdue
            if (invoice.dueDate && new Date(invoice.dueDate) < new Date()) {
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
    } catch (error) {
      console.error("Error getting stats:", error);
      throw error;
    }
  },
};
