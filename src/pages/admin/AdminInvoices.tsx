import React, { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { gsap } from "gsap";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { simpleInvoicesApi, SimpleInvoice } from "@/lib/invoices-simple-api";
import {
  CreditCard,
  Search,
  Plus,
  Download,
  DollarSign,
  Calendar,
  Eye,
  RefreshCw,
  TrendingUp,
  Clock,
  AlertTriangle,
  Loader2,
} from "lucide-react";

const AdminInvoices: React.FC = () => {
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);

  const [invoices, setInvoices] = useState<SimpleInvoice[]>([]);
  const [stats, setStats] = useState({
    totalRevenue: 0,
    paidInvoices: 0,
    pendingInvoices: 0,
    overdueInvoices: 0,
    thisMonthRevenue: 0,
  });
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();

  // Load invoices and stats
  const loadData = async () => {
    try {
      setLoading(true);
      const [invoicesData, statsData] = await Promise.all([
        simpleInvoicesApi.getAll(),
        simpleInvoicesApi.getStats(),
      ]);

      setInvoices(invoicesData);
      setStats(statsData);

      toast({
        title: "Invoices loaded",
        description: `Loaded ${invoicesData.length} invoices`,
      });
    } catch (error) {
      console.error("Failed to load invoices:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
      toast({
        title: "Error loading invoices",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (!containerRef.current || loading) return;
    gsap.fromTo(
      containerRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" },
    );
  }, [loading]);

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
      month: "short",
      day: "numeric",
    });
  };

  const getDaysUntilDue = (dueDateString: string | null) => {
    if (!dueDateString) return null;
    const dueDate = new Date(dueDateString);
    const now = new Date();
    const diffTime = dueDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getInvoiceStatus = (invoice: SimpleInvoice) => {
    if (invoice.status === "paid") return { status: "paid", color: "green" };
    if (invoice.status === "cancelled")
      return { status: "cancelled", color: "red" };
    if (invoice.status === "draft") return { status: "draft", color: "gray" };

    // Check if overdue
    if (invoice.dueDate) {
      const daysUntilDue = getDaysUntilDue(invoice.dueDate);
      if (daysUntilDue !== null && daysUntilDue < 0) {
        return { status: "overdue", color: "red" };
      }
    }

    return { status: "sent", color: "blue" };
  };

  const filteredInvoices = invoices.filter(
    (invoice) =>
      invoice.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      invoice.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      invoice.clientName.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleDownloadInvoice = (invoice: SimpleInvoice) => {
    // Generate PDF (simplified version)
    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Invoice ${invoice.invoice_number}</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 40px; }
              .header { border-bottom: 2px solid #000; padding-bottom: 20px; margin-bottom: 20px; }
              .line-item { display: flex; justify-content: space-between; margin-bottom: 10px; }
              .total { border-top: 2px solid #000; padding-top: 10px; font-weight: bold; }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>Invoice ${invoice.invoice_number}</h1>
              <h2>${invoice.title}</h2>
              <p>Bill To: ${invoice.client.name} (${invoice.client.email})</p>
              <p>Created: ${formatDate(invoice.created_at)}</p>
              ${invoice.due_date ? `<p>Due: ${formatDate(invoice.due_date)}</p>` : ""}
            </div>

            <h3>Invoice Items:</h3>
            ${invoice.line_items
              .map(
                (item) => `
              <div class="line-item">
                <span>${item.description} (${item.quantity}x)</span>
                <span>$${item.total_price.toFixed(2)}</span>
              </div>
            `,
              )
              .join("")}

            <div class="total">
              <div class="line-item">
                <span>Subtotal:</span>
                <span>$${invoice.subtotal.toFixed(2)}</span>
              </div>
              ${
                invoice.tax_amount > 0
                  ? `
                <div class="line-item">
                  <span>Tax (${invoice.tax_rate}%):</span>
                  <span>$${invoice.tax_amount.toFixed(2)}</span>
                </div>
              `
                  : ""
              }
              <div class="line-item">
                <span>Total:</span>
                <span>$${invoice.total_amount.toFixed(2)}</span>
              </div>
            </div>

            ${invoice.notes ? `<p><strong>Notes:</strong> ${invoice.notes}</p>` : ""}
            ${invoice.terms ? `<p><strong>Terms:</strong> ${invoice.terms}</p>` : ""}
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-16 h-16 animate-spin mx-auto mb-4 text-festival-orange" />
          <p className="text-lg font-medium text-black">Loading invoices...</p>
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-display font-bold text-black mb-2">
            INVOICE MANAGEMENT
          </h1>
          <p className="text-xl text-black/70 font-medium">
            Create, track, and manage client invoices with PayPal integration
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            onClick={() => navigate("/admin/invoices/reports")}
            variant="outline"
            className="border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1"
          >
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button
            onClick={() => navigate("/admin/invoices/create")}
            className="bg-gradient-to-r from-festival-magenta to-festival-pink border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Invoice
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <Card className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-gradient-to-br from-festival-orange to-festival-coral p-6">
          <div className="flex items-center gap-4">
            <DollarSign className="w-8 h-8 text-black" />
            <div>
              <p className="text-2xl font-display font-bold text-black">
                ${stats.totalRevenue.toLocaleString()}
              </p>
              <p className="text-sm font-medium text-black/80">Total Revenue</p>
            </div>
          </div>
        </Card>

        <Card className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-gradient-to-br from-green-400 to-green-500 p-6">
          <div className="flex items-center gap-4">
            <CreditCard className="w-8 h-8 text-black" />
            <div>
              <p className="text-2xl font-display font-bold text-black">
                {stats.paidInvoices}
              </p>
              <p className="text-sm font-medium text-black/80">Paid Invoices</p>
            </div>
          </div>
        </Card>

        <Card className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-gradient-to-br from-festival-yellow to-festival-amber p-6">
          <div className="flex items-center gap-4">
            <Clock className="w-8 h-8 text-black" />
            <div>
              <p className="text-2xl font-display font-bold text-black">
                {stats.pendingInvoices}
              </p>
              <p className="text-sm font-medium text-black/80">Pending</p>
            </div>
          </div>
        </Card>

        <Card className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-gradient-to-br from-red-400 to-red-500 p-6">
          <div className="flex items-center gap-4">
            <AlertTriangle className="w-8 h-8 text-black" />
            <div>
              <p className="text-2xl font-display font-bold text-black">
                {stats.overdueInvoices}
              </p>
              <p className="text-sm font-medium text-black/80">Overdue</p>
            </div>
          </div>
        </Card>

        <Card className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-gradient-to-br from-purple-400 to-purple-500 p-6">
          <div className="flex items-center gap-4">
            <TrendingUp className="w-8 h-8 text-black" />
            <div>
              <p className="text-2xl font-display font-bold text-black">
                ${stats.thisMonthRevenue.toLocaleString()}
              </p>
              <p className="text-sm font-medium text-black/80">This Month</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Search and Actions */}
      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black/50 w-5 h-5" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search invoices by number, title, or client..."
            className="pl-12 h-12 border-4 border-black bg-white"
          />
        </div>
        <Button
          onClick={loadData}
          variant="outline"
          className="border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1"
          disabled={loading}
        >
          <RefreshCw
            className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`}
          />
          Refresh
        </Button>
      </div>

      {/* Invoices List */}
      {filteredInvoices.length === 0 ? (
        <Card className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-white p-12 text-center">
          <div className="text-6xl mb-4">📄</div>
          <h3 className="text-2xl font-bold text-black mb-2">
            {searchQuery ? "No invoices found" : "No invoices yet"}
          </h3>
          <p className="text-black/70 mb-6">
            {searchQuery
              ? "Try adjusting your search terms"
              : "Create your first invoice to get started"}
          </p>
          {!searchQuery && (
            <Button
              onClick={() => navigate("/admin/invoices/create")}
              className="bg-gradient-to-r from-festival-magenta to-festival-pink border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
            >
              <Plus className="w-5 h-5 mr-2" />
              Create First Invoice
            </Button>
          )}
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredInvoices.map((invoice) => {
            const invoiceStatus = getInvoiceStatus(invoice);
            const daysUntilDue = invoice.due_date
              ? getDaysUntilDue(invoice.due_date)
              : null;

            return (
              <Card
                key={invoice.id}
                className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-white p-6 hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 transition-all duration-200"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="text-xl font-bold text-black">
                        Invoice #{invoice.invoice_number}
                      </h3>
                      <Badge
                        className={`${getStatusColor(invoiceStatus.status)} text-white border-2 border-black`}
                      >
                        {invoiceStatus.status.toUpperCase()}
                      </Badge>
                      {daysUntilDue !== null &&
                        daysUntilDue <= 7 &&
                        daysUntilDue > 0 && (
                          <Badge className="bg-orange-500 text-white border-2 border-black">
                            Due in {daysUntilDue} days
                          </Badge>
                        )}
                    </div>

                    <div className="mb-3">
                      <h4 className="font-bold text-black">{invoice.title}</h4>
                      {invoice.description && (
                        <p className="text-black/70">{invoice.description}</p>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-black/60">Client</p>
                        <p className="font-medium text-black">
                          {invoice.client.name}
                        </p>
                        <p className="text-black/60">{invoice.client.email}</p>
                      </div>
                      <div>
                        <p className="text-black/60">Amount</p>
                        <p className="font-bold text-black text-lg">
                          ${invoice.total_amount.toFixed(2)}
                        </p>
                      </div>
                      <div>
                        <p className="text-black/60">Created</p>
                        <p className="font-medium text-black">
                          {formatDate(invoice.created_at)}
                        </p>
                      </div>
                      <div>
                        <p className="text-black/60">Due Date</p>
                        <p className="font-medium text-black">
                          {invoice.due_date
                            ? formatDate(invoice.due_date)
                            : "No due date"}
                        </p>
                      </div>
                    </div>

                    {invoice.paid_at && (
                      <div className="mt-3 p-2 bg-green-50 border border-green-200 rounded">
                        <p className="text-sm text-green-700">
                          <strong>Paid:</strong> {formatDate(invoice.paid_at)}
                          {invoice.payment_method && (
                            <span> via {invoice.payment_method}</span>
                          )}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <Button
                      onClick={() => navigate(`/invoices/${invoice.id}`)}
                      variant="outline"
                      size="sm"
                      className="border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      View
                    </Button>
                    <Button
                      onClick={() => handleDownloadInvoice(invoice)}
                      variant="outline"
                      size="sm"
                      className="border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      PDF
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AdminInvoices;
