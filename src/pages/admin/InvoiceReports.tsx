import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { gsap } from "gsap";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { mockAdminInvoices, mockAdminUsers } from "@/lib/admin-data";
import {
  ArrowLeft,
  Download,
  Calendar,
  TrendingUp,
  DollarSign,
  PieChart,
  BarChart3,
  Users,
  CreditCard,
  Clock,
} from "lucide-react";

const InvoiceReports: React.FC = () => {
  const [dateRange, setDateRange] = useState({
    start: "2024-01-01",
    end: "2024-01-31",
  });

  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    gsap.fromTo(
      containerRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" },
    );
  }, []);

  // Calculate metrics
  const totalRevenue = mockAdminInvoices.reduce(
    (sum, inv) => sum + inv.amount,
    0,
  );
  const paidInvoices = mockAdminInvoices.filter((inv) => inv.status === "paid");
  const pendingInvoices = mockAdminInvoices.filter(
    (inv) => inv.status === "sent",
  );
  const overdueInvoices = mockAdminInvoices.filter(
    (inv) => inv.status === "overdue",
  );

  const paidRevenue = paidInvoices.reduce((sum, inv) => sum + inv.amount, 0);
  const pendingRevenue = pendingInvoices.reduce(
    (sum, inv) => sum + inv.amount,
    0,
  );
  const averageInvoiceValue = totalRevenue / mockAdminInvoices.length;
  const collectionRate = (paidInvoices.length / mockAdminInvoices.length) * 100;

  // Revenue by client
  const revenueByClient = mockAdminInvoices.reduce(
    (acc, invoice) => {
      if (!acc[invoice.clientName]) {
        acc[invoice.clientName] = 0;
      }
      if (invoice.status === "paid") {
        acc[invoice.clientName] += invoice.amount;
      }
      return acc;
    },
    {} as Record<string, number>,
  );

  const topClients = Object.entries(revenueByClient)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  const handleExportCSV = () => {
    const csvContent = mockAdminInvoices
      .map(
        (inv) =>
          `${inv.id},${inv.projectTitle},${inv.clientName},${inv.amount},${inv.status},${inv.createdAt}`,
      )
      .join("\n");
    const blob = new Blob(
      [`ID,Project,Client,Amount,Status,Date\n${csvContent}`],
      { type: "text/csv" },
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "invoice-report.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportPDF = () => {
    // Create a simple PDF report
    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head><title>Invoice Report</title></head>
          <body>
            <h1>Invoice Report</h1>
            <p>Total Revenue: $${totalRevenue.toLocaleString()}</p>
            <p>Paid Revenue: $${paidRevenue.toLocaleString()}</p>
            <p>Generated: ${new Date().toLocaleDateString()}</p>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  return (
    <div ref={containerRef} className="space-y-6">
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
              PAYMENT REPORTS
            </h1>
            <p className="text-xl text-black/70 font-medium">
              Financial analytics and revenue insights
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          <Button
            onClick={handleExportCSV}
            variant="outline"
            className="border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1"
          >
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
          <Button
            onClick={handleExportPDF}
            className="bg-gradient-to-r from-festival-magenta to-festival-pink border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1"
          >
            <Download className="w-4 h-4 mr-2" />
            Export PDF
          </Button>
        </div>
      </div>

      {/* Date Range Filter */}
      <Card className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-white p-6">
        <div className="flex items-center gap-4">
          <Calendar className="w-5 h-5 text-black" />
          <span className="font-bold text-black">Date Range:</span>
          <Input
            type="date"
            value={dateRange.start}
            onChange={(e) =>
              setDateRange({ ...dateRange, start: e.target.value })
            }
            className="border-4 border-black bg-festival-cream w-auto"
          />
          <span className="text-black">to</span>
          <Input
            type="date"
            value={dateRange.end}
            onChange={(e) =>
              setDateRange({ ...dateRange, end: e.target.value })
            }
            className="border-4 border-black bg-festival-cream w-auto"
          />
          <Button
            variant="outline"
            className="border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1"
          >
            Apply Filter
          </Button>
        </div>
      </Card>

      {/* Revenue Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
                ${paidRevenue.toLocaleString()}
              </p>
              <p className="text-sm font-medium text-black/80">Paid Revenue</p>
            </div>
          </div>
        </Card>

        <Card className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-gradient-to-br from-festival-yellow to-festival-amber p-6">
          <div className="flex items-center gap-4">
            <Clock className="w-8 h-8 text-black" />
            <div>
              <p className="text-2xl font-display font-bold text-black">
                ${pendingRevenue.toLocaleString()}
              </p>
              <p className="text-sm font-medium text-black/80">
                Pending Revenue
              </p>
            </div>
          </div>
        </Card>

        <Card className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-gradient-to-br from-festival-pink to-festival-magenta p-6">
          <div className="flex items-center gap-4">
            <TrendingUp className="w-8 h-8 text-white" />
            <div>
              <p className="text-2xl font-display font-bold text-white">
                ${averageInvoiceValue.toFixed(0)}
              </p>
              <p className="text-sm font-medium text-white/80">Avg Invoice</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Payment Status Breakdown */}
        <Card className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-white">
          <div className="p-6 border-b-4 border-black bg-gradient-to-r from-festival-orange to-festival-coral">
            <div className="flex items-center gap-3">
              <PieChart className="w-6 h-6 text-black" />
              <h3 className="text-xl font-bold text-black">Payment Status</h3>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-green-50 border-2 border-black">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-green-500 border-2 border-black" />
                  <span className="font-medium text-black">Paid</span>
                </div>
                <div className="text-right">
                  <p className="font-bold text-black">{paidInvoices.length}</p>
                  <p className="text-sm text-black/70">
                    ${paidRevenue.toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-yellow-50 border-2 border-black">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-yellow-500 border-2 border-black" />
                  <span className="font-medium text-black">Pending</span>
                </div>
                <div className="text-right">
                  <p className="font-bold text-black">
                    {pendingInvoices.length}
                  </p>
                  <p className="text-sm text-black/70">
                    ${pendingRevenue.toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-red-50 border-2 border-black">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-red-500 border-2 border-black" />
                  <span className="font-medium text-black">Overdue</span>
                </div>
                <div className="text-right">
                  <p className="font-bold text-black">
                    {overdueInvoices.length}
                  </p>
                  <p className="text-sm text-black/70">
                    $
                    {overdueInvoices
                      .reduce((sum, inv) => sum + inv.amount, 0)
                      .toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t-2 border-black">
                <div className="flex justify-between">
                  <span className="font-bold text-black">Collection Rate:</span>
                  <span className="font-bold text-black">
                    {collectionRate.toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Top Clients by Revenue */}
        <Card className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-white">
          <div className="p-6 border-b-4 border-black bg-gradient-to-r from-festival-pink to-festival-magenta">
            <div className="flex items-center gap-3">
              <Users className="w-6 h-6 text-white" />
              <h3 className="text-xl font-bold text-white">
                Top Clients by Revenue
              </h3>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {topClients.map(([clientName, revenue], index) => (
                <div
                  key={clientName}
                  className="flex items-center justify-between p-3 bg-festival-cream border-2 border-black"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-festival-orange border-2 border-black rounded-full flex items-center justify-center">
                      <span className="text-sm font-bold text-black">
                        {index + 1}
                      </span>
                    </div>
                    <span className="font-medium text-black">{clientName}</span>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-black">
                      ${revenue.toLocaleString()}
                    </p>
                    <p className="text-xs text-black/70">
                      {
                        mockAdminInvoices.filter(
                          (inv) =>
                            inv.clientName === clientName &&
                            inv.status === "paid",
                        ).length
                      }{" "}
                      invoices
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Monthly Trends */}
        <Card className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-white lg:col-span-2">
          <div className="p-6 border-b-4 border-black bg-gradient-to-r from-festival-yellow to-festival-amber">
            <div className="flex items-center gap-3">
              <BarChart3 className="w-6 h-6 text-black" />
              <h3 className="text-xl font-bold text-black">Revenue Trends</h3>
            </div>
          </div>
          <div className="p-6">
            <div className="text-center py-12">
              <BarChart3 className="w-16 h-16 text-black/30 mx-auto mb-4" />
              <p className="text-black/50 mb-4">
                Monthly revenue chart would be displayed here
              </p>
              <Button
                variant="outline"
                className="border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
              >
                Generate Chart
              </Button>
            </div>
          </div>
        </Card>
      </div>

      {/* Aging Report */}
      <Card className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-white">
        <div className="p-6 border-b-4 border-black bg-gradient-to-r from-blue-400 to-blue-500">
          <div className="flex items-center gap-3">
            <Clock className="w-6 h-6 text-white" />
            <h3 className="text-xl font-bold text-white">Aging Report</h3>
          </div>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-green-50 border-2 border-black">
              <p className="text-2xl font-bold text-green-600">
                {
                  mockAdminInvoices.filter(
                    (inv) =>
                      inv.status === "sent" &&
                      new Date(inv.dueDate) > new Date(),
                  ).length
                }
              </p>
              <p className="text-sm text-black/70">Current (0-30 days)</p>
            </div>
            <div className="text-center p-4 bg-yellow-50 border-2 border-black">
              <p className="text-2xl font-bold text-yellow-600">0</p>
              <p className="text-sm text-black/70">31-60 days</p>
            </div>
            <div className="text-center p-4 bg-orange-50 border-2 border-black">
              <p className="text-2xl font-bold text-orange-600">0</p>
              <p className="text-sm text-black/70">61-90 days</p>
            </div>
            <div className="text-center p-4 bg-red-50 border-2 border-black">
              <p className="text-2xl font-bold text-red-600">
                {overdueInvoices.length}
              </p>
              <p className="text-sm text-black/70">90+ days</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default InvoiceReports;
