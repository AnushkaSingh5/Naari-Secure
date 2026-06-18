import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { AppProvider } from "@/contexts/AppContext";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import GuardianInvite from "./pages/GuardianInvite";
import PrivateRoute from "./components/PrivateRoute";
import Travel from "./pages/Travel";
import SafeZones from "./pages/SafeZones";

import Profile from "./pages/Profile";
import TrackUser from "./pages/TrackUser";
import GuardianHistory from "./pages/GuardianHistory";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <AppProvider>
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                {/* Public Routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/invite" element={<GuardianInvite />} />

                {/* Protected Routes */}
                <Route element={<PrivateRoute />}>
                  <Route path="/" element={<Index />} />
                  <Route path="/travel" element={<Travel />} />
                  <Route path="/safe-zones" element={<SafeZones />} />
                  <Route path="/track/:id" element={<TrackUser />} />
                  <Route path="/history/:id" element={<GuardianHistory />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="*" element={<NotFound />} />
                </Route>
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </AuthProvider>
      </AppProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
