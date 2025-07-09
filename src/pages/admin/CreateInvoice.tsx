import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { gsap } from "gsap";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { simpleInvoicesApi } from "@/lib/invoices-simple-api";
import { kanbanApi } from "@/lib/kanban-api";
import { supabase } from "@/lib/supabase";
import {
  ArrowLeft,
  Plus,
  Trash2,
  Save,
  Send,
  Calculator,
  FileText,
  Loader2,
} from "lucide-react";

interface LineItem {
  description: string;
  quantity: number;
  unitPrice: number;
  itemType: "service" | "product" | "design" | "consultation";
}

interface ProjectOption {
  id: string;
  title: string;
  clientName: string;
  clientId: string;
  clientEmail: string;
}

const CreateInvoice: React.FC = () => {
  const [projects, setProjects] = useState<ProjectOption[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [selectedProject, setSelectedProject] = useState("");
  const [selectedClient, setSelectedClient] = useState("");
  const [lineItems, setLineItems] = useState<LineItem[]>([
    { description: "", quantity: 1, unitPrice: 0, itemType: "design" },
  ]);
  const [invoiceData, setInvoiceData] = useState({
    title: "",
    description: "",
    dueDate: "",
    notes: "",
    terms: "Payment is due within 30 days of invoice date.",
    taxRate: 8.25,
  });

  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Load projects and users
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);

        // Load design requests (projects) with client info
        const { data: designRequests, error: projectsError } = await supabase
          .from("design_requests")
          .select(
            `
            id, title, description,
            client:user_id(id, name, email)
          `,
          )
          .order("created_at", { ascending: false });

        if (projectsError) throw projectsError;

        const projectOptions: ProjectOption[] = designRequests.map(
          (request) => ({
            id: request.id,
            title: request.title,
            clientName: (request.client as any)?.name || "Unknown Client",
            clientId: (request.client as any)?.id || "",
            clientEmail: (request.client as any)?.email || "",
          }),
        );

        setProjects(projectOptions);

        // Load all users for client selection
        const { data: allUsers, error: usersError } = await supabase
          .from("users")
          .select("id, name, email, role")
          .in("role", ["user", "admin"])
          .order("name");

        if (usersError) throw usersError;
        setUsers(allUsers);
      } catch (error) {
        console.error("Error loading data:", error);
        toast({
          title: "Error loading data",
          description: "Failed to load projects and users",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [toast]);

  useEffect(() => {
    if (!containerRef.current || loading) return;
    gsap.fromTo(
      containerRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" },
    );
  }, [loading]);

  const addLineItem = () => {
    setLineItems([
      ...lineItems,
      { description: "", quantity: 1, unitPrice: 0, itemType: "design" },
    ]);
  };

  const removeLineItem = (index: number) => {
    setLineItems(lineItems.filter((_, i) => i !== index));
  };

  const updateLineItem = (index: number, field: keyof LineItem, value: any) => {
    const updated = lineItems.map((item, i) =>
      i === index ? { ...item, [field]: value } : item,
    );
    setLineItems(updated);
  };

  const calculateSubtotal = () => {
    return lineItems.reduce(
      (sum, item) => sum + item.quantity * item.unitPrice,
      0,
    );
  };

  const calculateTax = () => {
    return (calculateSubtotal() * invoiceData.taxRate) / 100;
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax();
  };

  const selectedProjectData = projects.find((p) => p.id === selectedProject);
  const selectedClientData = users.find((u) => u.id === selectedClient);

  // Auto-select client when project is selected
  useEffect(() => {
    if (selectedProjectData) {
      setSelectedClient(selectedProjectData.clientId);
      setInvoiceData((prev) => ({
        ...prev,
        title: `Invoice for ${selectedProjectData.title}`,
        description: `Design services for ${selectedProjectData.title}`,
      }));
    }
  }, [selectedProject, selectedProjectData]);

  const validateInvoice = (): string | null => {
    if (!invoiceData.title.trim()) return "Invoice title is required";
    if (!selectedClient) return "Please select a client";
    if (lineItems.length === 0) return "Please add at least one line item";
    if (
      lineItems.some((item) => !item.description.trim() || item.unitPrice <= 0)
    ) {
      return "Please fill in all line items with valid prices";
    }
    return null;
  };

  const handleSaveDraft = async () => {
    const validation = validateInvoice();
    if (validation) {
      toast({
        title: "Validation Error",
        description: validation,
        variant: "destructive",
      });
      return;
    }

    try {
      setSaving(true);

      const createData: CreateInvoiceData = {
        title: invoiceData.title,
        description: invoiceData.description,
        designRequestId: selectedProject || undefined,
        clientId: selectedClient,
        dueDate: invoiceData.dueDate || undefined,
        taxRate: invoiceData.taxRate,
        notes: invoiceData.notes,
        terms: invoiceData.terms,
        lineItems: lineItems.map((item) => ({
          description: item.description,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          itemType: item.itemType,
        })),
      };

      const invoice = await invoicesApi.create(createData);

      toast({
        title: "Draft Saved! 📄",
        description: `Invoice ${invoice.invoice_number} has been saved as draft.`,
      });

      navigate(`/admin/invoices/${invoice.id}`);
    } catch (error) {
      console.error("Error saving draft:", error);
      toast({
        title: "Error saving draft",
        description: "Failed to save invoice. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleSendInvoice = async () => {
    const validation = validateInvoice();
    if (validation) {
      toast({
        title: "Validation Error",
        description: validation,
        variant: "destructive",
      });
      return;
    }

    try {
      setSaving(true);

      const createData: CreateInvoiceData = {
        title: invoiceData.title,
        description: invoiceData.description,
        designRequestId: selectedProject || undefined,
        clientId: selectedClient,
        dueDate: invoiceData.dueDate || undefined,
        taxRate: invoiceData.taxRate,
        notes: invoiceData.notes,
        terms: invoiceData.terms,
        lineItems: lineItems.map((item) => ({
          description: item.description,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          itemType: item.itemType,
        })),
      };

      const invoice = await invoicesApi.create(createData);
      const sentInvoice = await invoicesApi.sendInvoice(invoice.id);

      toast({
        title: "Invoice Sent! 📧",
        description: `Invoice ${sentInvoice.invoice_number} has been sent to ${selectedClientData?.name}.`,
      });

      navigate(`/admin/invoices/${sentInvoice.id}`);
    } catch (error) {
      console.error("Error sending invoice:", error);
      toast({
        title: "Error sending invoice",
        description: "Failed to send invoice. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-16 h-16 animate-spin mx-auto mb-4 text-festival-orange" />
          <p className="text-lg font-medium text-black">
            Loading invoice data...
          </p>
        </div>
      </div>
    );
  }

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
              CREATE INVOICE
            </h1>
            <p className="text-xl text-black/70 font-medium">
              Generate a new client invoice with PayPal integration
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          <Button
            onClick={handleSaveDraft}
            variant="outline"
            disabled={saving}
            className="border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1"
          >
            {saving ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            Save Draft
          </Button>
          <Button
            onClick={handleSendInvoice}
            disabled={saving}
            className="bg-gradient-to-r from-festival-magenta to-festival-pink border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1"
          >
            {saving ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Send className="w-4 h-4 mr-2" />
            )}
            Send Invoice
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Invoice Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Invoice Details */}
          <Card className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-white">
            <div className="p-6 border-b-4 border-black bg-gradient-to-r from-festival-orange to-festival-coral">
              <h3 className="text-xl font-bold text-black">Invoice Details</h3>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <Label className="text-sm font-bold text-black">
                  Invoice Title
                </Label>
                <Input
                  value={invoiceData.title}
                  onChange={(e) =>
                    setInvoiceData({ ...invoiceData, title: e.target.value })
                  }
                  placeholder="Enter invoice title..."
                  className="border-4 border-black bg-festival-cream"
                />
              </div>

              <div>
                <Label className="text-sm font-bold text-black">
                  Description
                </Label>
                <Textarea
                  value={invoiceData.description}
                  onChange={(e) =>
                    setInvoiceData({
                      ...invoiceData,
                      description: e.target.value,
                    })
                  }
                  placeholder="Brief description of services..."
                  className="border-4 border-black bg-festival-cream"
                />
              </div>

              <div>
                <Label className="text-sm font-bold text-black">Due Date</Label>
                <Input
                  type="date"
                  value={invoiceData.dueDate}
                  onChange={(e) =>
                    setInvoiceData({ ...invoiceData, dueDate: e.target.value })
                  }
                  className="border-4 border-black bg-festival-cream"
                />
              </div>
            </div>
          </Card>

          {/* Project & Client Selection */}
          <Card className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-white">
            <div className="p-6 border-b-4 border-black bg-gradient-to-r from-festival-pink to-festival-magenta">
              <h3 className="text-xl font-bold text-white">Project & Client</h3>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <Label className="text-sm font-bold text-black">
                  Select Project (Optional)
                </Label>
                <Select
                  value={selectedProject}
                  onValueChange={setSelectedProject}
                >
                  <SelectTrigger className="border-4 border-black bg-festival-cream">
                    <SelectValue placeholder="Choose a project..." />
                  </SelectTrigger>
                  <SelectContent>
                    {projects.map((project) => (
                      <SelectItem key={project.id} value={project.id}>
                        {project.title} - {project.clientName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-sm font-bold text-black">
                  Select Client
                </Label>
                <Select
                  value={selectedClient}
                  onValueChange={setSelectedClient}
                >
                  <SelectTrigger className="border-4 border-black bg-festival-cream">
                    <SelectValue placeholder="Choose a client..." />
                  </SelectTrigger>
                  <SelectContent>
                    {users.map((user) => (
                      <SelectItem key={user.id} value={user.id}>
                        {user.name} ({user.email})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedClientData && (
                <div className="p-4 bg-festival-cream border-2 border-black">
                  <h4 className="font-bold text-black mb-2">
                    Client Information
                  </h4>
                  <div className="text-sm">
                    <p>
                      <strong>Name:</strong> {selectedClientData.name}
                    </p>
                    <p>
                      <strong>Email:</strong> {selectedClientData.email}
                    </p>
                    <p>
                      <strong>Role:</strong> {selectedClientData.role}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </Card>

          {/* Line Items */}
          <Card className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-white">
            <div className="p-6 border-b-4 border-black bg-gradient-to-r from-festival-yellow to-festival-amber">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-black">Invoice Items</h3>
                <Button
                  onClick={addLineItem}
                  size="sm"
                  className="bg-black text-white border-2 border-white"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Item
                </Button>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {lineItems.map((item, index) => (
                  <div
                    key={index}
                    className="p-4 bg-festival-cream border-2 border-black"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                      <div className="md:col-span-2">
                        <Label className="text-xs font-bold text-black">
                          Description
                        </Label>
                        <Input
                          value={item.description}
                          onChange={(e) =>
                            updateLineItem(index, "description", e.target.value)
                          }
                          placeholder="Service description..."
                          className="border-2 border-black bg-white"
                        />
                      </div>
                      <div>
                        <Label className="text-xs font-bold text-black">
                          Type
                        </Label>
                        <Select
                          value={item.itemType}
                          onValueChange={(value) =>
                            updateLineItem(index, "itemType", value)
                          }
                        >
                          <SelectTrigger className="border-2 border-black bg-white">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="design">Design</SelectItem>
                            <SelectItem value="service">Service</SelectItem>
                            <SelectItem value="product">Product</SelectItem>
                            <SelectItem value="consultation">
                              Consultation
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label className="text-xs font-bold text-black">
                          Quantity
                        </Label>
                        <Input
                          type="number"
                          value={item.quantity}
                          onChange={(e) =>
                            updateLineItem(
                              index,
                              "quantity",
                              parseInt(e.target.value) || 1,
                            )
                          }
                          min="1"
                          className="border-2 border-black bg-white"
                        />
                      </div>
                      <div>
                        <Label className="text-xs font-bold text-black">
                          Unit Price ($)
                        </Label>
                        <Input
                          type="number"
                          value={item.unitPrice}
                          onChange={(e) =>
                            updateLineItem(
                              index,
                              "unitPrice",
                              parseFloat(e.target.value) || 0,
                            )
                          }
                          min="0"
                          step="0.01"
                          className="border-2 border-black bg-white"
                        />
                      </div>
                      <div className="flex items-end">
                        <Button
                          onClick={() => removeLineItem(index)}
                          variant="outline"
                          size="sm"
                          className="border-2 border-red-500 text-red-500 hover:bg-red-50 w-full"
                          disabled={lineItems.length === 1}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="mt-2 text-right">
                      <span className="text-sm font-bold text-black">
                        Total: ${(item.quantity * item.unitPrice).toFixed(2)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          {/* Notes & Terms */}
          <Card className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-white">
            <div className="p-6 border-b-4 border-black bg-gradient-to-r from-blue-400 to-blue-500">
              <h3 className="text-xl font-bold text-white">Notes & Terms</h3>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <Label className="text-sm font-bold text-black">Notes</Label>
                <Textarea
                  value={invoiceData.notes}
                  onChange={(e) =>
                    setInvoiceData({ ...invoiceData, notes: e.target.value })
                  }
                  placeholder="Additional notes for the client..."
                  className="border-4 border-black bg-festival-cream"
                  rows={3}
                />
              </div>
              <div>
                <Label className="text-sm font-bold text-black">
                  Payment Terms
                </Label>
                <Textarea
                  value={invoiceData.terms}
                  onChange={(e) =>
                    setInvoiceData({ ...invoiceData, terms: e.target.value })
                  }
                  placeholder="Payment terms and conditions..."
                  className="border-4 border-black bg-festival-cream"
                  rows={3}
                />
              </div>
            </div>
          </Card>
        </div>

        {/* Invoice Summary */}
        <div className="space-y-6">
          <Card className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-white">
            <div className="p-6 border-b-4 border-black bg-gradient-to-r from-green-400 to-green-500">
              <div className="flex items-center gap-3">
                <Calculator className="w-6 h-6 text-black" />
                <h3 className="text-xl font-bold text-black">
                  Invoice Summary
                </h3>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-black/70">Subtotal:</span>
                  <span className="font-bold text-black">
                    ${calculateSubtotal().toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-black/70">Tax Rate:</span>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      value={invoiceData.taxRate}
                      onChange={(e) =>
                        setInvoiceData({
                          ...invoiceData,
                          taxRate: parseFloat(e.target.value) || 0,
                        })
                      }
                      className="w-20 h-8 border-2 border-black text-center"
                      step="0.01"
                      min="0"
                      max="100"
                    />
                    <span className="text-black/70">%</span>
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="text-black/70">Tax Amount:</span>
                  <span className="font-bold text-black">
                    ${calculateTax().toFixed(2)}
                  </span>
                </div>
                <div className="border-t-2 border-black pt-3">
                  <div className="flex justify-between">
                    <span className="text-lg font-bold text-black">Total:</span>
                    <span className="text-2xl font-display font-bold text-black">
                      ${calculateTotal().toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          <Card className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-white">
            <div className="p-6 border-b-4 border-black bg-gradient-to-r from-purple-400 to-purple-500">
              <div className="flex items-center gap-3">
                <FileText className="w-6 h-6 text-white" />
                <h3 className="text-xl font-bold text-white">
                  Payment Integration
                </h3>
              </div>
            </div>
            <div className="p-6">
              <div className="text-center space-y-2">
                <div className="text-6xl">💳</div>
                <p className="text-sm text-black/70 mb-4">
                  Once sent, clients can pay securely via PayPal
                </p>
                <div className="p-3 bg-festival-cream border border-black/20 text-left text-xs">
                  <p className="font-bold mb-1">PayPal Integration:</p>
                  <p>✅ Secure payment processing</p>
                  <p>✅ Automatic invoice updates</p>
                  <p>✅ Project delivery automation</p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CreateInvoice;
