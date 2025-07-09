import React, { useState } from "react";
import {
  PayPalScriptProvider,
  PayPalButtons,
  usePayPalScriptReducer,
} from "@paypal/react-paypal-js";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { simpleInvoicesApi, SimpleInvoice } from "@/lib/invoices-simple-api";
import { paypalScriptOptions } from "@/lib/paypal-config";
import { Loader2, CreditCard, CheckCircle, XCircle } from "lucide-react";

interface PayPalButtonProps {
  invoice: SimpleInvoice;
  onPaymentSuccess?: (invoice: SimpleInvoice) => void;
  onPaymentError?: (error: any) => void;
  disabled?: boolean;
}

// PayPal Button Wrapper Component
const PayPalButtonWrapper: React.FC<PayPalButtonProps> = ({
  invoice,
  onPaymentSuccess,
  onPaymentError,
  disabled = false,
}) => {
  const [{ isPending }] = usePayPalScriptReducer();
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const handleApprove = async (data: any, actions: any) => {
    setIsProcessing(true);

    try {
      // Capture the payment
      const details = await actions.order.capture();

      console.log("PayPal payment captured:", details);

      // Update invoice in database
      const updatedInvoice = await simpleInvoicesApi.markAsPaid(invoice.id, {
        paymentMethod: "paypal",
        paypalOrderId: details.id,
        transactionId: details.purchase_units[0].payments.captures[0].id,
        amount: parseFloat(details.purchase_units[0].amount.value),
      });

      toast({
        title: "Payment Successful! 🎉",
        description: `Invoice ${invoice.invoiceNumber} has been paid successfully.`,
      });

      onPaymentSuccess?.(updatedInvoice);
    } catch (error) {
      console.error("Payment processing error:", error);
      toast({
        title: "Payment Processing Error",
        description:
          "There was an error processing your payment. Please try again.",
        variant: "destructive",
      });
      onPaymentError?.(error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleError = (err: any) => {
    console.error("PayPal error:", err);
    toast({
      title: "Payment Error",
      description: "An error occurred during payment. Please try again.",
      variant: "destructive",
    });
    onPaymentError?.(err);
  };

  const handleCancel = (data: any) => {
    console.log("PayPal payment cancelled:", data);
    toast({
      title: "Payment Cancelled",
      description: "You cancelled the payment. You can try again anytime.",
    });
  };

  if (isPending) {
    return (
      <Button disabled className="w-full border-4 border-black">
        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
        Loading PayPal...
      </Button>
    );
  }

  if (isProcessing) {
    return (
      <Button disabled className="w-full border-4 border-black">
        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
        Processing Payment...
      </Button>
    );
  }

  return (
    <div className="space-y-4">
      <PayPalButtons
        disabled={disabled}
        style={{
          layout: "horizontal",
          color: "gold",
          shape: "rect",
          label: "paypal",
          height: 50,
        }}
        createOrder={(data, actions) => {
          return actions.order.create({
            purchase_units: [
              {
                reference_id: invoice.id,
                description: `Payment for ${invoice.title}`,
                amount: {
                  currency_code: "USD",
                  value: (invoice.totalAmount || 0).toFixed(2),
                },
              },
            ],
            application_context: {
              brand_name: "Design Agency",
              landing_page: "BILLING",
              user_action: "PAY_NOW",
            },
          });
        }}
        onApprove={handleApprove}
        onError={handleError}
        onCancel={handleCancel}
      />

      <div className="text-center text-sm text-black/60">
        <p>Secure payment powered by PayPal</p>
        <p>Amount: ${invoice.totalAmount.toFixed(2)} USD</p>
      </div>
    </div>
  );
};

// Main PayPal Button Component
const PayPalButton: React.FC<PayPalButtonProps> = (props) => {
  // Show different UI based on invoice status
  if (props.invoice.status === "paid") {
    return (
      <div className="text-center p-6 border-4 border-green-500 bg-green-50">
        <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-green-700 mb-2">
          Payment Completed
        </h3>
        <p className="text-green-600">
          This invoice was paid on{" "}
          {props.invoice.paidAt
            ? new Date(props.invoice.paidAt).toLocaleDateString()
            : "Unknown date"}
        </p>
        {props.invoice.paypalOrderId && (
          <p className="text-sm text-green-600 mt-2">
            PayPal Order ID: {props.invoice.paypalOrderId}
          </p>
        )}
      </div>
    );
  }

  if (props.invoice.status === "cancelled") {
    return (
      <div className="text-center p-6 border-4 border-red-500 bg-red-50">
        <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-red-700 mb-2">
          Invoice Cancelled
        </h3>
        <p className="text-red-600">This invoice has been cancelled.</p>
      </div>
    );
  }

  if (props.invoice.status === "draft") {
    return (
      <div className="text-center p-6 border-4 border-gray-400 bg-gray-50">
        <div className="text-6xl mb-4">📝</div>
        <h3 className="text-xl font-bold text-gray-700 mb-2">Draft Invoice</h3>
        <p className="text-gray-600">
          This invoice is still in draft mode and cannot be paid yet.
        </p>
      </div>
    );
  }

  return (
    <PayPalScriptProvider options={paypalScriptOptions}>
      <div className="space-y-4">
        <div className="text-center p-4 border-4 border-black bg-festival-cream">
          <CreditCard className="w-8 h-8 text-black mx-auto mb-2" />
          <h3 className="text-lg font-bold text-black mb-2">Pay with PayPal</h3>
          <p className="text-black/70">
            Complete your payment securely using PayPal
          </p>
        </div>

        <PayPalButtonWrapper {...props} />
      </div>
    </PayPalScriptProvider>
  );
};

export default PayPalButton;
