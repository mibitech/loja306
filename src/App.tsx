import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { Navigation } from "@/components/ui/navigation";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import About from "./pages/About";
import Activities from "./pages/Activities";
import Events from "./pages/Events";
import Education from "./pages/Education";
import Contact from "./pages/Contact";
import Members from "./pages/Members";
import MemberDocuments from "./pages/MemberDocuments";
import MemberAgenda from "./pages/MemberAgenda";
import MemberMessages from "./pages/MemberMessages";
import WorshipfulMasters from "./pages/WorshipfulMasters";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Navigation />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/about" element={<About />} />
            <Route path="/activities" element={<Activities />} />
            <Route path="/events" element={<Events />} />
            <Route path="/education" element={<Education />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/members" element={<Members />} />
            <Route path="/members/documents" element={<MemberDocuments />} />
            <Route path="/members/agenda" element={<MemberAgenda />} />
            <Route path="/members/messages" element={<MemberMessages />} />
            <Route path="/members/worshipful-masters" element={<WorshipfulMasters />} />
            <Route path="/profile" element={<Profile />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
