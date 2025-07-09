import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { gsap } from "gsap";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { simpleInvoicesApi, SimpleInvoice } from "@/lib/invoices-simple-api";
import InvoiceView from "@/components/InvoiceView";
import { ArrowLeft, Edit, Send, Trash2, Loader2 } from "lucide-react";

const InvoiceDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const [invoice, setInvoice] = useState<InvoiceWithDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (!id) {
      navigate("/admin/invoices");
      return;
    }

    const loadInvoice = async () => {
      try {
        setLoading(true);
        const invoiceData = await invoicesApi.getById(id);
        setInvoice(invoiceData);
      } catch (error) {
        console.error("Error loading invoice:", error);
        toast({
          title: "Error loading invoice",
          description: "Failed to load invoice details",
          variant: "destructive",
        });
        navigate("/admin/invoices");
      } finally {
        setLoading(false);
      }
    };

    loadInvoice();
  }, [id, navigate, toast]);

  useEffect(() => {
    if (!containerRef.current || loading) return;
    gsap.fromTo(
      containerRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" },
    );
  }, [loading]);

  const handleSendInvoice = async () => {
    if (!invoice || invoice.status !== "draft") return;

    try {
      setUpdating(true);
      const updatedInvoice = await invoicesApi.sendInvoice(invoice.id);
      setInvoice(updatedInvoice);

      toast({
        title: "Invoice Sent! 📧",
        description: `Invoice ${updatedInvoice.invoice_number} has been sent to ${updatedInvoice.client.name}.`,
      });
    } catch (error) {
      console.error("Error sending invoice:", error);
      toast({
        title: "Error sending invoice",
        description: "Failed to send invoice. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUpdating(false);
    }
  };

  const handleDeleteInvoice = async () => {
    if (!invoice) return;

    const confirmed = window.confirm(
      `Are you sure you want to delete invoice ${invoice.invoice_number}? This action cannot be undone.`,
    );

    if (!confirmed) return;

    try {
      setUpdating(true);
      await invoicesApi.delete(invoice.id);

      toast({
        title: "Invoice Deleted",
        description: `Invoice ${invoice.invoice_number} has been deleted.`,
      });

      navigate("/admin/invoices");
    } catch (error) {
      console.error("Error deleting invoice:", error);
      toast({
        title: "Error deleting invoice",
        description: "Failed to delete invoice. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUpdating(false);
    }
  };

  const handleDownload = () => {
    if (!invoice) return;

    // Generate PDF (you can enhance this with a proper PDF library)
    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Invoice ${invoice.invoice_number}</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 40px; line-height: 1.6; }
              .header { border-bottom: 3px solid #000; padding-bottom: 20px; margin-bottom: 30px; }
              .company { text-align: right; margin-bottom: 20px; }
              .bill-to { margin-bottom: 30px; }
              .invoice-details { margin-bottom: 30px; }
              .line-items { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
              .line-items th, .line-items td { border: 1px solid #000; padding: 12px; text-align: left; }
              .line-items th { background-color: #f0f0f0; font-weight: bold; }
              .totals { text-align: right; margin-bottom: 30px; }
              .total-line { margin-bottom: 10px; }
              .grand-total { border-top: 2px solid #000; padding-top: 10px; font-weight: bold; font-size: 1.2em; }
              .notes { margin-top: 30px; }
            </style>
          </head>
          <body>
            <div class="company">
              <h1>Design Agency</h1>
              <p>Professional Design Services</p>
            </div>

            <div class="header">
              <h1>INVOICE ${invoice.invoice_number}</h1>
              <h2>${invoice.title}</h2>
            </div>

            <div class="bill-to">
              <h3>Bill To:</h3>
              <p><strong>${invoice.client.name}</strong></p>
              <p>${invoice.client.email}</p>
            </div>

            <div class="invoice-details">
              <p><strong>Invoice Date:</strong> ${new Date(invoice.created_at).toLocaleDateString()}</p>
              ${invoice.due_date ? `<p><strong>Due Date:</strong> ${new Date(invoice.due_date).toLocaleDateString()}</p>` : ""}
              ${invoice.sent_at ? `<p><strong>Sent Date:</strong> ${new Date(invoice.sent_at).toLocaleDateString()}</p>` : ""}
              ${invoice.paid_at ? `<p><strong>Paid Date:</strong> ${new Date(invoice.paid_at).toLocaleDateString()}</p>` : ""}
            </div>

            <table class="line-items">
              <thead>
                <tr>
                  <th>Description</th>
                  <th>Type</th>
                  <th>Quantity</th>
                  <th>Unit Price</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                ${invoice.line_items
                  .map(
                    (item) => `
                  <tr>
                    <td>${item.description}</td>
                    <td>${item.item_type}</td>
                    <td>${item.quantity}</td>
                    <td>$${item.unit_price.toFixed(2)}</td>
                    <td>$${item.total_price.toFixed(2)}</td>
                  </tr>
                `,
                  )
                  .join("")}
              </tbody>
            </table>

            <div class="totals">
              <div class="total-line">
                <strong>Subtotal: $${invoice.subtotal.toFixed(2)}</strong>
              </div>
              ${
                invoice.tax_amount > 0
                  ? `
                <div class="total-line">
                  <strong>Tax (${invoice.tax_rate}%): $${invoice.tax_amount.toFixed(2)}</strong>
                </div>
              `
                  : ""
              }
              <div class="grand-total">
                <strong>Total: $${invoice.total_amount.toFixed(2)}</strong>
              </div>
            </div>

            ${
              invoice.notes
                ? `
              <div class="notes">
                <h3>Notes:</h3>
                <p>${invoice.notes}</p>
              </div>
            `
                : ""
            }

            ${
              invoice.terms
                ? `
              <div class="notes">
                <h3>Payment Terms:</h3>
                <p>${invoice.terms}</p>
              </div>
            `
                : ""
            }

            <div class="notes">
              <p><em>Thank you for your business!</em></p>
            </div>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-16 h-16 animate-spin mx-auto mb-4 text-festival-orange" />
          <p className="text-lg font-medium text-black">Loading invoice...</p>
        </div>
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">❌</div>
          <h3 className="text-2xl font-bold text-black mb-2">
            Invoice Not Found
          </h3>
          <p className="text-black/70 mb-6">
            The invoice you're looking for doesn't exist.
          </p>
          <Button
            onClick={() => navigate("/admin/invoices")}
            className="bg-festival-orange hover:bg-festival-amber border-4 border-black"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Invoices
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            onClick={() => navigate("/admin/invoices")}
            variant="outline"
            className="border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Invoices
          </Button>
          <div>
            <h1 className="text-4xl font-display font-bold text-black">
              Invoice #{invoice.invoice_number}
            </h1>
            <p className="text-xl text-black/70 font-medium">
              {invoice.title} • {invoice.client.name}
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          {invoice.status === "draft" && (
            <Button
              onClick={handleSendInvoice}
              disabled={updating}
              className="bg-gradient-to-r from-blue-400 to-blue-500 hover:from-blue-500 hover:to-blue-600 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1"
            >
              {updating ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Send className="w-4 h-4 mr-2" />
              )}
              Send Invoice
            </Button>
          )}

          <Button
            onClick={() => navigate(`/admin/invoices/${invoice.id}/edit`)}
            variant="outline"
            disabled={invoice.status === "paid"}
            className="border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1"
          >
            <Edit className="w-4 h-4 mr-2" />
            Edit
          </Button>

          {invoice.status === "draft" && (
            <Button
              onClick={handleDeleteInvoice}
              disabled={updating}
              variant="outline"
              className="border-4 border-red-500 text-red-500 hover:bg-red-50 shadow-[4px_4px_0px_0px_rgba(239,68,68,1)] hover:shadow-[2px_2px_0px_0px_rgba(239,68,68,1)] hover:translate-x-1 hover:translate-y-1"
            >
              {updating ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Trash2 className="w-4 h-4 mr-2" />
              )}
              Delete
            </Button>
          )}
        </div>
      </div>

      {/* Invoice View */}
      <InvoiceView
        invoice={invoice}
        showPayment={false} // Admin view doesn't show payment
        onDownload={handleDownload}
        onPrint={handlePrint}
      />

      {/* Share Link for Client */}
      <div className="border-4 border-black bg-festival-cream p-6">
        <h3 className="text-lg font-bold text-black mb-2">
          Client Payment Link
        </h3>
        <p className="text-black/70 mb-4">
          Share this link with your client so they can view and pay the invoice:
        </p>
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={`${window.location.origin}/invoices/${invoice.id}`}
            readOnly
            className="flex-1 p-3 border-2 border-black bg-white font-mono text-sm"
          />
          <Button
            onClick={() => {
              navigator.clipboard.writeText(
                `${window.location.origin}/invoices/${invoice.id}`,
              );
              toast({
                title: "Link Copied!",
                description: "Payment link copied to clipboard",
              });
            }}
            variant="outline"
            className="border-2 border-black"
          >
            Copy Link
          </Button>
        </div>
      </div>
    </div>
  );
};

export default InvoiceDetail;
