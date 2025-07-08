import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { gsap } from "gsap";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { mockAdminProjects, mockAdminUsers } from "@/lib/admin-data";
import {
  ArrowLeft,
  Plus,
  Trash2,
  Save,
  Send,
  Calculator,
  FileText,
} from "lucide-react";

const CreateInvoice: React.FC = () => {
  const [selectedProject, setSelectedProject] = useState("");
  const [lineItems, setLineItems] = useState([
    { description: "", quantity: 1, rate: 0, type: "design" },
  ]);
  const [invoiceData, setInvoiceData] = useState({
    dueDate: "",
    notes: "",
    taxRate: 8,
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

  const addLineItem = () => {
    setLineItems([
      ...lineItems,
      { description: "", quantity: 1, rate: 0, type: "design" },
    ]);
  };

  const removeLineItem = (index: number) => {
    setLineItems(lineItems.filter((_, i) => i !== index));
  };

  const updateLineItem = (index: number, field: string, value: any) => {
    const updated = lineItems.map((item, i) =>
      i === index ? { ...item, [field]: value } : item,
    );
    setLineItems(updated);
  };

  const calculateSubtotal = () => {
    return lineItems.reduce((sum, item) => sum + item.quantity * item.rate, 0);
  };

  const calculateTax = () => {
    return (calculateSubtotal() * invoiceData.taxRate) / 100;
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax();
  };

  const selectedProjectData = mockAdminProjects.find(
    (p) => p.id === selectedProject,
  );

  const handleSaveDraft = () => {
    // Save invoice as draft
    const invoiceData = {
      projectId: selectedProject,
      lineItems,
      dueDate: invoiceData.dueDate,
      notes: invoiceData.notes,
      taxRate: invoiceData.taxRate,
      total: calculateTotal(),
      status: "draft",
    };
    localStorage.setItem("draftInvoice", JSON.stringify(invoiceData));

    // Show success message
    const notification = document.createElement("div");
    notification.className =
      "fixed bottom-4 right-4 bg-green-500 text-white p-4 border-4 border-black z-50";
    notification.textContent = "Invoice saved as draft!";
    document.body.appendChild(notification);
    setTimeout(() => document.body.removeChild(notification), 3000);
  };

  const handleSendInvoice = () => {
    if (!selectedProject) {
      alert("Please select a project first");
      return;
    }
    if (lineItems.some((item) => !item.description || item.rate <= 0)) {
      alert("Please fill in all line items");
      return;
    }

    // Send invoice
    const invoiceData = {
      projectId: selectedProject,
      lineItems,
      dueDate: invoiceData.dueDate,
      notes: invoiceData.notes,
      taxRate: invoiceData.taxRate,
      total: calculateTotal(),
      status: "sent",
      sentDate: new Date().toISOString(),
    };

    // Show success animation and navigate
    const successEl = document.createElement("div");
    successEl.className =
      "fixed inset-0 flex items-center justify-center z-50 bg-black/50";
    successEl.innerHTML = `
      <div class="bg-white border-4 border-black p-8 text-center shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
        <div class="text-6xl mb-4">📧</div>
        <h3 class="text-2xl font-bold text-black mb-2">Invoice Sent!</h3>
        <p class="text-black/70">Invoice has been sent to the client</p>
      </div>
    `;
    document.body.appendChild(successEl);

    setTimeout(() => {
      document.body.removeChild(successEl);
      navigate("/admin/invoices");
    }, 2000);
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
              CREATE INVOICE
            </h1>
            <p className="text-xl text-black/70 font-medium">
              Generate a new client invoice
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          <Button
            onClick={handleSaveDraft}
            variant="outline"
            className="border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1"
          >
            <Save className="w-4 h-4 mr-2" />
            Save Draft
          </Button>
          <Button
            onClick={handleSendInvoice}
            className="bg-gradient-to-r from-festival-magenta to-festival-pink border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1"
          >
            <Send className="w-4 h-4 mr-2" />
            Send Invoice
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Invoice Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Project Selection */}
          <Card className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-white">
            <div className="p-6 border-b-4 border-black bg-gradient-to-r from-festival-orange to-festival-coral">
              <h3 className="text-xl font-bold text-black">Project Details</h3>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <Label className="text-sm font-bold text-black">
                  Select Project
                </Label>
                <select
                  value={selectedProject}
                  onChange={(e) => setSelectedProject(e.target.value)}
                  className="w-full p-3 border-4 border-black bg-festival-cream"
                >
                  <option value="">Choose a project...</option>
                  {mockAdminProjects.map((project) => (
                    <option key={project.id} value={project.id}>
                      {project.title} - {project.clientName}
                    </option>
                  ))}
                </select>
              </div>

              {selectedProjectData && (
                <div className="p-4 bg-festival-cream border-2 border-black">
                  <h4 className="font-bold text-black mb-2">
                    {selectedProjectData.title}
                  </h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-black/60">Client:</span>
                      <p className="font-medium">
                        {selectedProjectData.clientName}
                      </p>
                    </div>
                    <div>
                      <span className="text-black/60">Budget:</span>
                      <p className="font-medium">
                        ${selectedProjectData.budget}
                      </p>
                    </div>
                  </div>
                </div>
              )}

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

          {/* Line Items */}
          <Card className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-white">
            <div className="p-6 border-b-4 border-black bg-gradient-to-r from-festival-pink to-festival-magenta">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-white">Invoice Items</h3>
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
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                      <div className="md:col-span-2">
                        <Label className="text-xs font-bold text-black">
                          Description
                        </Label>
                        <Input
                          value={item.description}
                          onChange={(e) =>
                            updateLineItem(index, "description", e.target.value)
                          }
                          placeholder="Design work description..."
                          className="border-2 border-black bg-white"
                        />
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
                              parseInt(e.target.value) || 0,
                            )
                          }
                          className="border-2 border-black bg-white"
                        />
                      </div>
                      <div>
                        <Label className="text-xs font-bold text-black">
                          Rate ($)
                        </Label>
                        <Input
                          type="number"
                          value={item.rate}
                          onChange={(e) =>
                            updateLineItem(
                              index,
                              "rate",
                              parseFloat(e.target.value) || 0,
                            )
                          }
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
                        Amount: ${(item.quantity * item.rate).toFixed(2)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          {/* Notes */}
          <Card className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-white">
            <div className="p-6 border-b-4 border-black bg-gradient-to-r from-festival-yellow to-festival-amber">
              <h3 className="text-xl font-bold text-black">Additional Notes</h3>
            </div>
            <div className="p-6">
              <Textarea
                value={invoiceData.notes}
                onChange={(e) =>
                  setInvoiceData({ ...invoiceData, notes: e.target.value })
                }
                placeholder="Add any additional notes or payment terms..."
                className="border-4 border-black bg-festival-cream"
                rows={4}
              />
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
                      className="w-16 h-8 border-2 border-black text-center"
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
            <div className="p-6 border-b-4 border-black bg-gradient-to-r from-blue-400 to-blue-500">
              <div className="flex items-center gap-3">
                <FileText className="w-6 h-6 text-white" />
                <h3 className="text-xl font-bold text-white">Preview</h3>
              </div>
            </div>
            <div className="p-6">
              <div className="text-center space-y-2">
                <div className="text-6xl">📄</div>
                <p className="text-sm text-black/70">
                  Invoice preview will appear here
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-2 border-black"
                >
                  Generate Preview
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CreateInvoice;
