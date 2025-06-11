import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useAiChat } from "@/hooks/use-ai-chat";
import { useQuery } from "@tanstack/react-query";
import { usePlayer } from "@/hooks/use-player";
import { AI_QUICK_PROMPTS } from "@/lib/constants";

interface RecommendedTracksProps {
  trackIds: string[];
}

function RecommendedTracks({ trackIds }: RecommendedTracksProps) {
  const { data: allTracks = [] } = useQuery({
    queryKey: ["/api/tracks"],
    staleTime: 5 * 60 * 1000,
  });
  
  const { play } = usePlayer();
  
  const tracksData = allTracks as any[];
  const tracks = trackIds.map(id => 
    tracksData.find((track: any) => track.id === id)
  ).filter(Boolean);

  if (tracks.length === 0) return null;

  return (
    <div className="mt-3 space-y-2">
      <p className="text-xs text-gray-300">Önerilen şarkılar:</p>
      {tracks.slice(0, 3).map((track: any) => (
        <div
          key={track.id}
          className="bg-gray-700 rounded-lg p-3 flex items-center space-x-3 cursor-pointer hover:bg-gray-600 transition-colors"
          onClick={() => play(track)}
        >
          <img
            src={track.imageUrl || "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=40&h=40"}
            alt={track.title}
            className="w-10 h-10 rounded-lg object-cover flex-shrink-0"
          />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">{track.title}</p>
            <p className="text-xs text-gray-400 truncate">{track.artist}</p>
          </div>
          <Button
            size="sm"
            className="w-6 h-6 bg-green-500 hover:bg-green-400 text-black rounded-full p-0"
            onClick={(e) => {
              e.stopPropagation();
              play(track);
            }}
          >
            <i className="fas fa-play text-xs" />
          </Button>
        </div>
      ))}
    </div>
  );
}

interface AiChatModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AiChatModal({ isOpen, onClose }: AiChatModalProps) {
  const [inputValue, setInputValue] = useState("");
  const { messages, isLoading, sendMessage } = useAiChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const message = inputValue.trim();
    setInputValue("");
    await sendMessage(message);
  };

  const handleQuickPrompt = (prompt: string) => {
    setInputValue(prompt);
  };

  const formatTimestamp = (timestamp: Date) => {
    return new Intl.DateTimeFormat("tr-TR", {
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(timestamp));
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl h-[600px] bg-gray-900 border-gray-700 text-white flex flex-col">
        <DialogHeader className="border-b border-gray-700 pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl flex items-center justify-center">
                <i className="fas fa-robot text-white" />
              </div>
              <div>
                <DialogTitle className="text-white">Marjinal AI</DialogTitle>
                <p className="text-xs text-gray-400">Müzik Asistanınızın yapay zeka destekli müzik uzmanı</p>
              </div>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-xs text-gray-400">Çevrimiçi</span>
            </div>
          </div>
        </DialogHeader>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto space-y-4 py-4 scrollbar-hide">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex space-x-3 ${message.type === "user" ? "justify-end" : ""}`}
            >
              {message.type === "ai" && (
                <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <i className="fas fa-robot text-white text-sm" />
                </div>
              )}

              <div
                className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
                  message.type === "user"
                    ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-tr-none"
                    : "bg-gray-800 text-white rounded-tl-none"
                }`}
              >
                <p className="text-sm">{message.content}</p>
                
                {message.recommendations && message.recommendations.length > 0 && (
                  <RecommendedTracks trackIds={message.recommendations} />
                )}
                
                <p className="text-xs text-gray-400 mt-2">
                  {formatTimestamp(message.timestamp)}
                </p>
              </div>

              {message.type === "user" && (
                <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <i className="fas fa-user text-white text-sm" />
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                <i className="fas fa-robot text-white text-sm" />
              </div>
              <div className="bg-gray-800 rounded-2xl rounded-tl-none p-3">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }} />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Chat Input */}
        <div className="border-t border-gray-700 pt-4 space-y-3">
          <form onSubmit={handleSubmit} className="flex space-x-3">
            <Input
              type="text"
              placeholder="AI'ya sorunuzu yazın..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              disabled={isLoading}
              className="flex-1 bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500/50"
            />
            <Button
              type="submit"
              disabled={!inputValue.trim() || isLoading}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-6 py-2 rounded-xl font-semibold transition-all duration-300"
            >
              <i className="fas fa-paper-plane" />
            </Button>
          </form>

          <div className="flex flex-wrap gap-2">
            {AI_QUICK_PROMPTS.map((prompt) => (
              <Button
                key={prompt}
                variant="ghost"
                size="sm"
                onClick={() => handleQuickPrompt(prompt)}
                className="text-xs bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white px-3 py-1 rounded-full transition-colors"
              >
                {prompt}
              </Button>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
