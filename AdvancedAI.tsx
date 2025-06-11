import React, { useState, useRef, useEffect } from 'react';
import { Send, Brain, Lightbulb, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { CHAT_SUGGESTIONS } from '@/lib/constants';
import { AiMessage, fetchChatHistory, sendChatMessage } from '@/lib/xata';
import { simulateThinking, ThoughtProcess } from '@/lib/advanced-ai';
import type { Song } from '@shared/schema';
import { SongCard } from '@/components/SongCard';
import { MusicPlayerContext } from '@/components/Layout';

interface AdvancedAIProps {
  className?: string;
}

export const AdvancedAI: React.FC<AdvancedAIProps> = ({ className }) => {
  const { playSong } = React.useContext(MusicPlayerContext);
  const [messages, setMessages] = useState<AiMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentThoughts, setCurrentThoughts] = useState<ThoughtProcess | null>(null);
  const [isThinking, setIsThinking] = useState(false);
  const [recommendations, setRecommendations] = useState<Song[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // İlk açılışta sohbet geçmişini yükle
  useEffect(() => {
    const loadChatHistory = async () => {
      try {
        setIsLoading(true);
        const history = await fetchChatHistory();
        setMessages(history);
        setIsLoading(false);
      } catch (error) {
        console.error('Sohbet geçmişi yüklenirken hata:', error);
        setIsLoading(false);
      }
    };
    
    loadChatHistory();
  }, []);
  
  // Mesajlar güncellendiğinde otomatik kaydırma
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);
  
  // Mesaj gönderme işlevi
  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;
    
    try {
      const userMessage: AiMessage = {
        id: messages.length + 1,
        userId: 1,
        role: 'user',
        content: newMessage,
        timestamp: new Date()
      };
      
      // Önce kullanıcı mesajını göster
      setMessages(prev => [...prev, userMessage]);
      setNewMessage('');
      setIsLoading(true);
      
      // "Düşünme" sürecini simüle et
      setIsThinking(true);
      // 1-2 saniye düşünme süresi
      await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));
      
      // Düşünce sürecini görselleştir
      const thoughts = simulateThinking(userMessage.content, messages);
      setCurrentThoughts(thoughts);
      
      // 1-2 saniye daha düşünme süresi
      await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));
      
      // API'den yanıt al
      const response = await sendChatMessage(newMessage);
      
      // Düşünme sürecini kapat
      setIsThinking(false);
      setCurrentThoughts(null);
      
      // Asistan mesajını göster
      setMessages(prev => [...prev, response.message]);
      
      // Eğer öneriler varsa, bunları göster
      if (response.recommendations && response.recommendations.length > 0) {
        setRecommendations(response.recommendations);
      }
      
      setIsLoading(false);
    } catch (error) {
      console.error('Mesaj gönderilirken hata:', error);
      setIsLoading(false);
      setIsThinking(false);
      setCurrentThoughts(null);
      
      // Hata mesajını göster
      setMessages(prev => [...prev, {
        id: messages.length + 2,
        userId: 1,
        role: 'assistant',
        content: 'Üzgünüm, bir sorun oluştu. Lütfen daha sonra tekrar deneyin.',
        timestamp: new Date()
      }]);
    }
  };
  
  // Enter tuşu ile mesaj gönderme
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isLoading) {
      handleSendMessage();
    }
  };
  
  // Öneri mesajını seç
  const handleSuggestionClick = (suggestion: string) => {
    setNewMessage(suggestion);
  };

  return (
    <Card className={cn("flex flex-col h-full overflow-hidden", className)}>
      <CardHeader className="px-4 py-3 border-b">
        <CardTitle className="text-lg flex items-center gap-2">
          <Brain className="w-5 h-5 text-primary" />
          Gelişmiş Yapay Zeka Asistanı
        </CardTitle>
      </CardHeader>
      
      <CardContent className="flex-1 p-0 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="p-4 space-y-4">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-center">
                <Brain className="w-12 h-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground mb-2">Merhaba! Bugün nasıl yardımcı olabilirim?</p>
                <p className="text-sm text-muted-foreground">Önerdiğim müzikler, ruh halinize veya sanatçı tercihlerinize göre kişiselleştirilmiş olacak.</p>
              </div>
            ) : (
              <>
                {messages.map((message, index) => (
                  <div 
                    key={index} 
                    className={cn(
                      "flex items-start gap-3 max-w-[90%]",
                      message.role === 'user' ? "ml-auto" : ""
                    )}
                  >
                    {message.role === 'assistant' && (
                      <Avatar className="w-8 h-8">
                        <AvatarFallback className="bg-primary text-primary-foreground text-xs">AI</AvatarFallback>
                      </Avatar>
                    )}
                    
                    <div 
                      className={cn(
                        "rounded-lg p-3",
                        message.role === 'user' 
                          ? "bg-primary text-primary-foreground" 
                          : "bg-muted"
                      )}
                    >
                      <p>{message.content}</p>
                    </div>
                    
                    {message.role === 'user' && (
                      <Avatar className="w-8 h-8">
                        <AvatarFallback className="bg-secondary text-secondary-foreground text-xs">SİZ</AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                ))}
                
                {isThinking && (
                  <div className="flex items-start gap-3">
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="bg-primary text-primary-foreground text-xs">AI</AvatarFallback>
                    </Avatar>
                    
                    <div className="bg-muted rounded-lg p-3 space-y-2 max-w-[80%]">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Düşünüyorum...</span>
                      </div>
                      
                      {currentThoughts && (
                        <Accordion type="single" collapsible className="w-full">
                          <AccordionItem value="thinking-process">
                            <AccordionTrigger className="text-xs text-muted-foreground hover:no-underline py-1">
                              <div className="flex items-center gap-1">
                                <Lightbulb className="w-3 h-3" />
                                <span>Düşünce süreci</span>
                              </div>
                            </AccordionTrigger>
                            <AccordionContent>
                              <div className="text-xs space-y-2">
                                <div>
                                  <p className="font-medium mb-1">Tespit edilen kavramlar:</p>
                                  <div className="flex flex-wrap gap-1">
                                    {currentThoughts.concepts.map((concept, idx) => (
                                      <Badge key={idx} variant="outline" className="text-[10px]">
                                        {concept.name} ({Math.round(concept.confidence * 100)}%)
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                                
                                <div>
                                  <p className="font-medium mb-1">Muhakeme:</p>
                                  <ul className="list-disc pl-4 space-y-1">
                                    {currentThoughts.reasoning.map((reason, idx) => (
                                      <li key={idx}>{reason}</li>
                                    ))}
                                  </ul>
                                </div>
                                
                                <p className="font-medium">{currentThoughts.conclusion}</p>
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        </Accordion>
                      )}
                    </div>
                  </div>
                )}
              </>
            )}
            
            {recommendations.length > 0 && (
              <div className="mt-4 space-y-2">
                <p className="text-sm font-medium">Önerilen Şarkılar:</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {recommendations.map((song) => (
                    <SongCard 
                      key={song.id} 
                      song={song} 
                      isCompact 
                      onClick={() => playSong(song)}
                    />
                  ))}
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
      </CardContent>
      
      <CardFooter className="p-3 border-t">
        {CHAT_SUGGESTIONS.length > 0 && (
          <>
            <div className="flex gap-2 mb-3 flex-wrap">
              {CHAT_SUGGESTIONS.map((suggestion, index) => (
                <Button 
                  key={index} 
                  variant="outline" 
                  size="sm" 
                  className="text-xs"
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  {suggestion}
                </Button>
              ))}
            </div>
            <Separator className="mb-3" />
          </>
        )}
        
        <div className="flex items-center gap-2 w-full">
          <Input
            placeholder="Mesajınızı yazın..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={handleKeyPress}
            disabled={isLoading}
            className="flex-1"
          />
          <Button 
            onClick={handleSendMessage} 
            disabled={isLoading || !newMessage.trim()}
            size="icon"
          >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default AdvancedAI;