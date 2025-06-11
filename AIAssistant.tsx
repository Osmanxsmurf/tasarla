import React, { useState, useEffect, useRef } from 'react';
import { Zap, Send } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { fetchChatHistory, sendChatMessage, type AiMessage } from '@/lib/xata';
import { CHAT_SUGGESTIONS, DEFAULT_GREETING } from '@/lib/constants';
import { MusicPlayerContext } from './Layout';
import { SongCard } from './SongCard';
import type { Song } from '@shared/schema';

interface AIAssistantProps {
  className?: string;
}

export const AIAssistant: React.FC<AIAssistantProps> = ({ className }) => {
  const [messages, setMessages] = useState<AiMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<Song[]>([]);
  const endOfMessagesRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const { playSong } = React.useContext(MusicPlayerContext);
  
  // Fetch chat history on component mount
  useEffect(() => {
    const loadChatHistory = async () => {
      try {
        const history = await fetchChatHistory();
        
        if (history.length === 0) {
          // If no history, add a greeting message and suggestion
          setMessages([{
            id: 0,
            userId: 1,
            role: 'assistant',
            content: DEFAULT_GREETING + '\n\nRuh halinizi veya dinlemek istediğiniz sanatçıyı yazabilirsiniz. Örneğin "Dua Lipa şarkıları öner" ya da "Bugün mutluyum, bana uygun müzik öner" diyebilirsiniz.',
            timestamp: new Date()
          }]);
        } else {
          setMessages(history);
        }
      } catch (error) {
        console.error('Failed to load chat history:', error);
        toast({
          title: 'Hata',
          description: 'Sohbet geçmişi yüklenirken bir hata oluştu.',
          variant: 'destructive',
        });
        
        // Add a fallback greeting message with suggestions
        setMessages([{
          id: 0,
          userId: 1,
          role: 'assistant',
          content: DEFAULT_GREETING + '\n\nYapay zeka asistanı şu anda bağlantı sorunu yaşıyor olabilir, ama sanatçı araması ve ruh haline göre müzik önerileri çalışmaya devam edecektir. "Dua Lipa" gibi bir sanatçı adı yazarak şarkılarını bulabilirsiniz.',
          timestamp: new Date()
        }]);
      }
    };
    
    loadChatHistory();
  }, [toast]);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    if (endOfMessagesRef.current) {
      endOfMessagesRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);
  
  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMessage = input;
    setInput('');
    
    // Optimistically update UI
    setMessages(prev => [
      ...prev, 
      {
        id: Date.now(),
        userId: 1,
        role: 'user',
        content: userMessage,
        timestamp: new Date()
      }
    ]);
    
    setIsLoading(true);
    
    try {
      const response = await sendChatMessage(userMessage);
      
      setMessages(prev => [...prev, response.message]);
      
      if (response.recommendations && response.recommendations.length > 0) {
        setRecommendations(response.recommendations);
      }
    } catch (error) {
      console.error('Failed to send message:', error);
      toast({
        title: 'Mesaj gönderilemedi',
        description: 'Mesajınız gönderilemedi. Lütfen tekrar deneyin.',
        variant: 'destructive',
      });
      
      // Add error message
      setMessages(prev => [
        ...prev, 
        {
          id: Date.now() + 1,
          userId: 1,
          role: 'assistant',
          content: 'Üzgünüm, şu anda mesajınıza yanıt veremiyorum. Lütfen daha sonra tekrar deneyin.',
          timestamp: new Date()
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };
  
  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion);
  };
  
  return (
    <Card className={`bg-surface animate-fade-in ${className || ''}`}>
      <CardContent className="p-5">
        {/* Messages */}
        <div className="space-y-4 mb-4">
          {messages.map((message, index) => (
            <div key={message.id || index} className="flex items-start gap-4">
              {message.role === 'assistant' ? (
                <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                  <Zap className="h-6 w-6 text-white" />
                </div>
              ) : (
                <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              )}
              
              <div>
                <h3 className="font-semibold text-lg mb-1">
                  {message.role === 'assistant' ? 'Müzik Asistanın' : 'Siz'}
                </h3>
                <p className="text-foreground whitespace-pre-wrap">{message.content}</p>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1">Müzik Asistanın</h3>
                <p className="text-muted-foreground">Yanıt yazıyor...</p>
              </div>
            </div>
          )}
          <div ref={endOfMessagesRef} />
        </div>
        
        {/* Song recommendations */}
        {recommendations.length > 0 && (
          <div className="mb-4">
            <h3 className="font-semibold text-lg mb-3">Öneriler:</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {recommendations.map((song) => (
                <SongCard 
                  key={song.id} 
                  song={song} 
                  onClick={() => playSong(song)} 
                  className="w-full"
                />
              ))}
            </div>
          </div>
        )}
        
        {/* Input */}
        <div className="flex items-center gap-2 mt-4">
          <Input
            type="text"
            placeholder="Ruh halinizi yazın veya bir şarkıcı önerin..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-secondary"
            disabled={isLoading}
          />
          <Button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="p-3 rounded-lg bg-primary text-white"
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
        
        {/* Suggestions */}
        <div className="flex flex-wrap gap-2 mt-4">
          {CHAT_SUGGESTIONS.map((suggestion, index) => (
            <Badge
              key={index}
              variant="secondary"
              className="px-3 py-1 cursor-pointer hover:bg-opacity-80"
              onClick={() => handleSuggestionClick(suggestion)}
            >
              {suggestion}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
