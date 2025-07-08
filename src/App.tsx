import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import CartoonyCursor from "@/components/CartoonyCursor";
import GSAPCursor from "@/components/GSAPCursor";
import RetroCursor from "@/components/RetroCursor";
import GSAPPageTransition from "@/components/GSAPPageTransition";
import GSAPLoader from "@/components/GSAPLoader";
import GSAPScrollProgress from "@/components/GSAPScrollProgress";
import RetroPreloader from "@/components/RetroPreloader";
import { initializeGSAP } from "@/lib/gsap-animations";
import Index from "./pages/Index";
import StartProject from "./pages/StartProject";
import Services from "./pages/Services";
import Portfolio from "./pages/Portfolio";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Dashboard from "./pages/Dashboard";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import Disputes from "./pages/Disputes";
import Login from "./pages/Login";
import DesignDashboard from "./pages/DesignDashboard";
import NewRequest from "./pages/NewRequest";
import Chat from "./pages/Chat";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

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
        <Route path="/terms" element={<Terms />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/disputes" element={<Disputes />} />
        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
