import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Layout, { MusicPlayerProvider } from "@/components/Layout";
import Home from "@/pages/Home";
import Search from "@/pages/Search";
import Library from "@/pages/Library";
import AIPage from "@/pages/AI";
import DiscoveryPage from "@/pages/Discovery";
import ProfilePage from "@/pages/Profile";
import VideosPage from "@/pages/Videos";
import ArtistPage from "@/pages/ArtistPage";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/search" component={Search} />
      <Route path="/library" component={Library} />
      <Route path="/favorites" component={Library} />
      <Route path="/playlist" component={Library} />
      <Route path="/recently-played" component={Library} />
      <Route path="/ai" component={AIPage} />
      <Route path="/discovery" component={DiscoveryPage} />
      <Route path="/profile" component={ProfilePage} />
      <Route path="/videos" component={VideosPage} />
      <Route path="/artist" component={ArtistPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <MusicPlayerProvider>
          <Layout>
            <Router />
          </Layout>
        </MusicPlayerProvider>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
