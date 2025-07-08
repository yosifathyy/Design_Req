import React, { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { gsap } from "gsap";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { getAdminInvoices } from "@/lib/api";
import {
  CreditCard,
  Search,
  Plus,
  Download,
  DollarSign,
  Calendar,
  Eye,
  RefreshCw,
} from "lucide-react";

const AdminInvoices: React.FC = () => {
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);

  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const loadInvoices = async () => {
      try {
        setLoading(true);
        const invoicesData = await getAdminInvoices();
        setInvoices(invoicesData);
      } catch (error) {
        console.error("Failed to load invoices:", error);
      } finally {
        setLoading(false);
      }
    };

    loadInvoices();
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
      default:
        return "bg-gray-400";
    }
  };

  const filteredInvoices = invoices.filter((invoice) =>
    invoice.request?.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    invoice.id?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalRevenue = invoices.reduce((sum, inv) => sum + (inv.amount || 0), 0);
  const paidInvoices = invoices.filter((inv) => inv.status === "paid");
  const pendingInvoices = invoices.filter((inv) => inv.status === "pending");

  return (
    <div ref={containerRef} className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-display font-bold text-black mb-2">
            INVOICE MANAGEMENT
          </h1>
          <p className="text-xl text-black/70 font-medium">
            Create, track, and manage client invoices
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            onClick={() => navigate("/admin/invoices/reports")}
            variant="outline"
            className="border-4 border-black"
          >
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button
            onClick={() => navigate("/admin/invoices/create")}
            className="bg-gradient-to-r from-festival-magenta to-festival-pink border-4 border-black"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Invoice
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-gradient-to-br from-festival-orange to-festival-coral p-6">
          <div className="flex items-center gap-4">
            <DollarSign className="w-8 h-8 text-black" />
            <div>
              <p className="text-2xl font-display font-bold text-black">
                ${totalRevenue.toLocaleString()}
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
                {paidInvoices.length}
              </p>
              <p className="text-sm font-medium text-black/80">Paid Invoices</p>
            </div>
          </div>
        </Card>

        <Card className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-gradient-to-br from-festival-yellow to-festival-amber p-6">
          <div className="flex items-center gap-4">
            <Calendar className="w-8 h-8 text-black" />
            <div>
              <p className="text-2xl font-display font-bold text-black">
                {pendingInvoices.length}
              </p>
              <p className="text-sm font-medium text-black/80">
                Pending Payment
              </p>
            </div>
          </div>
        </Card>
      </div>

      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black/50 w-5 h-5" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search invoices by ID or project..."
            className="pl-12 h-12 border-4 border-black bg-white"
          />
        </div>
        <Button
          onClick={() => window.location.reload()}
          variant="outline"
          className="border-4 border-black"
          disabled={loading}
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-festival-orange" />
            <p className="text-lg font-medium text-black">Loading invoices...</p>
          </div>
        </div>
      ) : filteredInvoices.length === 0 ? (
        <Card className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-white p-12 text-center">
          <div className="text-6xl mb-4">📄</div>
          <h3 className="text-2xl font-bold text-black mb-2">
            {searchQuery ? "No invoices found" : "No invoices yet"}
          </h3>
          <p className="text-black/70 mb-6">
            {searchQuery
              ? "Try adjusting your search terms"
              : "Create your first invoice to get started"
            }
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
          {filteredInvoices.map((invoice) => (
          <Card
            key={invoice.id}
            className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-white p-6"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <h3 className="text-xl font-bold text-black">
                    Invoice #{invoice.id}
                  </h3>
                  <Badge
                    className={`${getStatusColor(invoice.status)} text-white border-2 border-black`}
                  >
                    {invoice.status.toUpperCase()}
                  </Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-black/60">Project</p>
                    <p className="font-medium text-black">
                      {invoice.projectTitle}
                    </p>
                  </div>
                  <div>
                    <p className="text-black/60">Client</p>
                    <p className="font-medium text-black">
                      {invoice.clientName}
                    </p>
                  </div>
                  <div>
                    <p className="text-black/60">Amount</p>
                    <p className="font-bold text-black text-lg">
                      ${invoice.amount}
                    </p>
                  </div>
                  <div>
                    <p className="text-black/60">Created</p>
                    <p className="font-medium text-black">
                      {new Date(invoice.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-black/60">Due Date</p>
                    <p className="font-medium text-black">
                      {new Date(invoice.dueDate).toLocaleDateString()}
                    </p>
                  </div>
                  {invoice.paidAt && (
                    <div>
                      <p className="text-black/60">Paid Date</p>
                      <p className="font-medium text-black">
                        {new Date(invoice.paidAt).toLocaleDateString()}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={() => navigate(`/admin/invoices/${invoice.id}`)}
                  variant="outline"
                  size="sm"
                  className="border-4 border-black"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  View
                </Button>
                <Button
                  onClick={() => {
                    const printWindow = window.open("", "_blank");
                    if (printWindow) {
                      printWindow.document.write(`
                        <html>
                          <head><title>Invoice #${invoice.id}</title></head>
                          <body>
                            <h1>Invoice #${invoice.id}</h1>
                            <p>Project: ${invoice.projectTitle}</p>
                            <p>Client: ${invoice.clientName}</p>
                            <p>Amount: $${invoice.amount}</p>
                            <p>Status: ${invoice.status}</p>
                          </body>
                        </html>
                      `);
                      printWindow.document.close();
                      printWindow.print();
                    }
                  }}
                  variant="outline"
                  size="sm"
                  className="border-4 border-black"
                >
                  <Download className="w-4 h-4 mr-2" />
                  PDF
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AdminInvoices;