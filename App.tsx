import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useState } from "react";
import { MusicPlayer } from "@/components/music-player";
import { Sidebar, MobileMenuButton } from "@/components/sidebar";
import { AuthProvider } from "@/context/auth-context";
import { PlayerProvider } from "@/context/player-context";
import { useAuth } from "@/context/auth-context";
import { AiChat } from "@/components/ui/ai-chat";
import { getRecommendedMessages } from "@/lib/openai";
import { Button } from "@/components/ui/button";
import { Bot } from "lucide-react";
import { AuthModal } from "@/components/ui/auth-modal";

// Pages
import Home from "@/pages/home";
import Search from "@/pages/search";
import AIChatPage from "@/pages/ai-chat";
import Favorites from "@/pages/favorites";
import Recent from "@/pages/recent";
import Profile from "@/pages/profile";
import NotFound from "@/pages/not-found";

function AppContent() {
  const { user, isAuthenticated, login, register, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [minimizedChat, setMinimizedChat] = useState(true);
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [chatLoading, setChatLoading] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  
  const handleCloseSidebar = () => {
    setSidebarOpen(false);
  };
  
  const handleSendChatMessage = async (message: string) => {
    if (chatLoading) return;
    
    // Add user message
    const updatedMessages = [
      ...chatMessages,
      { role: "user", content: message }
    ];
    setChatMessages(updatedMessages);
    setChatLoading(true);
    
    try {
      // Create a new chat if this is the first message
      let chatId = 1; // Default chat ID
      
      // Call API to send message to chat
      const response = await fetch(`/api/chats/${chatId}/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message }),
        credentials: "include",
      });
      
      if (!response.ok) {
        throw new Error("Failed to send message");
      }
      
      const data = await response.json();
      setChatMessages(data.messages);
    } catch (error) {
      console.error("Error sending message:", error);
      // Add error message
      setChatMessages([
        ...updatedMessages,
        { 
          role: "assistant", 
          content: "Sorry, I'm having trouble processing your request right now. Please try again later." 
        }
      ]);
    } finally {
      setChatLoading(false);
    }
  };
  
  return (
    <div className="flex flex-col min-h-screen bg-dark-300 text-light-100">
      {/* Mobile Header */}
      <div className="md:hidden bg-dark-200 p-4 flex items-center justify-between">
        <div className="flex items-center">
          <div className="h-8 w-8 bg-primary rounded-md flex items-center justify-center mr-2">
            <svg viewBox="0 0 24 24" className="h-5 w-5 text-white" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
            </svg>
          </div>
          <h1 className="font-heading font-bold text-lg">MusicAI</h1>
        </div>
        <MobileMenuButton onClick={() => setSidebarOpen(true)} />
      </div>
      
      <div className="flex flex-col md:flex-row flex-1">
        {/* Sidebar */}
        <Sidebar 
          user={user} 
          isOpen={sidebarOpen} 
          onClose={handleCloseSidebar} 
        />

        {/* Main Content */}
        <main className="flex-1 overflow-x-hidden pb-20">
          <Switch>
            <Route path="/" component={Home} />
            <Route path="/search" component={Search} />
            <Route path="/ai-chat" component={AIChatPage} />
            <Route path="/favorites" component={Favorites} />
            <Route path="/recent" component={Recent} />
            <Route path="/profile" component={Profile} />
            <Route component={NotFound} />
          </Switch>
        </main>
        
        {/* AI Chat */}
        <div className="fixed bottom-24 right-4 z-40 md:bottom-32 md:right-8">
          {chatOpen && !minimizedChat ? (
            <AiChat
              messages={chatMessages}
              isLoading={chatLoading}
              onSendMessage={handleSendChatMessage}
              onClose={() => {
                setChatOpen(false);
                setMinimizedChat(true);
              }}
              onMinimize={() => setMinimizedChat(true)}
              recommendedMessages={getRecommendedMessages()}
              className="w-full max-w-sm"
            />
          ) : (
            <Button
              onClick={() => {
                if (!isAuthenticated) {
                  setAuthModalOpen(true);
                  return;
                }
                setChatOpen(true);
                setMinimizedChat(false);
              }}
              className="w-14 h-14 rounded-full bg-secondary hover:bg-secondary/90 shadow-lg float-right"
            >
              <Bot className="h-6 w-6 text-white" />
            </Button>
          )}
        </div>
      </div>
      
      {/* Music Player */}
      <MusicPlayer />
      
      {/* Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onLogin={login}
        onRegister={register}
      />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <PlayerProvider>
          <TooltipProvider>
            <AppContent />
            <Toaster />
          </TooltipProvider>
        </PlayerProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
