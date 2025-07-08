import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import { useEffect, useState, lazy, Suspense } from "react";
import { AuthProvider } from "@/hooks/useAuth";
import CartoonyCursor from "@/components/CartoonyCursor";
import GSAPCursor from "@/components/GSAPCursor";
import RetroCursor from "@/components/RetroCursor";
import GSAPPageTransition from "@/components/GSAPPageTransition";
import GSAPLoader from "@/components/GSAPLoader";
import GSAPScrollProgress from "@/components/GSAPScrollProgress";
import RetroPreloader from "@/components/RetroPreloader";
import { initializeGSAP } from "@/lib/gsap-animations";

// Lazy load page components
const Index = lazy(() => import("./pages/Index"));
const StartProject = lazy(() => import("./pages/StartProject"));
const Services = lazy(() => import("./pages/Services"));
const Portfolio = lazy(() => import("./pages/Portfolio"));
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Terms = lazy(() => import("./pages/Terms"));
const Privacy = lazy(() => import("./pages/Privacy"));
const Disputes = lazy(() => import("./pages/Disputes"));
const Login = lazy(() => import("./pages/Login"));
const DesignDashboard = lazy(() => import("./pages/DesignDashboard"));
const NewRequest = lazy(() => import("./pages/NewRequest"));
const Chat = lazy(() => import("./pages/Chat"));
const Payments = lazy(() => import("./pages/Payments"));
const Downloads = lazy(() => import("./pages/Downloads"));
const Requests = lazy(() => import("./pages/Requests"));
const NotFound = lazy(() => import("./pages/NotFound"));

// Lazy load admin components
const AdminLayout = lazy(() => import("./components/admin/AdminLayout").then(module => ({ default: module.AdminLayout })));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const ProjectKanban = lazy(() => import("./pages/admin/ProjectKanban"));
const UsersManagement = lazy(() => import("./pages/admin/UsersManagement"));
const TeamManagement = lazy(() => import("./pages/admin/TeamManagement"));
const PermissionsManagement = lazy(() => import("./pages/admin/PermissionsManagement"));
const ProjectsList = lazy(() => import("./pages/admin/ProjectsList"));
const ProjectAssignments = lazy(() => import("./pages/admin/ProjectAssignments"));
const AdminChat = lazy(() => import("./pages/admin/AdminChat"));
const AdminInvoices = lazy(() => import("./pages/admin/AdminInvoices"));
const SystemAlerts = lazy(() => import("./pages/admin/SystemAlerts"));
const AuditLogs = lazy(() => import("./pages/admin/AuditLogs"));
const AdminSettings = lazy(() => import("./pages/admin/AdminSettings"));
const AdminAnalytics = lazy(() => import("./pages/admin/AdminAnalytics"));
const AdminContent = lazy(() => import("./pages/admin/AdminContent"));
const CreateInvoice = lazy(() => import("./pages/admin/CreateInvoice"));
const InvoiceReports = lazy(() => import("./pages/admin/InvoiceReports"));
const CreateChat = lazy(() => import("./pages/admin/CreateChat"));
const CreateProject = lazy(() => import("./pages/admin/CreateProject"));
const queryClient = new QueryClient();

// Loading component for Suspense
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-festival-cream">
    <div className="text-center">
      <div className="w-16 h-16 border-4 border-festival-orange border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
      <p className="text-lg font-medium text-black">Loading amazing content...</p>
    </div>
  </div>
);
const AppContent = () => {
  const [isLoading, setIsLoading] = useState(false); // Disabled preloader

  useEffect(() => {
    initializeGSAP();
  }, []);

  const handleLoadComplete = () => {
    setIsLoading(false);
  };

  return (
    <>
      {isLoading && <RetroPreloader onComplete={handleLoadComplete} />}
      {!isLoading && <GSAPScrollProgress />}
      <RetroCursor enabled={!isLoading} />
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<Index isLoadingComplete={!isLoading} />} />
          <Route path="/start-project" element={<StartProject />} />
          <Route path="/services" element={<Services />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/design-dashboard" element={<DesignDashboard />} />
          <Route path="/new-request" element={<NewRequest />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/payments" element={<Payments />} />
          <Route path="/downloads" element={<Downloads />} />
          <Route path="/requests" element={<Requests />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="users" element={<UsersManagement />} />
            <Route path="teams" element={<TeamManagement />} />
            <Route path="permissions" element={<PermissionsManagement />} />
            <Route path="projects" element={<ProjectsList />} />
            <Route path="projects/create" element={<CreateProject />} />
            <Route path="projects/kanban" element={<ProjectKanban />} />
            <Route path="projects/assignments" element={<ProjectAssignments />} />
            <Route path="chat" element={<AdminChat />} />
            <Route path="chat/create" element={<CreateChat />} />
            <Route path="invoices" element={<AdminInvoices />} />
            <Route path="invoices/create" element={<CreateInvoice />} />
            <Route path="invoices/reports" element={<InvoiceReports />} />
            <Route path="alerts" element={<SystemAlerts />} />
            <Route path="audit" element={<AuditLogs />} />
            <Route path="settings" element={<AdminSettings />} />
            <Route path="analytics" element={<AdminAnalytics />} />
            <Route path="content" element={<AdminContent />} />
          </Route>
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/disputes" element={<Disputes />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BrowserRouter>
        <AuthProvider>
          <Toaster />
          <Sonner />
          <AppContent />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
