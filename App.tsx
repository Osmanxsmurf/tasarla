import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useEffect } from "react";
import { useTheme } from "./contexts/ThemeContext";
import { useMusic } from "./contexts/MusicContext";

// Pages
import Home from "@/pages/Home";
import Explore from "@/pages/Explore";
import Artists from "@/pages/Artists";
import Albums from "@/pages/Albums";
import Profile from "@/pages/Profile";
import Recommendations from "@/pages/Recommendations";
import Visualizer from "@/pages/Visualizer";
import MusicDetail from "@/pages/MusicDetail";
import Community from "@/pages/Community";
import NotFound from "@/pages/not-found";

// Components
import Sidebar from "@/components/layout/Sidebar";
import MobileNav from "@/components/layout/MobileNav";
import SearchHeader from "@/components/layout/SearchHeader";
import { MusicPlayer } from "@/components/music/MusicPlayer";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/explore" component={Explore} />
      <Route path="/artists" component={Artists} />
      <Route path="/albums" component={Albums} />
      <Route path="/profile" component={Profile} />
      <Route path="/recommendations" component={Recommendations} />
      <Route path="/visualizer" component={Visualizer} />
      <Route path="/music" component={MusicDetail} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const { theme } = useTheme();
  const { isPlaying } = useMusic();

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="flex flex-col h-screen overflow-hidden">
          <div className="flex h-full">
            <Sidebar />
            <main className="flex-1 overflow-y-auto">
              <SearchHeader />
              <Router />
            </main>
          </div>
          {isPlaying && <MusicPlayer />}
          <MobileNav />
          <Toaster />
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
