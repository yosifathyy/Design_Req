import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { gsap } from "gsap";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { simpleInvoicesApi, SimpleInvoice } from "@/lib/invoices-simple-api";
import InvoiceView from "@/components/InvoiceView";
import { ArrowLeft, Loader2, CheckCircle, XCircle } from "lucide-react";

const InvoicePayment: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const [invoice, setInvoice] = useState<SimpleInvoice | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) {
      navigate("/");
      return;
    }

    const loadInvoice = async () => {
      try {
        setLoading(true);
        console.log("🔍 Loading invoice for payment with ID:", id);
        const invoiceData = await simpleInvoicesApi.getById(id);
        console.log("✅ Invoice loaded for payment:", invoiceData);
        setInvoice(invoiceData);
      } catch (error) {
        console.error("❌ Error loading invoice:", error);
        const errorMessage =
          error instanceof Error ? error.message : "Unknown error occurred";
        toast({
          title: "Invoice not found",
          description: errorMessage.includes("Network")
            ? "Network error. Please check your connection and try again."
            : "The invoice you're looking for doesn't exist or you don't have permission to view it.",
          variant: "destructive",
        });
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

  const handlePaymentSuccess = (updatedInvoice: SimpleInvoice) => {
    setInvoice(updatedInvoice);

    // Show success animation
    const successEl = document.createElement("div");
    successEl.className =
      "fixed inset-0 flex items-center justify-center z-50 bg-black/50";
    successEl.innerHTML = `
      <div class="bg-white border-4 border-black p-8 text-center shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] max-w-md">
        <div class="text-6xl mb-4">🎉</div>
        <h3 class="text-2xl font-bold text-black mb-2">Payment Successful!</h3>
        <p class="text-black/70 mb-4">Thank you for your payment. Your project will be delivered soon!</p>
        <div class="text-sm text-black/60">
          <p>Invoice: ${updatedInvoice.invoice_number}</p>
          <p>Amount: $${updatedInvoice.total_amount.toFixed(2)}</p>
        </div>
      </div>
    `;
    document.body.appendChild(successEl);

    setTimeout(() => {
      document.body.removeChild(successEl);
    }, 5000);

    toast({
      title: "Payment Successful! 🎉",
      description: `Payment of $${updatedInvoice.total_amount.toFixed(2)} has been processed successfully.`,
    });
  };

  const handlePaymentError = (error: any) => {
    console.error("Payment error:", error);
    toast({
      title: "Payment Error",
      description:
        "There was an error processing your payment. Please try again or contact support.",
      variant: "destructive",
    });
  };

  const handleDownload = () => {
    if (!invoice) return;

    // Generate client-friendly PDF
    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Invoice ${invoice.invoice_number}</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 40px; line-height: 1.6; color: #333; }
              .header { text-align: center; border-bottom: 2px solid #000; padding-bottom: 20px; margin-bottom: 30px; }
              .company { text-align: center; margin-bottom: 20px; }
              .invoice-info { display: flex; justify-content: space-between; margin-bottom: 30px; }
              .bill-to { margin-bottom: 30px; }
              .line-items { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
              .line-items th, .line-items td { border: 1px solid #ddd; padding: 12px; text-align: left; }
              .line-items th { background-color: #f8f9fa; font-weight: bold; }
              .totals { text-align: right; margin-bottom: 30px; }
              .total-line { margin-bottom: 8px; }
              .grand-total { border-top: 2px solid #000; padding-top: 10px; font-weight: bold; font-size: 1.2em; }
              .payment-info { background-color: #d4edda; padding: 15px; border: 1px solid #c3e6cb; border-radius: 5px; margin-bottom: 20px; }
              .notes { margin-top: 30px; }
              .footer { text-align: center; margin-top: 50px; color: #666; }
            </style>
          </head>
          <body>
            <div class="company">
              <h1>Design Agency</h1>
              <p>Professional Design Services</p>
              <p>Email: hello@designagency.com | Phone: (555) 123-4567</p>
            </div>

            <div class="header">
              <h1>INVOICE ${invoice.invoice_number}</h1>
              <h2>${invoice.title}</h2>
            </div>

            <div class="invoice-info">
              <div class="bill-to">
                <h3>Bill To:</h3>
                <p><strong>${invoice.client.name}</strong></p>
                <p>${invoice.client.email}</p>
              </div>
              <div>
                <p><strong>Invoice Date:</strong> ${new Date(invoice.created_at).toLocaleDateString()}</p>
                ${invoice.due_date ? `<p><strong>Due Date:</strong> ${new Date(invoice.due_date).toLocaleDateString()}</p>` : ""}
                <p><strong>Status:</strong> ${invoice.status.toUpperCase()}</p>
              </div>
            </div>

            ${
              invoice.status === "paid"
                ? `
              <div class="payment-info">
                <h3>✅ PAYMENT RECEIVED</h3>
                <p><strong>Paid on:</strong> ${new Date(invoice.paid_at!).toLocaleDateString()}</p>
                <p><strong>Payment Method:</strong> ${invoice.payment_method || "PayPal"}</p>
                ${invoice.paypal_order_id ? `<p><strong>Transaction ID:</strong> ${invoice.paypal_order_id}</p>` : ""}
              </div>
            `
                : ""
            }

            <table class="line-items">
              <thead>
                <tr>
                  <th>Description</th>
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
                    <td>
                      <strong>${item.description}</strong>
                      <br><small>${item.item_type}</small>
                    </td>
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
                <strong>TOTAL: $${invoice.total_amount.toFixed(2)}</strong>
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

            <div class="footer">
              <p><em>Thank you for your business!</em></p>
              <p>For questions about this invoice, please contact us at hello@designagency.com</p>
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
      <div className="min-h-screen flex items-center justify-center bg-festival-cream">
        <div className="text-center">
          <Loader2 className="w-16 h-16 animate-spin mx-auto mb-4 text-festival-orange" />
          <p className="text-lg font-medium text-black">Loading invoice...</p>
        </div>
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-festival-cream">
        <div className="text-center">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-black mb-2">
            Invoice Not Found
          </h3>
          <p className="text-black/70 mb-6">
            The invoice you're looking for doesn't exist or you don't have
            permission to view it.
          </p>
          <Button
            onClick={() => navigate("/")}
            className="bg-festival-orange hover:bg-festival-amber border-4 border-black"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-festival-cream">
      {/* Header */}
      <div className="bg-white border-b-4 border-black">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                onClick={() => navigate("/")}
                variant="outline"
                className="border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Home
              </Button>
              <div>
                <h1 className="text-3xl font-display font-bold text-black">
                  Design Agency
                </h1>
                <p className="text-black/70">Professional Design Services</p>
              </div>
            </div>

            {invoice.status === "paid" && (
              <div className="flex items-center gap-2 bg-green-100 border-2 border-green-500 px-4 py-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="font-bold text-green-700">PAID</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div ref={containerRef} className="container mx-auto px-6 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Payment Status Banner */}
          {invoice.status === "paid" && (
            <div className="mb-6 p-6 bg-green-50 border-4 border-green-500 text-center">
              <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-3" />
              <h2 className="text-2xl font-bold text-green-700 mb-2">
                Payment Received!
              </h2>
              <p className="text-green-600">
                Thank you for your payment. Your project will be delivered soon.
              </p>
              {invoice.paid_at && (
                <p className="text-sm text-green-600 mt-2">
                  Paid on {new Date(invoice.paid_at).toLocaleDateString()}
                </p>
              )}
            </div>
          )}

          {/* Invoice View */}
          <InvoiceView
            invoice={invoice}
            showPayment={invoice.status === "sent"} // Only show payment for sent invoices
            onPaymentSuccess={handlePaymentSuccess}
            onPaymentError={handlePaymentError}
            onDownload={handleDownload}
            onPrint={handlePrint}
          />

          {/* Contact Information */}
          <div className="mt-8 p-6 bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] text-center">
            <h3 className="text-lg font-bold text-black mb-2">
              Questions about this invoice?
            </h3>
            <p className="text-black/70 mb-4">
              Contact us and we'll be happy to help!
            </p>
            <div className="flex justify-center gap-4">
              <Button
                onClick={() =>
                  (window.location.href = "mailto:hello@designagency.com")
                }
                variant="outline"
                className="border-2 border-black"
              >
                Email Support
              </Button>
              <Button
                onClick={() => navigate("/contact")}
                variant="outline"
                className="border-2 border-black"
              >
                Contact Form
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoicePayment;
