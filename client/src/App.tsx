import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Home from "@/pages/home";
import NotFound from "@/pages/not-found";
import AdminLogin from "@/pages/admin-login";
import AdminDashboard from "@/pages/admin-dashboard";
import AdminProducts from "@/pages/admin-products";
import AdminContent from "@/pages/admin-content";
import AdminOrders from "@/pages/admin-orders";
import AdminLocations from "@/pages/admin-locations";
import AdminKnowledgeBase from "@/pages/admin-knowledge-base";
import AdminApiUsage from "@/pages/admin-api-usage";
import VirtualDispensary from "@/pages/virtual-dispensary";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/virtual-dispensary" component={VirtualDispensary} />
      <Route path="/admin/login" component={AdminLogin} />
      <Route path="/admin" component={AdminDashboard} />
      <Route path="/admin/products" component={AdminProducts} />
      <Route path="/admin/content" component={AdminContent} />
                  <Route path="/admin/orders" component={AdminOrders} />
            <Route path="/admin/locations" component={AdminLocations} />
      <Route path="/admin/knowledge-base" component={AdminKnowledgeBase} />
      <Route path="/admin/api-usage" component={AdminApiUsage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
