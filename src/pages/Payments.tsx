import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { gsap } from "gsap";
import { useAuth } from "@/hooks/useAuth";
import { getInvoices, updateInvoice, updateUserXP } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { mockInvoices, mockRequests } from "@/lib/dashboard-data";
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
} from "lucide-react";

const Payments: React.FC = () => {
  const [filter, setFilter] = useState<"all" | "paid" | "pending" | "overdue">(
    "all",
  );
  const [invoices, setInvoices] = useState<any[]>([]);
  const [payingInvoice, setPayingInvoice] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const { user } = useAuth();
  const containerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchInvoices = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        const data = await getInvoices(user.id, filter !== 'all' ? filter : undefined);
        setInvoices(data);
      } catch (error) {
        console.error('Error fetching invoices:', error);
      } finally {
        setLoading(false);
      }
    };
    
    if (user) {
      fetchInvoices();
    }
  }, [user, filter]);

  useEffect(() => {
    if (!containerRef.current) return;

    const tl = gsap.timeline();

    tl.fromTo(
      containerRef.current,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" },
    );

    if (cardsRef.current) {
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
  }, []);

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
      case "pending":
        return {
          color: "bg-yellow-500",
          textColor: "text-yellow-700",
          bgColor: "bg-yellow-50",
          icon: Clock,
          label: "Pending",
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

  const filteredInvoices = invoices.filter((invoice) => {
    if (filter === "all") return true;
    return invoice.status === filter;
  });

  const handlePayment = async (invoiceId: string) => {
    setPayingInvoice(invoiceId);

    try {
      // Update invoice status to paid
      await updateInvoice(invoiceId, {
        status: 'paid',
        paid_at: new Date().toISOString()
      });
      
      // Award XP to the user
      if (user) {
        await updateUserXP(user.id, 25);
      }
      
      // Update local state
      setInvoices(prev => 
        prev.map(invoice => 
          invoice.id === invoiceId 
            ? { ...invoice, status: 'paid', paid_at: new Date().toISOString() } 
            : invoice
        )
      );
    } catch (error) {
      console.error('Error processing payment:', error);
    }

    // Show success animation
    const successEl = document.createElement("div");
    successEl.className =
      "fixed inset-0 flex items-center justify-center z-50 bg-black/50";
    successEl.innerHTML = `
      <div class="bg-white border-4 border-black p-8 text-center shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] max-w-md">
        <div class="text-6xl mb-4">🎉</div>
        <h3 class="text-2xl font-display font-bold text-black mb-2">Payment Successful!</h3>
        <p class="text-black/70 mb-4">Thank you for your payment</p>
        <div class="w-16 h-16 bg-festival-orange rounded-full mx-auto flex items-center justify-center border-4 border-black mb-4">
          <span class="text-xl font-bold text-black">+25</span>
        </div>
        <p class="text-sm text-black/60">You earned 25 XP!</p>
      </div>
    `;

    document.body.appendChild(successEl);

    // Confetti animation
    const confettiColors = [
      "#fa9746",
      "#FF0080",
      "#00FFFF",
      "#FFBF00",
      "#f3ebd3",
    ];
    for (let i = 0; i < 50; i++) {
      const confetti = document.createElement("div");
      confetti.className = "fixed w-4 h-4 pointer-events-none z-50";
      confetti.style.backgroundColor =
        confettiColors[Math.floor(Math.random() * confettiColors.length)];
      confetti.style.left = Math.random() * 100 + "%";
      confetti.style.top = "-20px";
      document.body.appendChild(confetti);

      gsap.to(confetti, {
        y: window.innerHeight + 20,
        rotation: Math.random() * 360,
        duration: Math.random() * 3 + 2,
        ease: "power1.in",
        onComplete: () => confetti.remove(),
      });
    }

    gsap.fromTo(
      successEl.children[0],
      { scale: 0, rotation: -180 },
      {
        scale: 1,
        rotation: 0,
        duration: 0.6,
        ease: "back.out(1.4)",
        onComplete: () => {
          setTimeout(() => {
            gsap.to(successEl, {
              opacity: 0,
              duration: 0.3,
              onComplete: () => document.body.removeChild(successEl),
            });
          }, 3000);
        },
      },
    );

    setPayingInvoice(null);
  };

  const getRequestTitle = (requestId: string) => {
    const invoice = invoices.find(inv => inv.id === requestId);
    return invoice?.request?.title || "Unknown Project";
  };

  const totalAmount = invoices.reduce(
    (sum, invoice) => sum + invoice.amount,
    0,
  );
  const paidAmount = invoices
    .filter((invoice) => invoice.status === "paid")
    .reduce((sum, invoice) => sum + invoice.amount, 0);
  const pendingAmount = invoices
    .filter((invoice) => invoice.status === "pending")
    .reduce((sum, invoice) => sum + invoice.amount, 0);

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
            Manage your project payments
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
                  ${totalAmount}
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
                  ${paidAmount}
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
                  ${pendingAmount}
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6">
          {(["all", "paid", "pending", "overdue"] as const).map((status) => (
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
              {status === "all" ? "All Invoices" : status}
            </Button>
          ))}
        </div>

        {/* Invoices List */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-12 h-12 border-4 border-festival-orange border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div ref={cardsRef} className="space-y-4">
            {filteredInvoices.map((invoice) => {
            const statusConfig = getStatusConfig(invoice.status);
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
                        Invoice #{invoice.id}
                      </h3>
                      <p className="text-black/70 font-medium mb-2">
                        {getRequestTitle(invoice.requestId)}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-black/60">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>Due: {formatDate(invoice.dueDate)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <DollarSign className="w-4 h-4" />
                          <span>${invoice.amount}</span>
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
                        variant="outline"
                        size="sm"
                        className="border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        View
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

                      {invoice.status !== "paid" && (
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
              </Card>
            );
            })}
          </div>
        )}

        {!loading && filteredInvoices.length === 0 && (
          <Card className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-white p-12 text-center">
            <div className="text-6xl mb-4">💳</div>
            <h3 className="text-2xl font-bold text-black mb-2">
              No invoices found
            </h3>
            <p className="text-black/70">
              {filter === "all"
                ? "You don't have any invoices yet."
                : `No ${filter} invoices at the moment.`}
            </p>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Payments;
