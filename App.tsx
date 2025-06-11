import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/contexts/theme-context";
import { MusicProvider } from "@/contexts/music-context";
import { Sidebar } from "@/components/sidebar";
import { MusicPlayer } from "@/components/music-player";
import { SearchBar } from "@/components/search-bar";
import { useTheme } from "@/contexts/theme-context";
import { Moon, Sun, Bell, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Discover from "@/pages/Discover";
import Search from "@/pages/search";
import AIAssistant from "@/pages/ai-assistant";

function Header() {
  const { theme, toggleTheme } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-dark-200/95 backdrop-blur-md border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
              </svg>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Müzik Asistanı
            </span>
          </div>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <SearchBar />
          </div>

          {/* Navigation Links and Controls */}
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-dark-100 transition-colors"
            >
              {theme === 'dark' ? (
                <Sun className="w-5 h-5 text-gray-400" />
              ) : (
                <Moon className="w-5 h-5 text-gray-400" />
              )}
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              className="p-2 rounded-full hover:bg-dark-100 transition-colors"
            >
              <Bell className="w-5 h-5 text-gray-400" />
            </Button>
            <div className="w-8 h-8 bg-gradient-to-br from-secondary to-accent rounded-full"></div>
            
            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden p-2"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <Menu className="w-5 h-5 text-gray-400" />
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-dark-200 text-white">
      <Header />
      <div className="flex pt-16">
        <div className="hidden lg:block">
          <Sidebar />
        </div>
        <main className="flex-1 pb-32">
          {children}
        </main>
      </div>
      <MusicPlayer />
    </div>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Discover} />
      <Route path="/search" component={Search} />
      <Route path="/ai-assistant" component={AIAssistant} />
      <Route path="/home" component={Home} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <MusicProvider>
          <TooltipProvider>
            <Layout>
              <Router />
            </Layout>
            <Toaster />
          </TooltipProvider>
        </MusicProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
