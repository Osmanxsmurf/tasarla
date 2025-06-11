import React, { useState, useRef, useEffect } from 'react';
import { useAI } from '@/context/AIContext';
import { useSpotifyAuth } from '@/context/SpotifyAuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  Bot, 
  User, 
  Send, 
  Mic, 
  Music, 
  Heart, 
  TrendingUp, 
  Sparkles,
  Brain,
  Headphones,
  Play,
  Volume2
} from 'lucide-react';

export function AIChatPanel() {
  const { messages, isTyping, currentMood, sendMessage } = useAI();
  const { isAuthenticated } = useSpotifyAuth();
  const [inputMessage, setInputMessage] = useState('');
  const [isListening, setIsListening] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const userId = 1;

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;
    
    const message = inputMessage.trim();
    setInputMessage('');
    await sendMessage(message, userId);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const aiSuggestions = [
    "Bu akşam için sakin müzikler öner",
    "Türkçe pop şarkıları çal",
    "Mutlu hissediyorum, enerjik şarkılar istiyorum",
    "90'lar nostaljisi için şarkı öner",
    "Çalışırken dinleyebileceğim instrumental müzikler",
    "Sezen Aksu tarzında şarkılar bul"
  ];

  const handleQuickPrompt = (prompt: string) => {
    setInputMessage(prompt);
  };

  const handleVoiceInput = () => {
    setIsListening(!isListening);
    // Voice recognition would be implemented here
  };

  return (
    <div className="w-96 bg-black/30 backdrop-blur-2xl border-l border-white/10 flex flex-col">
      {/* Enhanced Header */}
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 rounded-2xl flex items-center justify-center shadow-xl">
              <Sparkles className="text-white w-6 h-6 animate-pulse" />
            </div>
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full animate-pulse border-2 border-black/30"></div>
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-white">Marjinal AI</h3>
            <p className="text-sm text-white/60">Türkiye'nin En Akıllı Müzik Asistanı</p>
          </div>
        </div>
        
        {/* Enhanced Mood Display */}
        {currentMood && (
          <Card className="mt-4 bg-white/5 backdrop-blur-md border-white/10">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                  <span className="text-xl">{currentMood.emoji}</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-white capitalize">{currentMood.mood}</p>
                  <p className="text-xs text-white/60">{Math.round(currentMood.confidence * 100)}% güven • {currentMood.description}</p>
                </div>
              </div>
              <div className="mt-3 flex flex-wrap gap-1">
                {currentMood.recommendedGenres.slice(0, 3).map((genre, index) => (
                  <Badge key={index} className="bg-purple-500/20 text-purple-300 border-purple-500/30 text-xs">
                    {genre}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Enhanced Chat Messages */}
      <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
        <div className="space-y-4">
          {messages.length === 0 && (
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <Avatar className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500">
                  <AvatarFallback>
                    <Brain className="w-5 h-5 text-white" />
                  </AvatarFallback>
                </Avatar>
                <div className="bg-white/10 backdrop-blur-md rounded-2xl rounded-tl-sm p-4 max-w-[280px] border border-white/10">
                  <p className="text-sm text-white leading-relaxed">
                    🎵 Merhaba! Ben <span className="font-bold text-purple-300">Marjinal AI</span>. 
                    Türkçe müzik dünyasında size rehberlik edecek gelişmiş yapay zeka asistanınızım.
                  </p>
                  <div className="mt-3 p-2 bg-white/5 rounded-xl">
                    <p className="text-xs text-white/80">
                      ✨ Ruh halinizi anlıyorum<br/>
                      🎯 Kişisel öneriler sunuyorum<br/>
                      🎶 10.000+ Türkçe şarkı bilgim var
                    </p>
                  </div>
                </div>
              </div>
              
              {/* AI Suggestions */}
              <div className="space-y-2">
                <p className="text-xs text-white/60 px-2">💡 Bunları deneyebilirsiniz:</p>
                {aiSuggestions.slice(0, 3).map((suggestion, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuickPrompt(suggestion)}
                    className="w-full text-left justify-start bg-white/5 border-white/10 text-white/80 hover:bg-white/10 hover:text-white rounded-xl text-xs p-3 h-auto"
                  >
                    {suggestion}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex items-start space-x-3 ${
                message.isAI ? '' : 'justify-end'
              }`}
            >
              {message.isAI && (
                <Avatar className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500">
                  <AvatarFallback>
                    <Brain className="w-4 h-4 text-white" />
                  </AvatarFallback>
                </Avatar>
              )}
              
              <div
                className={`rounded-2xl p-4 max-w-[280px] ${
                  message.isAI
                    ? 'bg-white/10 backdrop-blur-md border border-white/10 rounded-tl-sm'
                    : 'bg-gradient-to-r from-purple-500 to-pink-500 rounded-tr-sm shadow-lg'
                }`}
              >
                <p className="text-sm text-white leading-relaxed">{message.message}</p>
                
                {message.intent && (
                  <div className="mt-3 flex items-center space-x-2">
                    <Badge className="bg-white/20 text-white/80 border-white/20 text-xs">
                      🎯 {message.intent}
                    </Badge>
                    <Badge className="bg-white/20 text-white/80 border-white/20 text-xs">
                      {message.confidence}
                    </Badge>
                  </div>
                )}
              </div>

              {!message.isAI && (
                <Avatar className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500">
                  <AvatarFallback>
                    <User className="w-4 h-4 text-white" />
                  </AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}

          {/* Enhanced Typing Indicator */}
          {isTyping && (
            <div className="flex items-start space-x-3">
              <Avatar className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500">
                <AvatarFallback>
                  <Brain className="w-4 h-4 text-white animate-pulse" />
                </AvatarFallback>
              </Avatar>
              <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl rounded-tl-sm p-4">
                <div className="flex items-center space-x-2">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                  <span className="text-xs text-white/60 ml-2">Marjinal düşünüyor...</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Enhanced Input Area */}
      <div className="p-4 border-t border-white/10 space-y-4">
        {/* Quick Action Buttons */}
        <div className="grid grid-cols-2 gap-2">
          <Button
            size="sm"
            onClick={() => handleQuickPrompt("Bu an için müzik öner")}
            className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-xl text-xs"
          >
            <Music className="w-3 h-3 mr-1" />
            Şimdi Çal
          </Button>
          <Button
            size="sm"
            onClick={() => handleQuickPrompt("Ruh halime göre öner")}
            className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white rounded-xl text-xs"
          >
            <Heart className="w-3 h-3 mr-1" />
            Ruh Hali
          </Button>
        </div>

        {/* Enhanced Input */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-2xl blur opacity-50"></div>
          <div className="relative flex items-center bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-2">
            <Input
              type="text"
              placeholder="Marjinal'a müzik isteğinizi yazın..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1 bg-transparent border-none text-white placeholder-white/50 focus:outline-none focus:ring-0"
            />
            <Button
              variant="ghost"
              size="sm"
              onClick={handleVoiceInput}
              className={`mr-2 ${
                isListening 
                  ? 'text-red-400 bg-red-500/20' 
                  : 'text-white/60 hover:text-white'
              } rounded-xl`}
            >
              <Mic className="w-4 h-4" />
            </Button>
            <Button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isTyping}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-xl px-4 py-2"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* AI Capabilities */}
        <div className="flex items-center justify-center space-x-4 text-xs text-white/50">
          <div className="flex items-center space-x-1">
            <Sparkles className="w-3 h-3" />
            <span>AI Destekli</span>
          </div>
          <div className="flex items-center space-x-1">
            <Headphones className="w-3 h-3" />
            <span>Sesli Komut</span>
          </div>
          <div className="flex items-center space-x-1">
            <Volume2 className="w-3 h-3" />
            <span>Akıllı Öneri</span>
          </div>
        </div>
      </div>
    </div>
  );
}
