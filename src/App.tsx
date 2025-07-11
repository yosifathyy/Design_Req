import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { EmailConfirmationReminder } from "@/components/EmailConfirmationReminder";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import DesignDashboard from "./pages/DesignDashboard";
import StartProject from "./pages/StartProject";
import NotFound from "./pages/NotFound";
import Chat from "./pages/Chat";
import Requests from "./pages/Requests";
import RequestDetail from "./pages/RequestDetail";
import NewRequest from "./pages/NewRequest";
import Downloads from "./pages/Downloads";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Services from "./pages/Services";
import Payments from "./pages/Payments";

// Admin imports
import { AdminLayout } from "./components/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminAnalytics from "./pages/admin/AdminAnalytics";
import AdminChat from "./pages/admin/AdminChat";
import AdminContent from "./pages/admin/AdminContent";
import AdminInvoices from "./pages/admin/AdminInvoices";
import AdminSettings from "./pages/admin/AdminSettings";
import AuditLogs from "./pages/admin/AuditLogs";
import CreateChat from "./pages/admin/CreateChat";
import CreateInvoice from "./pages/admin/CreateInvoice";
import CreateProject from "./pages/admin/CreateProject";
import CreateUser from "./pages/admin/CreateUser";
import EditProject from "./pages/admin/EditProject";
import EditUser from "./pages/admin/EditUser";
import InvoiceDetail from "./pages/admin/InvoiceDetail";
import InvoiceReports from "./pages/admin/InvoiceReports";
import PermissionsManagement from "./pages/admin/PermissionsManagement";
import ProjectAssignments from "./pages/admin/ProjectAssignments";
import ProjectDetail from "./pages/admin/ProjectDetail";
import ProjectKanban from "./pages/admin/ProjectKanban";
import ProjectsList from "./pages/admin/ProjectsList";
import SystemAlerts from "./pages/admin/SystemAlerts";
import TeamManagement from "./pages/admin/TeamManagement";
import UsersManagement from "./pages/admin/UsersManagement";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <EmailConfirmationReminder />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/design-dashboard" element={<DesignDashboard />} />
            <Route path="/start-project" element={<StartProject />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/requests" element={<Requests />} />
            <Route path="/requests/:id" element={<RequestDetail />} />
            <Route path="/new-request" element={<NewRequest />} />
            <Route path="/downloads" element={<Downloads />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/services" element={<Services />} />
            <Route path="/payments" element={<Payments />} />

            {/* Admin Routes - All wrapped in AdminLayout */}
            <Route
              path="/admin/*"
              element={
                <AdminLayout>
                  <Routes>
                    {/* User & Team Management */}
                    <Route path="users/create" element={<CreateUser />} />
                    <Route path="users/:id/edit" element={<EditUser />} />
                    <Route path="users" element={<UsersManagement />} />
                    <Route path="team" element={<TeamManagement />} />
                    <Route
                      path="permissions"
                      element={<PermissionsManagement />}
                    />

                    {/* Project Management */}
                    <Route path="projects/create" element={<CreateProject />} />
                    <Route path="projects/kanban" element={<ProjectKanban />} />
                    <Route
                      path="projects/assignments"
                      element={<ProjectAssignments />}
                    />
                    <Route path="projects/:id/edit" element={<EditProject />} />
                    <Route path="projects/:id" element={<ProjectDetail />} />
                    <Route path="projects" element={<ProjectsList />} />

                    {/* Communication */}
                    <Route path="chat/create" element={<CreateChat />} />
                    <Route path="chat/:id" element={<AdminChat />} />
                    <Route path="chat" element={<AdminChat />} />

                    {/* Financial Management */}
                    <Route path="invoices/create" element={<CreateInvoice />} />
                    <Route
                      path="invoices/reports"
                      element={<InvoiceReports />}
                    />
                    <Route path="invoices/:id" element={<InvoiceDetail />} />
                    <Route path="invoices" element={<AdminInvoices />} />

                    {/* Content & Settings */}
                    <Route path="audit-logs" element={<AuditLogs />} />
                    <Route path="analytics" element={<AdminAnalytics />} />
                    <Route path="alerts" element={<SystemAlerts />} />
                    <Route path="content" element={<AdminContent />} />
                    <Route path="settings" element={<AdminSettings />} />
                    <Route path="dashboard" element={<AdminDashboard />} />

                    {/* Default admin route */}
                    <Route path="" element={<AdminDashboard />} />
                  </Routes>
                </AdminLayout>
              }
            />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
