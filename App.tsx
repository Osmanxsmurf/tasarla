import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Sidebar } from "@/components/sidebar";
import { TopBar } from "@/components/top-bar";
import { RightSidebar } from "@/components/right-sidebar";
import Home from "@/pages/home";
import NotFound from "@/pages/not-found";

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden bg-gradient-to-br from-violet-950 via-purple-900 to-indigo-950 relative">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-pink-500/5 to-cyan-500/10 animate-pulse"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-500/20 via-transparent to-transparent"></div>
      
      <Sidebar />
      <main className="flex-1 flex flex-col relative z-10">
        <TopBar />
        <div className="flex-1 overflow-y-auto">
          {children}
        </div>
      </main>
      <RightSidebar />
    </div>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/search" component={() => <div className="p-6">Arama sayfası yakında...</div>} />
      <Route path="/ai-recommendations" component={() => <div className="p-6">AI önerileri sayfası yakında...</div>} />
      <Route path="/trending" component={() => <div className="p-6">Trendler sayfası yakında...</div>} />
      <Route path="/liked" component={() => <div className="p-6">Beğenilen şarkılar yakında...</div>} />
      <Route path="/history" component={() => <div className="p-6">Dinleme geçmişi yakında...</div>} />
      <Route path="/playlists" component={() => <div className="p-6">Çalma listeleri yakında...</div>} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Layout>
          <Router />
        </Layout>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
