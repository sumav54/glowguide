import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ShoppingProvider } from "@/context/ShoppingContext";
import { ThemeProvider } from "@/components/ThemeProvider";
import CompareTray from "@/components/CompareTray";
import FloatingAIButton from "@/components/FloatingAIButton";
import Index from "./pages/Index";
import Quiz from "./pages/Quiz";
import Products from "./pages/Products";
import SkinAnalysis from "./pages/SkinAnalysis";
import RoutineBuilder from "./pages/RoutineBuilder";
import Auth from "./pages/Auth";
import Wishlist from "./pages/Wishlist";
import Compare from "./pages/Compare";
import Deals from "./pages/Deals";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ShoppingProvider>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/quiz" element={<Quiz />} />
              <Route path="/products" element={<Products />} />
              <Route path="/skin-analysis" element={<SkinAnalysis />} />
              <Route path="/routine-builder" element={<RoutineBuilder />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/wishlist" element={<Wishlist />} />
              <Route path="/compare" element={<Compare />} />
              <Route path="/deals" element={<Deals />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
            <CompareTray />
            <FloatingAIButton />
          </ShoppingProvider>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
