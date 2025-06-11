import React, { useState, useEffect, useRef } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { SongCard } from './SongCard';
import { MusicPlayerContext } from './Layout';
import { fetchChatHistory, sendChatMessage } from '@/lib/xata';
import { CHAT_SUGGESTIONS } from '@/lib/constants';
import { AiMessage } from '@shared/schema';
import { useToast } from '@/hooks/use-toast';
import { Sparkles, Send, Loader2, MessageSquare, User, Bot, Brain, ThumbsUp, ThumbsDown, Lightbulb, Music, BarChart, Wand2, Zap, MoveHorizontal, Flame, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface AIAssistantProps {
  className?: string;
  minimized?: boolean;
  onMaximize?: () => void;
}

export const AIAssistant: React.FC<AIAssistantProps> = ({ 
  className,
  minimized = false,
  onMaximize
}) => {
  // AI response tones/personalities
  const aiPersonas = [
    { name: "Müzikal", icon: <Music className="h-4 w-4" />, description: "Derin müzikal bilgi" },
    { name: "Yaratıcı", icon: <Lightbulb className="h-4 w-4" />, description: "İlham verici keşifler" },
    { name: "Analitik", icon: <BarChart className="h-4 w-4" />, description: "Trend analizleri" },
  ];
  const { playSong } = React.useContext(MusicPlayerContext);
  const { toast } = useToast();
  const [messages, setMessages] = useState<AiMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>(CHAT_SUGGESTIONS);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  
  // Load chat history
  useEffect(() => {
    if (minimized) return;
    
    const loadHistory = async () => {
      try {
        const history = await fetchChatHistory();
        if (history.length > 0) {
          setMessages(history);
        } else {
          // Add a default greeting if no history
          setMessages([{
            id: 0,
            userId: 1,
            role: 'assistant',
            content: 'Merhaba! Ben senin kişisel müzik asistanınım. Size nasıl yardımcı olabilirim?\n\nHoş geldiniz! Size kişiselleştirilmiş müzik önerileri sunabilirim. Ruh halinizi, sevdiğiniz sanatçıları veya müzik tarzlarınızı paylaşarak başlayabilirsiniz.',
            timestamp: new Date()
          }]);
        }
      } catch (error) {
        console.error('Error loading chat history:', error);
        toast({
          title: 'Bağlantı Hatası',
          description: 'Sohbet geçmişi yüklenemedi. Lütfen daha sonra tekrar deneyin.',
          variant: 'destructive'
        });
      }
    };
    
    loadHistory();
  }, [toast, minimized]);
  
  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);
  
  // Handle message submission
  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;
    
    try {
      // Add user message to UI
      const userMessage: AiMessage = {
        id: Date.now(),
        userId: 1,
        role: 'user',
        content: inputMessage,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, userMessage]);
      setInputMessage('');
      setIsTyping(true);
      setIsThinking(true);
      
      // Simulate thinking process
      setTimeout(() => {
        setIsThinking(false);
      }, 2000);
      
      // Send to backend
      const response = await sendChatMessage(inputMessage);
      
      // Add AI response
      setMessages(prev => [...prev, response.message]);
      
      // Show recommendations if any
      if (response.recommendations && response.recommendations.length > 0) {
        setRecommendations(response.recommendations);
      }
      
      // Update suggestions based on conversation context
      setSuggestions(CHAT_SUGGESTIONS);
      
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: 'İletişim Hatası',
        description: 'Mesajınız gönderilemedi. Lütfen daha sonra tekrar deneyin.',
        variant: 'destructive'
      });
    } finally {
      setIsTyping(false);
    }
  };
  
  // Handle Enter key press
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !isTyping) {
      handleSendMessage();
    }
  };
  
  // Use a suggestion as input
  const handleUseSuggestion = (suggestion: string) => {
    setInputMessage(suggestion);
  };
  
  // Render a message
  const MessageItem = ({ message }: { message: AiMessage }) => {
    const isUser = message.role === 'user';
    
    return (
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : ''}`}
      >
        <Avatar className="w-10 h-10 mt-1">
          {isUser ? (
            <>
              <AvatarImage src="/avatar-user.png" alt="User" />
              <AvatarFallback className="bg-secondary text-secondary-foreground">
                <User size={18} />
              </AvatarFallback>
            </>
          ) : (
            <>
              <AvatarImage src="/avatar-assistant.png" alt="AI" />
              <AvatarFallback className="bg-primary text-primary-foreground">
                <Bot size={18} />
              </AvatarFallback>
            </>
          )}
        </Avatar>
        
        <div className={`
          max-w-[80%] rounded-lg p-4 
          ${isUser 
            ? 'bg-primary text-primary-foreground' 
            : 'bg-card border border-border/30 shadow-sm relative before:absolute before:top-0 before:left-0 before:w-full before:h-1 before:bg-gradient-to-r before:from-indigo-500 before:to-purple-500 before:opacity-60 before:rounded-t-lg'
          }
        `}>
          <div className={`text-sm whitespace-pre-wrap ${!isUser ? 'pt-2' : ''}`}>{message.content}</div>
          
          {!isUser && recommendations.length > 0 && message.id === messages[messages.length - 1].id && (
            <div className="mt-4 pt-4 border-t">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="h-4 w-4 text-primary" />
                <h4 className="text-sm font-medium">Sizin İçin Şarkılar</h4>
              </div>
              <div className="space-y-3">
                {recommendations.slice(0, 3).map((song) => (
                  <motion.div 
                    key={song.id}
                    className="flex items-center gap-3 p-2.5 bg-muted/40 hover:bg-muted rounded-xl cursor-pointer border border-border/30 transition-colors"
                    onClick={() => playSong(song)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 ring-1 ring-border/30">
                      <img 
                        src={song.coverImage || 'https://placehold.co/100/gray/white?text=No+Image'} 
                        alt={`${song.title} by ${song.artist}`} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm truncate">{song.title}</h4>
                      <p className="text-xs text-muted-foreground truncate">{song.artist}</p>
                    </div>
                    <Button size="icon" variant="secondary" className="h-8 w-8 rounded-full">
                      <Send className="h-4 w-4" />
                    </Button>
                  </motion.div>
                ))}
              </div>
              <div className="mt-3 flex justify-end">
                <div className="flex gap-2 items-center text-xs text-muted-foreground">
                  <ThumbsUp className="h-3.5 w-3.5" />
                  <span>Bu öneriler yardımcı oldu mu?</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    );
  };
  
  // Enhanced thinking animation component
  const ThinkingIndicator = () => (
    <div className="flex items-start gap-3">
      <div className="relative">
        <div className="absolute -inset-1 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full blur opacity-70"></div>
        <Avatar className="w-10 h-10 mt-1 relative border-0">
          <AvatarFallback className="bg-gradient-to-r from-indigo-500 to-purple-600 text-primary-foreground">
            <Bot size={18} />
          </AvatarFallback>
        </Avatar>
      </div>
      
      <div className="bg-card border border-border/30 relative rounded-lg p-4 max-w-[80%] shadow-md before:absolute before:top-0 before:left-0 before:w-full before:h-1 before:bg-gradient-to-r before:from-indigo-500 before:to-purple-500 before:opacity-60 before:rounded-t-lg">
        <div className="flex items-center gap-2">
          <span className="text-sm bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent font-medium">Düşünüyorum</span>
          <span className="flex gap-1">
            <motion.span 
              className="w-1.5 h-1.5 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full" 
              animate={{ 
                scale: [0.8, 1.2, 0.8],
                opacity: [0.7, 1, 0.7]
              }}
              transition={{ 
                duration: 1.5, 
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            <motion.span 
              className="w-1.5 h-1.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full" 
              animate={{ 
                scale: [0.8, 1.2, 0.8],
                opacity: [0.7, 1, 0.7]
              }}
              transition={{ 
                duration: 1.5, 
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.2
              }}
            />
            <motion.span 
              className="w-1.5 h-1.5 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full" 
              animate={{ 
                scale: [0.8, 1.2, 0.8],
                opacity: [0.7, 1, 0.7]
              }}
              transition={{ 
                duration: 1.5, 
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.4
              }}
            />
          </span>
        </div>
        
        <div className="mt-3 text-xs text-foreground px-3 pt-3 pb-4 bg-muted/20 rounded-md border border-border/30 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full blur opacity-70 scale-75"></div>
              <Brain className="h-4 w-4 relative text-primary" />
            </div>
            <span className="font-medium text-sm bg-gradient-to-r from-purple-400 to-indigo-500 bg-clip-text text-transparent">AI İşlemi</span>
          </div>
          
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-[10px] mb-1">
                <span>İstek Analizi</span>
                <span className="text-primary font-medium">75%</span>
              </div>
              <div className="w-full bg-muted-foreground/10 h-1.5 rounded-full overflow-hidden p-[1px]">
                <motion.div 
                  className="bg-gradient-to-r from-indigo-500 to-purple-600 h-full rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: '75%' }}
                  transition={{ duration: 1.5 }}
                >
                  <motion.div 
                    className="absolute top-0 right-0 h-full w-2 bg-white/50 blur-[1px]"
                    animate={{ x: ["-100%", "100%"] }}
                    transition={{ duration: 1.5, repeat: Infinity, repeatType: "loop" }}
                  />
                </motion.div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between text-[10px] mb-1">
                <span>Müzik Veritabanı Tarama</span>
                <span className="text-primary font-medium">60%</span>
              </div>
              <div className="w-full bg-muted-foreground/10 h-1.5 rounded-full overflow-hidden p-[1px]">
                <motion.div 
                  className="bg-gradient-to-r from-purple-500 to-pink-600 h-full rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: '60%' }}
                  transition={{ duration: 1.8, delay: 0.2 }}
                >
                  <motion.div 
                    className="absolute top-0 right-0 h-full w-2 bg-white/50 blur-[1px]"
                    animate={{ x: ["-100%", "100%"] }}
                    transition={{ duration: 1.5, repeat: Infinity, repeatType: "loop", delay: 0.2 }}
                  />
                </motion.div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between text-[10px] mb-1">
                <span>Öneri Oluşturma</span>
                <span className="text-primary font-medium">30%</span>
              </div>
              <div className="w-full bg-muted-foreground/10 h-1.5 rounded-full overflow-hidden p-[1px]">
                <motion.div 
                  className="bg-gradient-to-r from-pink-500 to-rose-500 h-full rounded-full relative"
                  initial={{ width: 0 }}
                  animate={{ width: '30%' }}
                  transition={{ duration: 2, delay: 0.4 }}
                >
                  <motion.div 
                    className="absolute top-0 right-0 h-full w-2 bg-white/50 blur-[1px]"
                    animate={{ x: ["-100%", "100%"] }}
                    transition={{ duration: 1.5, repeat: Infinity, repeatType: "loop", delay: 0.4 }}
                  />
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
  
  // For minimized mode, show a floating button with animation
  if (minimized) {
    return (
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={className}
      >
        <Button 
          size="lg"
          onClick={onMaximize}
          className="relative overflow-hidden bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:shadow-[0_0_15px_rgba(168,85,247,0.5)] transition-shadow duration-300"
        >
          <span className="absolute inset-0 flex items-center justify-center">
            <motion.div
              animate={{ 
                rotate: [0, 10, -10, 10, 0],
              }}
              transition={{ 
                duration: 2, 
                repeat: Infinity,
                repeatType: "reverse",
              }}
              className="text-white/90"
            >
              <Sparkles className="h-5 w-5" />
            </motion.div>
          </span>
          <span className="ml-6">AI Asistan</span>
        </Button>
      </motion.div>
    );
  }
  
  return (
    <Card className={`flex flex-col h-full overflow-hidden shadow-lg border-background/80 ${className}`}>
      <CardHeader className="px-4 py-3 bg-gradient-to-r from-background to-background/90 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-500 opacity-75 blur-sm rounded-full animate-pulse"></div>
              <div className="relative bg-background p-2 rounded-full">
                <motion.div
                  animate={{ 
                    rotate: [0, 10, -10, 10, 0],
                  }}
                  transition={{ 
                    duration: 5, 
                    repeat: Infinity,
                    repeatType: "reverse",
                  }}
                >
                  <Sparkles className="w-5 h-5 text-primary" />
                </motion.div>
              </div>
            </div>
            <div>
              <CardTitle className="text-xl flex items-center gap-2 bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
                Akıllı Müzik Asistanı
              </CardTitle>
              <CardDescription>
                Kişiselleştirilmiş müzik önerileri ve derin anlayış
              </CardDescription>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
        <div className="space-y-6">
          {messages.map((message) => (
            <MessageItem key={message.id} message={message} />
          ))}
          
          {isThinking && <ThinkingIndicator />}
          
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>
      
      <CardFooter className="p-4 border-t bg-gradient-to-b from-background to-background/80">
        <div className="w-full space-y-4">
          {/* AI Personas Selector */}
          <div className="flex items-center justify-center gap-1">
            <AnimatePresence>
              {aiPersonas.map((persona, idx) => (
                <motion.div
                  key={persona.name}
                  className="relative"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <div 
                    className="text-xs px-3 py-1.5 border border-border/50 rounded-full flex items-center gap-1.5 bg-muted/30 cursor-pointer hover:border-primary/50 transition-colors relative group"
                    title={persona.description}
                  >
                    <div className="w-4 h-4 flex items-center justify-center">
                      {persona.icon}
                    </div>
                    <span>{persona.name}</span>
                    
                    {/* Tooltip */}
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 bg-popover border border-border rounded-md px-2 py-1 text-xs min-w-32 text-center pointer-events-none z-50">
                      {persona.description}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
          
          {/* Input Area with Visual Effects */}
          <div className="flex items-center gap-2 relative">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg opacity-30 blur-sm group-hover:opacity-100 transition duration-1000"></div>
            <div className="relative w-full flex items-center gap-2 bg-background rounded-lg p-1">
              <Input
                placeholder="Mesajınızı yazın..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={isTyping}
                className="flex-1 bg-transparent border-muted/50 focus-visible:ring-primary/50 transition-all duration-300"
              />
              <Button 
                onClick={handleSendMessage}
                disabled={isTyping || !inputMessage.trim()}
                size="icon"
                className="rounded-full bg-gradient-to-r from-purple-600 to-pink-600 hover:shadow-[0_0_15px_rgba(168,85,247,0.5)] transition-all duration-300"
              >
                {isTyping ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
          
          {/* Interactive Suggestions */}
          <div className="overflow-x-auto pb-2 -mx-2 px-2">
            <div className="flex gap-2">
              {suggestions.slice(0, 3).map((suggestion, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + index * 0.1 }}
                  whileHover={{ y: -2, transition: { duration: 0.2 } }}
                  whileTap={{ scale: 0.97 }}
                >
                  <Button
                    variant="outline"
                    size="sm"
                    className="whitespace-nowrap text-xs border-muted-foreground/20 bg-muted/30 hover:bg-accent/30 hover:border-accent hover:text-accent-foreground transition-all duration-300"
                    onClick={() => handleUseSuggestion(suggestion)}
                  >
                    <Zap className="h-3 w-3 mr-1 text-primary" />
                    {suggestion}
                  </Button>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};
