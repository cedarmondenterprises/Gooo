import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
//mport { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import EmailSetup from "@/pages/EmailSetup";
import DomainConnect from "@/pages/DomainConnect";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/domain-connect" component={DomainConnect} />
      <Route path="/email-setup" component={EmailSetup} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Header />
        <main>
          <Router />
        </main>
        <Footer />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
