import { useState, useEffect, useRef } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { Bot, User, Send, Loader2 } from "lucide-react";

type Message = {
  id: number;
  content: string;
  isUser: boolean;
  timestamp: string;
};

type AIAssistantProps = {
  fullscreen?: boolean;
};

export default function AIAssistant({ fullscreen = false }: AIAssistantProps) {
  const [message, setMessage] = useState("");
  const [isWaitingForResponse, setIsWaitingForResponse] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  const { toast } = useToast();
  
  // Get user ID (or use a temporary ID for guests)
  const userId = user?.id.toString() || "guest";
  
  // Fetch chat history
  const { data: chatHistory = [], refetch: refetchChat } = useQuery<Message[]>({
    queryKey: [`/api/users/${userId}/chat`],
    enabled: !!userId,
    refetchInterval: isWaitingForResponse ? 1000 : false, // Poll when waiting for AI response
  });
  
  // Reset chat history
  const clearChatMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", `/api/users/${userId}/chat`, {
        content: "temizle",
        isUser: true
      });
      return res.json();
    },
    onSuccess: () => {
      refetchChat();
      setIsWaitingForResponse(false);
      toast({
        title: "Sohbet Temizlendi",
        description: "Tüm sohbet geçmişiniz silindi.",
        variant: "default",
      });
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Hata",
        description: "Sohbet temizlenemedi. Lütfen daha sonra tekrar deneyin.",
      });
      console.error("Error clearing chat:", error);
    },
  });
  
  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async (message: string) => {
      const res = await apiRequest("POST", `/api/users/${userId}/chat`, {
        content: message,
        isUser: true
      });
      return res.json();
    },
    onSuccess: (data) => {
      console.log("Mesaj gönderildi, yanıt:", data);
      
      // Yanıt içinde userMessage ve aiMessage varsa ikisi de gelmiş demektir
      if (data.userMessage && data.aiMessage) {
        // Yeni mesajları eklemek için refetch'i çağır
        refetchChat();
        setIsWaitingForResponse(false);
      } else {
        // Sadece kullanıcı mesajı geldiyse, AI yanıtını bekle
        refetchChat();
        setIsWaitingForResponse(true);
        
        // Set a timeout to stop polling after 5 seconds if no response
        setTimeout(() => {
          refetchChat(); // Bir daha almayı dene
          setIsWaitingForResponse(false);
        }, 5000);
      }
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "İletişim Hatası",
        description: "Mesajınız gönderilemedi. Lütfen daha sonra tekrar deneyin.",
      });
      console.error("Error sending message:", error);
    },
  });
  
  // Auto scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    
    // If we get a new message and the last one is from the AI, stop waiting
    if (chatHistory.length > 0 && !chatHistory[chatHistory.length - 1].isUser) {
      setIsWaitingForResponse(false);
    }
  }, [chatHistory]);
  
  // Send a welcome message if this is the first time
  useEffect(() => {
    if (chatHistory.length === 0) {
      sendMessageMutation.mutate("Merhaba, ben senin kişisel müzik asistanınım.");
    }
  }, [chatHistory]);
  
  const handleSendMessage = async () => {
    if (!message.trim()) return;
    
    try {
      await sendMessageMutation.mutateAsync(message);
      setMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };
  
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  // Suggestions for quick prompts
  const suggestions = [
    "Enerjik şarkılar öner",
    "90'lar pop müziği",
    "Spor yaparken dinlemek için",
    "Türkçe rock önerileri",
    "Romantik şarkılar"
  ];
  
  // Sohbeti temizleme fonksiyonu
  const clearChat = () => {
    if (window.confirm('Tüm sohbet geçmişi silinecek. Devam etmek istiyor musunuz?')) {
      clearChatMutation.mutate();
    }
  };
  
  return (
    <div className={cn(
      "bg-card rounded-xl p-4 md:p-6 shadow border border-border",
      fullscreen ? "h-full flex flex-col" : "mb-8"
    )}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <div className="w-12 h-12 bg-gradient-to-br from-primary to-purple-600 rounded-full flex items-center justify-center">
            <Bot className="h-6 w-6 text-white" />
          </div>
          <div className="ml-4">
            <h2 className="text-lg md:text-xl font-semibold">MüzikAI Asistanı</h2>
            <p className="text-sm text-muted-foreground">Kişiselleştirilmiş müzik önerileri, ruh halinize göre şarkılar ve müzikal keşifler</p>
          </div>
        </div>
        
        {/* Sohbeti temizleme butonu */}
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={clearChat}
          disabled={clearChatMutation.isPending || chatHistory.length === 0}
          className="text-muted-foreground hover:text-foreground"
        >
          Sohbeti Temizle
        </Button>
      </div>
      
      <div className={cn(
        "bg-background rounded-lg p-4 mb-4 overflow-y-auto",
        fullscreen ? "flex-1" : "max-h-60"
      )}>
        {chatHistory.length > 0 ? (
          chatHistory.map((msg) => (
            <div key={msg.id} className="flex items-start mb-4">
              {msg.isUser ? (
                <>
                  <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="h-4 w-4" />
                  </div>
                  <div className="ml-3 bg-secondary rounded-lg p-3 flex-1">
                    <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                  </div>
                </>
              ) : (
                <>
                  <div className="w-8 h-8 bg-gradient-to-br from-primary to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <Bot className="h-4 w-4 text-white" />
                  </div>
                  <div className="ml-3 bg-muted rounded-lg p-3 flex-1">
                    <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                  </div>
                </>
              )}
            </div>
          ))
        ) : (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            <p>Asistanla sohbet başlatmak için bir mesaj gönderin</p>
          </div>
        )}
        
        {/* Yanıt bekleme animasyonu */}
        {isWaitingForResponse && (
          <div className="flex items-start mb-4">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
              <Bot className="h-4 w-4 text-white" />
            </div>
            <div className="ml-3 bg-muted rounded-lg p-4 flex-1">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "600ms" }}></div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      <div className="relative">
        <Input
          type="text"
          placeholder="Asistana bir mesaj yaz... (örn: 'Türkçe pop öner' veya 'Arabesk şarkılar')"
          className="bg-muted w-full py-3 px-4 pr-12"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={sendMessageMutation.isPending || isWaitingForResponse}
        />
        <Button
          size="icon"
          className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-primary text-primary-foreground p-2 rounded-full h-8 w-8"
          onClick={handleSendMessage}
          disabled={sendMessageMutation.isPending || !message.trim() || isWaitingForResponse}
        >
          {sendMessageMutation.isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
        </Button>
      </div>
      
      <div className="flex flex-wrap mt-4 gap-2 pb-2">
        {suggestions.map((suggestion, index) => (
          <Button
            key={index}
            variant="secondary"
            className="text-sm rounded-full px-4 py-2 whitespace-nowrap h-auto"
            onClick={() => {
              setMessage(suggestion);
              setTimeout(() => handleSendMessage(), 100);
            }}
            disabled={sendMessageMutation.isPending || isWaitingForResponse}
          >
            {suggestion}
          </Button>
        ))}
      </div>
    </div>
  );
}
