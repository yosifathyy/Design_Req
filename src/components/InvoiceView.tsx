import React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SimpleInvoice } from "@/lib/invoices-simple-api";
import PayPalButton from "./PayPalButton";
import {
  Calendar,
  User,
  Mail,
  FileText,
  DollarSign,
  Download,
  Printer,
} from "lucide-react";

interface InvoiceViewProps {
  invoice: SimpleInvoice;
  showPayment?: boolean;
  onPaymentSuccess?: (invoice: SimpleInvoice) => void;
  onDownload?: () => void;
  onPrint?: () => void;
}

const InvoiceView: React.FC<InvoiceViewProps> = ({
  invoice,
  showPayment = false,
  onPaymentSuccess,
  onDownload,
  onPrint,
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-green-500";
      case "sent":
        return "bg-blue-500";
      case "draft":
        return "bg-gray-500";
      case "overdue":
        return "bg-red-500";
      case "cancelled":
        return "bg-red-600";
      default:
        return "bg-gray-400";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      {/* Invoice Header */}
      <Card className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-white">
        <div className="p-6 border-b-4 border-black bg-gradient-to-r from-festival-orange to-festival-coral">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-display font-bold text-black">
                INVOICE #{invoice.invoiceNumber}
              </h1>
              <p className="text-black/80 font-medium">{invoice.title}</p>
            </div>
            <div className="text-right">
              <Badge
                className={`${getStatusColor(invoice.status)} text-white border-2 border-black text-lg px-4 py-2`}
              >
                {invoice.status.toUpperCase()}
              </Badge>
              <p className="text-black/80 mt-2">
                Total: ${invoice.totalAmount.toFixed(2)}
              </p>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Bill To */}
            <div>
              <h3 className="text-lg font-bold text-black mb-3 flex items-center gap-2">
                <User className="w-5 h-5" />
                Bill To
              </h3>
              <div className="space-y-2">
                <p className="font-bold text-black">{invoice.clientName}</p>
                <div className="flex items-center gap-2 text-black/70">
                  <Mail className="w-4 h-4" />
                  <span>{invoice.clientEmail}</span>
                </div>
              </div>
            </div>

            {/* Invoice Details */}
            <div>
              <h3 className="text-lg font-bold text-black mb-3 flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Invoice Details
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-black/60">Created:</span>
                  <span className="font-medium">
                    {formatDate(invoice.createdAt)}
                  </span>
                </div>
                {invoice.dueDate && (
                  <div className="flex justify-between">
                    <span className="text-black/60">Due Date:</span>
                    <span className="font-medium">
                      {formatDate(invoice.dueDate)}
                    </span>
                  </div>
                )}
                {invoice.sentAt && (
                  <div className="flex justify-between">
                    <span className="text-black/60">Sent:</span>
                    <span className="font-medium">
                      {formatDate(invoice.sentAt)}
                    </span>
                  </div>
                )}
                {invoice.paidAt && (
                  <div className="flex justify-between">
                    <span className="text-black/60">Paid:</span>
                    <span className="font-medium text-green-600">
                      {formatDate(invoice.paidAt)}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div>
              <h3 className="text-lg font-bold text-black mb-3">Actions</h3>
              <div className="space-y-2">
                <Button
                  onClick={onDownload}
                  variant="outline"
                  size="sm"
                  className="w-full border-2 border-black"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download PDF
                </Button>
                <Button
                  onClick={onPrint}
                  variant="outline"
                  size="sm"
                  className="w-full border-2 border-black"
                >
                  <Printer className="w-4 h-4 mr-2" />
                  Print Invoice
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Project Details */}
      {invoice.design_request && (
        <Card className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-white">
          <div className="p-6 border-b-4 border-black bg-gradient-to-r from-festival-pink to-festival-magenta">
            <h3 className="text-xl font-bold text-white">Project Details</h3>
          </div>
          <div className="p-6">
            <h4 className="text-lg font-bold text-black mb-2">
              {invoice.design_request.title}
            </h4>
            <p className="text-black/70">
              {invoice.design_request.description}
            </p>
          </div>
        </Card>
      )}

      {/* Line Items */}
      <Card className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-white">
        <div className="p-6 border-b-4 border-black bg-gradient-to-r from-festival-yellow to-festival-amber">
          <h3 className="text-xl font-bold text-black">Invoice Items</h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {/* Header */}
            <div className="grid grid-cols-5 gap-4 font-bold text-black border-b-2 border-black pb-2">
              <div className="col-span-2">Description</div>
              <div className="text-center">Quantity</div>
              <div className="text-right">Unit Price</div>
              <div className="text-right">Total</div>
            </div>

            {/* Line Items */}
            {invoice.lineItems.map((item, index) => (
              <div
                key={index}
                className="grid grid-cols-5 gap-4 py-3 border-b border-black/20"
              >
                <div className="col-span-2">
                  <p className="font-medium text-black">{item.description}</p>
                  <Badge
                    variant="outline"
                    className="mt-1 text-xs border border-black/30"
                  >
                    {item.itemType}
                  </Badge>
                </div>
                <div className="text-center text-black">{item.quantity}</div>
                <div className="text-right text-black">
                  ${item.unitPrice.toFixed(2)}
                </div>
                <div className="text-right font-bold text-black">
                  ${(item.quantity * item.unitPrice).toFixed(2)}
                </div>
              </div>
            ))}
          </div>

          <Separator className="my-6 border-2 border-black" />

          {/* Totals */}
          <div className="space-y-3">
            <div className="flex justify-between text-lg">
              <span className="text-black/70">Subtotal:</span>
              <span className="font-bold text-black">
                ${invoice.amount.toFixed(2)}
              </span>
            </div>

            {invoice.taxRate > 0 && (
              <div className="flex justify-between text-lg">
                <span className="text-black/70">Tax ({invoice.taxRate}%):</span>
                <span className="font-bold text-black">
                  ${invoice.taxAmount.toFixed(2)}
                </span>
              </div>
            )}

            <Separator className="border-2 border-black" />

            <div className="flex justify-between text-2xl">
              <span className="font-display font-bold text-black">Total:</span>
              <span className="font-display font-bold text-black">
                ${invoice.totalAmount.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </Card>

      {/* Payment Section */}
      {showPayment && invoice.status !== "paid" && (
        <Card className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-white">
          <div className="p-6 border-b-4 border-black bg-gradient-to-r from-green-400 to-green-500">
            <div className="flex items-center gap-3">
              <DollarSign className="w-6 h-6 text-black" />
              <h3 className="text-xl font-bold text-black">Make Payment</h3>
            </div>
          </div>
          <div className="p-6">
            <PayPalButton
              invoice={invoice}
              onPaymentSuccess={onPaymentSuccess}
            />
          </div>
        </Card>
      )}

      {/* Notes and Terms */}
      {(invoice.notes || invoice.terms) && (
        <Card className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-white">
          <div className="p-6 border-b-4 border-black bg-gradient-to-r from-blue-400 to-blue-500">
            <h3 className="text-xl font-bold text-white">
              Additional Information
            </h3>
          </div>
          <div className="p-6 space-y-4">
            {invoice.notes && (
              <div>
                <h4 className="font-bold text-black mb-2">Notes:</h4>
                <p className="text-black/70">{invoice.notes}</p>
              </div>
            )}
            {invoice.terms && (
              <div>
                <h4 className="font-bold text-black mb-2">Payment Terms:</h4>
                <p className="text-black/70">{invoice.terms}</p>
              </div>
            )}
          </div>
        </Card>
      )}

      {/* Payment History */}
      {invoice.payments && invoice.payments.length > 0 && (
        <Card className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-white">
          <div className="p-6 border-b-4 border-black bg-gradient-to-r from-purple-400 to-purple-500">
            <h3 className="text-xl font-bold text-white">Payment History</h3>
          </div>
          <div className="p-6">
            <div className="space-y-3">
              {invoice.payments.map((payment) => (
                <div
                  key={payment.id}
                  className="flex items-center justify-between p-3 bg-festival-cream border border-black/20"
                >
                  <div>
                    <p className="font-medium text-black">
                      ${payment.amount.toFixed(2)} via {payment.payment_method}
                    </p>
                    <p className="text-sm text-black/60">
                      {formatDate(payment.processed_at)}
                    </p>
                  </div>
                  <Badge
                    className={`${
                      payment.status === "completed"
                        ? "bg-green-500"
                        : payment.status === "failed"
                          ? "bg-red-500"
                          : "bg-yellow-500"
                    } text-white border border-black`}
                  >
                    {payment.status}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default InvoiceView;
