import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, Send, Loader2, MessageSquare, User, Bot, Brain, ThumbsUp, ThumbsDown, HelpCircle, Lightbulb } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { CHAT_SUGGESTIONS, DEFAULT_GREETING } from '@/lib/constants';
import { BrainState, analyzeMessage, generateResponse } from '@/lib/super-ai';
import { fetchChatHistory, sendChatMessage, AiMessage } from '@/lib/xata';
import { SongCard } from './SongCard';
import { MusicPlayerContext } from './Layout';
import { useToast } from '@/hooks/use-toast';
import type { Song } from '@shared/schema';

interface SuperAIAssistantProps {
  className?: string;
}

export const SuperAIAssistant: React.FC<SuperAIAssistantProps> = ({ className }) => {
  const { playSong } = React.useContext(MusicPlayerContext);
  const { toast } = useToast();
  const [messages, setMessages] = useState<AiMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>(CHAT_SUGGESTIONS);
  const [brainState, setBrainState] = useState<BrainState | null>(null);
  const [recommendations, setRecommendations] = useState<Song[]>([]);
  const [showBrainState, setShowBrainState] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Sohbet geçmişini yükle
  useEffect(() => {
    const loadHistory = async () => {
      try {
        const history = await fetchChatHistory();
        
        if (history.length === 0) {
          // İlk mesaj olarak bir selamlama ekle
          setMessages([{
            id: 0,
            userId: 1,
            role: 'assistant',
            content: DEFAULT_GREETING + "\n\nHoş geldiniz! Size kişiselleştirilmiş müzik önerileri sunabilirim. Ruh halinizi, sevdiğiniz sanatçıları veya müzik tarzlarınızı paylaşarak başlayabilirsiniz.",
            timestamp: new Date()
          }]);
        } else {
          setMessages(history);
        }
      } catch (error) {
        console.error('Sohbet geçmişi yüklenirken hata:', error);
        toast({
          title: 'Bağlantı Hatası',
          description: 'Sohbet geçmişi yüklenemedi. Lütfen daha sonra tekrar deneyin.',
          variant: 'destructive'
        });
      }
    };
    
    loadHistory();
  }, [toast]);
  
  // Mesajlar güncellendiğinde en aşağı kaydır
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);
  
  // Mesaj gönderme işlevi
  const sendMessage = async () => {
    if (!inputMessage.trim()) return;
    
    try {
      // Kullanıcı mesajını ekle
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
      
      // "Düşünme" sürecini simüle et
      // 1-2 saniye arasında rastgele bir süre bekle
      await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));
      
      // Beyin durumunu güncelle ve göster
      const newBrainState = analyzeMessage(userMessage.content, messages);
      setBrainState(newBrainState);
      setShowBrainState(true);
      
      // Biraz daha bekle
      await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));
      
      // Mesajı sunucuya gönder ve yanıt al
      const response = await sendChatMessage(inputMessage);
      
      // Yanıtı göster
      setMessages(prev => [...prev, response.message]);
      
      // Eğer öneriler varsa göster
      if (response.recommendations && response.recommendations.length > 0) {
        setRecommendations(response.recommendations);
      }
      
      // Beyin durumunu kapat
      setShowBrainState(false);
      setIsThinking(false);
      setIsTyping(false);
      
      // Takip soruları için yeni kişiselleştirilmiş öneriler oluştur
      // (şu an için sabit önerileri kullanıyoruz)
      setSuggestions(CHAT_SUGGESTIONS);
    } catch (error) {
      console.error('Mesaj gönderilirken hata:', error);
      toast({
        title: 'İletişim Hatası',
        description: 'Mesajınız gönderilemedi. Lütfen daha sonra tekrar deneyin.',
        variant: 'destructive'
      });
      
      setIsTyping(false);
      setIsThinking(false);
      setShowBrainState(false);
    }
  };
  
  // Enter tuşu ile gönderme
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !isTyping) {
      sendMessage();
    }
  };
  
  // Önerilen soruları kullan
  const useSuggestion = (suggestion: string) => {
    setInputMessage(suggestion);
  };
  
  // Beyin durumu görselleştirici
  const renderBrainState = () => {
    if (!brainState) return null;
    
    return (
      <div className="p-4 border rounded-lg bg-background/80 shadow-sm space-y-4 text-sm">
        <div className="flex items-center gap-2 text-primary">
          <Brain className="h-5 w-5" />
          <h3 className="font-semibold">Düşünme Süreci</h3>
        </div>
        
        <Accordion type="single" collapsible className="w-full">
          {/* Aktif Konular */}
          <AccordionItem value="topics">
            <AccordionTrigger className="text-sm">
              Tespit Edilen Konular
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2">
                {brainState.activeTopics.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {brainState.activeTopics.map((topic, index) => (
                      <Badge key={index} variant="outline" className="flex items-center gap-1">
                        {topic.name}
                        <span className="text-xs text-muted-foreground">
                          ({Math.round(topic.relevance * 100)}%)
                        </span>
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-sm">Belirgin bir konu tespit edilemedi.</p>
                )}
              </div>
            </AccordionContent>
          </AccordionItem>
          
          {/* Müzikal Tercihler */}
          <AccordionItem value="preferences">
            <AccordionTrigger className="text-sm">
              Müzikal Tercihler
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2">
                {brainState.userPreferences.length > 0 ? (
                  <div className="space-y-2">
                    {brainState.userPreferences.map((pref, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div>
                          {pref.artist && <span>Sanatçı: {pref.artist}</span>}
                          {pref.genre && <span>Tür: {pref.genre}</span>}
                          {pref.mood && <span>Ruh Hali: {pref.mood}</span>}
                          {pref.era && <span>Dönem: {pref.era}</span>}
                        </div>
                        <div className="flex items-center gap-1">
                          <Badge variant={pref.source === 'explicit' ? 'default' : 'secondary'} className="text-xs">
                            {pref.source === 'explicit' ? 'Belirtilmiş' : 'Çıkarım'}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {Math.round(pref.confidence * 100)}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-sm">Henüz bir müzikal tercih tespit edilemedi.</p>
                )}
              </div>
            </AccordionContent>
          </AccordionItem>
          
          {/* Duygu Analizi */}
          {brainState.currentFeeling && (
            <AccordionItem value="feeling">
              <AccordionTrigger className="text-sm">
                Duygu Analizi
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-medium">Temel Duygu:</span> {brainState.currentFeeling.primary}
                    </div>
                    <Badge className="text-xs">
                      {Math.round(brainState.currentFeeling.confidence * 100)}%
                    </Badge>
                  </div>
                  
                  {brainState.currentFeeling.secondary && (
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-medium">İkincil Duygu:</span> {brainState.currentFeeling.secondary}
                      </div>
                    </div>
                  )}
                  
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span>Düşük Yoğunluk</span>
                      <span>Yüksek Yoğunluk</span>
                    </div>
                    <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
                      <div 
                        className="bg-primary h-full rounded-full" 
                        style={{ width: `${brainState.currentFeeling.intensity * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          )}
        </Accordion>
      </div>
    );
  };
  
  // Mesaj bileşeni
  const MessageItem = ({ message }: { message: AiMessage }) => {
    const isUser = message.role === 'user';
    
    return (
      <div className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : ''}`}>
        <Avatar className="w-10 h-10 mt-1">
          {isUser ? (
            <AvatarFallback className="bg-primary text-primary-foreground">U</AvatarFallback>
          ) : (
            <AvatarFallback className="bg-secondary">AI</AvatarFallback>
          )}
        </Avatar>
        
        <div 
          className={`
            max-w-[80%] rounded-lg p-4 
            ${isUser 
              ? 'bg-primary text-primary-foreground' 
              : 'bg-card border shadow-sm'
            }
          `}
        >
          <div className="text-sm whitespace-pre-wrap">{message.content}</div>
        </div>
      </div>
    );
  };

  return (
    <Card className={`flex flex-col h-full overflow-hidden shadow-lg ${className}`}>
      <CardHeader className="px-4 py-3 border-b">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              Akıllı Müzik Asistanı
            </CardTitle>
            <CardDescription>
              Kişiselleştirilmiş müzik önerileri ve derin anlayış
            </CardDescription>
          </div>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="h-8 w-8" 
                  onClick={() => setShowBrainState(!showBrainState)}
                >
                  <Brain className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Yapay zeka düşünce sürecini göster/gizle</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 p-0 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="p-4 space-y-6">
            {/* Mesajları göster */}
            {messages.map((message, index) => (
              <MessageItem key={index} message={message} />
            ))}
            
            {/* Yazıyor göstergesi */}
            {isTyping && (
              <div className="flex items-start gap-3">
                <Avatar className="w-10 h-10 mt-1">
                  <AvatarFallback className="bg-secondary">AI</AvatarFallback>
                </Avatar>
                
                <div className="max-w-[80%] rounded-lg p-4 bg-card border shadow-sm">
                  {isThinking ? (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Düşünüyor ve yanıt hazırlıyor...</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 animate-pulse">
                      <div className="w-2 h-2 rounded-full bg-primary"></div>
                      <div className="w-2 h-2 rounded-full bg-primary animation-delay-200"></div>
                      <div className="w-2 h-2 rounded-full bg-primary animation-delay-500"></div>
                    </div>
                  )}
                </div>
              </div>
            )}
            
            {/* Düşünme süreci (isteğe bağlı görünüm) */}
            {isThinking && showBrainState && brainState && (
              <div className="ml-12">
                {renderBrainState()}
              </div>
            )}
            
            {/* Şarkı önerileri */}
            {recommendations.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-sm font-medium flex items-center gap-2">
                  <ThumbsUp className="h-4 w-4 text-primary" />
                  Önerilen Şarkılar
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {recommendations.map(song => (
                    <SongCard 
                      key={song.id} 
                      song={song} 
                      onClick={() => playSong(song)} 
                      isCompact
                    />
                  ))}
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
      </CardContent>
      
      <CardFooter className="p-4 border-t flex flex-col gap-4">
        {/* Sohbet önerileri */}
        <div className="flex flex-wrap gap-2">
          {suggestions.map((suggestion, index) => (
            <Badge 
              key={index} 
              variant="secondary" 
              className="px-3 py-1 cursor-pointer hover:bg-secondary/80 transition-colors"
              onClick={() => useSuggestion(suggestion)}
            >
              {suggestion}
            </Badge>
          ))}
        </div>
        
        {/* Mesaj girişi */}
        <div className="flex items-center gap-2 w-full">
          <Input
            className="flex-1"
            placeholder="Müzik önerisi için bir şeyler yazın..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={handleKeyPress}
            disabled={isTyping}
          />
          <Button 
            className="px-4" 
            onClick={sendMessage}
            disabled={isTyping || !inputMessage.trim()}
          >
            {isTyping ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Send className="h-5 w-5" />
            )}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default SuperAIAssistant;