import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { gsap } from "gsap";
import { useAuth } from "@/hooks/useAuth";
import { simpleInvoicesApi, SimpleInvoice } from "@/lib/invoices-simple-api";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import InvoiceDebugger from "@/components/InvoiceDebugger";
import {
  CreditCard,
  Calendar,
  DollarSign,
  CheckCircle,
  AlertTriangle,
  Clock,
  ArrowLeft,
  Download,
  Eye,
  Sparkles,
  Loader2,
} from "lucide-react";

const Payments: React.FC = () => {
  const [filter, setFilter] = useState<"all" | "paid" | "sent" | "overdue">(
    "all",
  );
  const [invoices, setInvoices] = useState<SimpleInvoice[]>([]);
  const [payingInvoice, setPayingInvoice] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const { user } = useAuth();
  const containerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchInvoices = async () => {
      if (!user) return;

      try {
        setLoading(true);
        console.log("🔍 Fetching invoices for user:", user.id);

        // Get all invoices and filter for current user
        const allInvoices = await simpleInvoicesApi.getAll();
        console.log("✅ All invoices fetched:", allInvoices);

        const userInvoices = allInvoices.filter(
          (invoice) => invoice.clientId === user.id,
        );
        console.log("✅ User invoices filtered:", userInvoices);

        setInvoices(userInvoices);

        if (userInvoices.length === 0) {
          console.log("ℹ️ No invoices found for user");
          // Don't show toast for empty state, it's normal
        } else {
          toast({
            title: "Invoices loaded",
            description: `Found ${userInvoices.length} invoices`,
          });
        }
      } catch (error) {
        console.error("❌ Error fetching invoices:", error);
        const errorMessage =
          error instanceof Error ? error.message : "Unknown error occurred";

        // More specific error handling
        if (errorMessage.includes("Network connection error")) {
          toast({
            title: "Connection Error",
            description: "Please check your internet connection and try again.",
            variant: "destructive",
          });
        } else if (errorMessage.includes("Failed to fetch")) {
          toast({
            title: "Service Unavailable",
            description:
              "The invoice service is temporarily unavailable. Please try again later.",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Error loading invoices",
            description: errorMessage,
            variant: "destructive",
          });
        }

        // Set empty array so UI doesn't break
        setInvoices([]);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchInvoices();
    }
  }, [user, toast]);

  useEffect(() => {
    if (!containerRef.current) return;

    const tl = gsap.timeline();

    tl.fromTo(
      containerRef.current,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" },
    );

    if (cardsRef.current && !loading) {
      const cards = cardsRef.current.children;
      tl.fromTo(
        cards,
        { opacity: 0, y: 20, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.4,
          stagger: 0.1,
          ease: "back.out(1.2)",
        },
        "-=0.3",
      );
    }
  }, [loading]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "paid":
        return {
          color: "bg-green-500",
          textColor: "text-green-700",
          bgColor: "bg-green-50",
          icon: CheckCircle,
          label: "Paid",
        };
      case "sent":
        return {
          color: "bg-blue-500",
          textColor: "text-blue-700",
          bgColor: "bg-blue-50",
          icon: Clock,
          label: "Awaiting Payment",
        };
      case "draft":
        return {
          color: "bg-gray-500",
          textColor: "text-gray-700",
          bgColor: "bg-gray-50",
          icon: Clock,
          label: "Draft",
        };
      case "overdue":
        return {
          color: "bg-red-500",
          textColor: "text-red-700",
          bgColor: "bg-red-50",
          icon: AlertTriangle,
          label: "Overdue",
        };
      default:
        return {
          color: "bg-gray-500",
          textColor: "text-gray-700",
          bgColor: "bg-gray-50",
          icon: Clock,
          label: "Unknown",
        };
    }
  };

  const getInvoiceStatus = (invoice: SimpleInvoice) => {
    if (invoice.status === "paid") return "paid";
    if (invoice.status === "draft") return "draft";
    if (invoice.status === "cancelled") return "cancelled";

    // Check if overdue
    if (invoice.dueDate) {
      const dueDate = new Date(invoice.dueDate);
      const now = new Date();
      if (dueDate < now) {
        return "overdue";
      }
    }

    return "sent";
  };

  const filteredInvoices = invoices.filter((invoice) => {
    if (filter === "all") return true;
    const status = getInvoiceStatus(invoice);
    return status === filter;
  });

  const handleViewInvoice = (invoiceId: string) => {
    navigate(`/invoices/${invoiceId}`);
  };

  const handlePayment = (invoiceId: string) => {
    // Redirect to invoice payment page
    navigate(`/invoices/${invoiceId}`);
  };

  const totalAmount = invoices.reduce(
    (sum, invoice) => sum + invoice.totalAmount,
    0,
  );
  const paidAmount = invoices
    .filter((invoice) => invoice.status === "paid")
    .reduce((sum, invoice) => sum + invoice.totalAmount, 0);
  const pendingAmount = invoices
    .filter((invoice) => getInvoiceStatus(invoice) === "sent")
    .reduce((sum, invoice) => sum + invoice.totalAmount, 0);

  return (
    <div className="min-h-screen bg-festival-cream relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-32 h-32 bg-festival-orange transform rotate-45" />
        <div className="absolute top-40 right-20 w-24 h-24 bg-festival-pink rounded-full" />
        <div className="absolute bottom-32 left-1/4 w-28 h-28 bg-festival-yellow transform rotate-12" />
      </div>

      <div
        ref={containerRef}
        className="relative z-10 max-w-6xl mx-auto px-4 py-8"
      >
        {/* Header */}
        <div className="mb-8">
          <Button
            onClick={() => navigate("/design-dashboard")}
            variant="outline"
            className="mb-4 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>

          <h1 className="text-5xl font-display font-bold text-black mb-2">
            PAYMENTS & INVOICES
          </h1>
          <p className="text-xl text-black/70 font-medium">
            Manage your project payments • {invoices.length} total invoices
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-gradient-to-br from-festival-orange to-festival-coral p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-black rounded border-2 border-black">
                <DollarSign className="w-6 h-6 text-festival-orange" />
              </div>
              <div>
                <p className="text-sm font-medium text-black/80 uppercase tracking-wide">
                  Total Amount
                </p>
                <p className="text-2xl font-display font-bold text-black">
                  ${totalAmount.toFixed(2)}
                </p>
              </div>
            </div>
          </Card>

          <Card className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-gradient-to-br from-green-400 to-green-500 p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-black rounded border-2 border-black">
                <CheckCircle className="w-6 h-6 text-green-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-black/80 uppercase tracking-wide">
                  Paid
                </p>
                <p className="text-2xl font-display font-bold text-black">
                  ${paidAmount.toFixed(2)}
                </p>
              </div>
            </div>
          </Card>

          <Card className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-gradient-to-br from-festival-yellow to-festival-amber p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-black rounded border-2 border-black">
                <Clock className="w-6 h-6 text-festival-yellow" />
              </div>
              <div>
                <p className="text-sm font-medium text-black/80 uppercase tracking-wide">
                  Pending
                </p>
                <p className="text-2xl font-display font-bold text-black">
                  ${pendingAmount.toFixed(2)}
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {(["all", "sent", "paid", "overdue"] as const).map((status) => (
            <Button
              key={status}
              onClick={() => setFilter(status)}
              variant={filter === status ? "default" : "outline"}
              className={`border-4 border-black font-bold uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 ${
                filter === status
                  ? "bg-festival-magenta text-white"
                  : "bg-white text-black"
              }`}
            >
              {status === "all"
                ? "All Invoices"
                : status === "sent"
                  ? "Awaiting Payment"
                  : status}
            </Button>
          ))}
        </div>

        {/* Invoices List */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="text-center">
              <Loader2 className="w-12 h-12 text-festival-orange animate-spin mx-auto mb-4" />
              <p className="text-lg font-medium text-black">
                Loading your invoices...
              </p>
            </div>
          </div>
        ) : (
          <div ref={cardsRef} className="space-y-4">
            {filteredInvoices.map((invoice) => {
              const invoiceStatus = getInvoiceStatus(invoice);
              const statusConfig = getStatusConfig(invoiceStatus);
              const StatusIcon = statusConfig.icon;

              return (
                <Card
                  key={invoice.id}
                  className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-white p-6 hover:transform hover:translate-x-1 hover:translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all duration-200"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-6">
                      <div
                        className={`p-4 rounded border-4 border-black ${statusConfig.bgColor}`}
                      >
                        <StatusIcon
                          className={`w-6 h-6 ${statusConfig.textColor}`}
                        />
                      </div>

                      <div>
                        <h3 className="text-xl font-bold text-black mb-1">
                          Invoice #{invoice.invoiceNumber}
                        </h3>
                        <p className="text-black/70 font-medium mb-2">
                          {invoice.title}
                        </p>
                        <div className="flex items-center gap-4 text-sm text-black/60">
                          {invoice.dueDate && (
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              <span>Due: {formatDate(invoice.dueDate)}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-1">
                            <DollarSign className="w-4 h-4" />
                            <span>${invoice.totalAmount.toFixed(2)}</span>
                          </div>
                          <div className="text-xs">
                            Created: {formatDate(invoice.createdAt)}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <Badge
                        className={`${statusConfig.color} text-white border-2 border-black font-bold px-3 py-1`}
                      >
                        {statusConfig.label}
                      </Badge>

                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleViewInvoice(invoice.id)}
                          variant="outline"
                          size="sm"
                          className="border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1"
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          View Invoice
                        </Button>

                        {invoice.status === "paid" && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1"
                          >
                            <Download className="w-4 h-4 mr-2" />
                            Receipt
                          </Button>
                        )}

                        {invoiceStatus === "sent" && (
                          <Button
                            onClick={() => handlePayment(invoice.id)}
                            disabled={payingInvoice === invoice.id}
                            className="bg-gradient-to-r from-festival-magenta to-festival-pink hover:from-festival-pink hover:to-festival-magenta border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 transition-all duration-200"
                          >
                            {payingInvoice === invoice.id ? (
                              <div className="flex items-center gap-2">
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                Processing...
                              </div>
                            ) : (
                              <>
                                <CreditCard className="w-4 h-4 mr-2" />
                                PAY WITH PAYPAL
                              </>
                            )}
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Line Items Preview */}
                  {invoice.lineItems.length > 0 && (
                    <div className="mt-4 pt-4 border-t-2 border-black/10">
                      <p className="text-sm font-medium text-black/70 mb-2">
                        Invoice Items:
                      </p>
                      <div className="space-y-1">
                        {invoice.lineItems.slice(0, 2).map((item, index) => (
                          <div
                            key={index}
                            className="flex justify-between text-sm"
                          >
                            <span className="text-black/60">
                              {item.description} ({item.quantity}x)
                            </span>
                            <span className="font-medium">
                              ${(item.quantity * item.unitPrice).toFixed(2)}
                            </span>
                          </div>
                        ))}
                        {invoice.lineItems.length > 2 && (
                          <div className="text-xs text-black/50 italic">
                            +{invoice.lineItems.length - 2} more items
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
        )}

        {!loading && filteredInvoices.length === 0 && (
          <div className="space-y-6">
            <Card className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-white p-12 text-center">
              <div className="text-6xl mb-4">💳</div>
              <h3 className="text-2xl font-bold text-black mb-2">
                No invoices found
              </h3>
              <p className="text-black/70 mb-4">
                {filter === "all"
                  ? "You don't have any invoices yet. They will appear here when sent to you."
                  : `No ${filter === "sent" ? "pending" : filter} invoices at the moment.`}
              </p>
              {invoices.length === 0 && (
                <div className="mt-6">
                  <Button
                    onClick={() => navigate("/design-dashboard")}
                    className="bg-festival-orange hover:bg-festival-amber border-4 border-black"
                  >
                    Go to Dashboard
                  </Button>
                </div>
              )}
            </Card>

            {/* Debug section - only show when no invoices */}
            <InvoiceDebugger />
          </div>
        )}
      </div>
    </div>
  );
};

export default Payments;
