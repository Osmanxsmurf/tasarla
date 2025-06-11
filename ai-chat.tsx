import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Minimize2, X, Send, SmilePlus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

interface AIChatProps {
  messages: ChatMessage[];
  isLoading: boolean;
  onSendMessage: (message: string) => void;
  onClose: () => void;
  onMinimize: () => void;
  recommendedMessages: string[];
  className?: string;
}

export function AiChat({
  messages,
  isLoading,
  onSendMessage,
  onClose,
  onMinimize,
  recommendedMessages,
  className,
}: AIChatProps) {
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() && !isLoading) {
      onSendMessage(inputValue);
      setInputValue("");
    }
  };

  // Handle recommended message click
  const handleRecommendedMessage = (message: string) => {
    if (!isLoading) {
      onSendMessage(message);
    }
  };

  // Get recommendations based on chat context
  const getContextualRecommendations = () => {
    // If no messages yet, return the default recommendations
    if (messages.length === 0) {
      return recommendedMessages;
    }
    
    // Otherwise, return recommendations that make sense in the context
    return recommendedMessages;
  };

  return (
    <div className={cn(
      "bg-dark-200 border border-dark-100 rounded-lg shadow-lg overflow-hidden flex flex-col w-full max-w-sm",
      "transition-all duration-200 ease-in-out",
      className
    )}>
      {/* Chat header */}
      <div className="bg-primary/90 p-3 flex justify-between items-center">
        <div className="flex items-center">
          <div className="h-8 w-8 bg-white/20 rounded-full flex items-center justify-center mr-2">
            <SmilePlus className="h-4 w-4 text-white" />
          </div>
          <h3 className="font-semibold text-white">MüzikAI Asistanı</h3>
        </div>
        <div className="flex space-x-1">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onMinimize}
            className="h-7 w-7 text-white/80 hover:text-white hover:bg-white/10"
          >
            <Minimize2 className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onClose}
            className="h-7 w-7 text-white/80 hover:text-white hover:bg-white/10"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {/* Messages container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-[400px] min-h-[300px]">
        {messages.length === 0 ? (
          <div className="text-center py-8">
            <h4 className="font-medium text-lg mb-2">Müzik Asistanına Hoş Geldiniz</h4>
            <p className="text-light-300 text-sm mb-6">
              Müzik önerileri, sanatçı bilgileri veya müzik teorisi hakkında sorular sorabilirsiniz.
            </p>
            <div className="space-y-2">
              {getContextualRecommendations().map((message, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="text-sm px-3 py-1 h-auto"
                  onClick={() => handleRecommendedMessage(message)}
                >
                  {message}
                </Button>
              ))}
            </div>
          </div>
        ) : (
          <>
            <AnimatePresence>
              {messages.map((message, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className={cn(
                    "flex",
                    message.role === "user" ? "justify-end" : "justify-start"
                  )}
                >
                  <div
                    className={cn(
                      "max-w-[80%] rounded-lg px-4 py-3",
                      message.role === "user"
                        ? "bg-primary/90 text-white"
                        : "bg-dark-100 text-light-100"
                    )}
                  >
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            <div ref={messagesEndRef} />
          </>
        )}
        
        {isLoading && (
          <div className="flex justify-center items-center py-2">
            <Loader2 className="h-5 w-5 text-primary animate-spin" />
          </div>
        )}
      </div>
      
      {/* Input area */}
      <form onSubmit={handleSubmit} className="p-3 border-t border-dark-100">
        <div className="relative">
          <Input
            ref={inputRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Müzik hakkında bir şey sorun..."
            className="pr-10"
            disabled={isLoading}
          />
          <Button
            type="submit"
            size="icon"
            variant="ghost"
            className="absolute right-0 top-0 h-full text-light-300 hover:text-primary"
            disabled={isLoading || !inputValue.trim()}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </form>
    </div>
  );
}