import { Toaster } from "@/components/ui/toaster"
import { Toaster as Sonner } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { VaultProvider } from "./context/VaultContext"
import Index from "./pages/Index"
import VaultPage from "./pages/VaultPage"
import AccessDenied from "./pages/AccessDenied"
import NotFound from "./pages/NotFound"
import DevelopersPage from "./pages/DevelopersPage"

const queryClient = new QueryClient()

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <VaultProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/vault" element={<VaultPage />} />
            <Route path="/access-denied" element={<AccessDenied />} />
            <Route path="/developers" element={<DevelopersPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </VaultProvider>
    </TooltipProvider>
  </QueryClientProvider>
)

export default App
