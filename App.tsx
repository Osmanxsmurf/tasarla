import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SpotifyAuthProvider } from "@/context/SpotifyAuthContext";
import { AIProvider } from "@/context/AIContext";
import Home from "@/pages/Home";
import SpotifyCallback from "@/pages/SpotifyCallback";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/callback" component={SpotifyCallback} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <SpotifyAuthProvider>
        <AIProvider>
          <TooltipProvider>
            <Toaster />
            <Router />
          </TooltipProvider>
        </AIProvider>
      </SpotifyAuthProvider>
    </QueryClientProvider>
  );
}

export default App;
