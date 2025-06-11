// Types for OpenAI Chat API
export interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

export interface ChatConversation {
  id?: number;
  messages: ChatMessage[];
  userId?: number;
  createdAt?: Date;
}

// Helper function to create websocket connection for chat
export function createChatWebSocket() {
  const wsProtocol = window.location.protocol === "https:" ? "wss:" : "ws:";
  const wsUrl = `${wsProtocol}//${window.location.host}`;
  
  const socket = new WebSocket(wsUrl);
  
  socket.onopen = () => {
    console.log("WebSocket connection established");
  };
  
  socket.onerror = (error) => {
    console.error("WebSocket error:", error);
  };
  
  return socket;
}

// Function to get recommended messages for chat
export function getRecommendedMessages() {
  return [
    "Tarkan'a benzer şarkılar öner",
    "Başlangıç için hangi jazz albümlerini dinlemeliyim?",
    "Rock müziğin tarihi hakkında bilgi ver",
    "En etkili Türk rap sanatçıları kimlerdir?",
    "Elektronik müziği özel kılan nedir?",
    "Ders çalışırken dinlenebilecek rahatlatıcı müzikler öner",
    "Klasik Türk müziğinin özellikleri nelerdir?",
    "Türk pop müziğinin gelişimi hakkında bilgi ver",
    "Duygusal hissettiğimde dinleyebileceğim şarkılar önerir misin?",
    "Makam nedir ve Türk müziğindeki önemi nedir?"
  ];
}

// Function to get AI persona system message
export function getAIPersonaSystemMessage(): ChatMessage {
  return {
    role: "system",
    content: "Sen MüzikAI'sın, Türk ve dünya müziği konusunda uzmanlaşmış bir müzik asistanısın. Şarkılar, sanatçılar, albümler önerebilir ve müzik hakkında bilgi verebilirsin. Yanıtların kısa ve öz olmalı, müzik bilgisine odaklanmalısın. Türkçe müzik kültürüne hakimsin ve kullanıcılarla sohbet ederken samimi bir dil kullanırsın. Özellikle Türk sanat müziği, halk müziği, pop, rock, arabesk, rap gibi türler hakkında bilgi sahibisin. Makamlar, usuller ve Türk müzik tarihi konusunda da bilgilisin. Kullanıcının duygu durumuna göre müzik önerebilirsin."
  };
}

// Function to format AI recommendations from message
export function formatAIRecommendations(message: string) {
  // This is a simple parser that extracts song recommendations from AI responses
  // For a real implementation, the AI would return structured data
  
  // Look for numbered or bulleted lists of recommendations
  const recommendations: {title: string, artist: string}[] = [];
  
  // Try to match patterns like "1. Song Name by Artist" or "- Song Name by Artist"
  const lines = message.split('\n');
  const songPattern = /(?:^|\n)(?:\d+\.|\*|\-)\s+["']?([^"'\n]+)["']?\s+(?:by|from)\s+([^,\n]+)/gi;
  
  let match;
  const processedText = message.replace(/\n/g, ' ');
  
  while ((match = songPattern.exec(processedText)) !== null) {
    if (match[1] && match[2]) {
      recommendations.push({
        title: match[1].trim(),
        artist: match[2].trim()
      });
    }
  }
  
  // If no structured recommendations found, return empty array
  return recommendations;
}
