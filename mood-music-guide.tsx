import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { MoveRight, Music, HeartPulse, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

const moodExamples = [
  {
    mood: "Mutlu",
    examples: ["Bugün çok mutluyum", "Neşeli hissediyorum", "Harika bir gün"],
    icon: <Sparkles className="h-5 w-5 text-amber-400" />
  },
  {
    mood: "Hüzünlü",
    examples: ["Üzgünüm bugün", "Kendimi kötü hissediyorum", "Moralim bozuk"],
    icon: <HeartPulse className="h-5 w-5 text-purple-400" />
  },
  {
    mood: "Enerjik",
    examples: ["Enerjik müzik öner", "Hareketli bir şeyler dinlemek istiyorum"],
    icon: <Music className="h-5 w-5 text-emerald-400" />
  },
  {
    mood: "Romantik",
    examples: ["Romantik hissediyorum", "Aşk şarkıları önerir misin?"],
    icon: <HeartPulse className="h-5 w-5 text-red-400" />
  }
];

export function MoodMusicGuide() {
  return (
    <Card className="bg-dark-200/60 border-dark-100">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <HeartPulse className="h-5 w-5 text-primary" />
          <span>Duygusal Müzik Rehberi</span>
        </CardTitle>
      </CardHeader>

      <CardContent>
        <p className="text-sm text-gray-400 mb-4">
          Yapay zeka ile duygu durumunuza göre müzik önerileri alabilirsiniz. 
          İşte bazı örnekler:
        </p>

        <div className="space-y-3">
          {moodExamples.map((mood, index) => (
            <motion.div
              key={mood.mood}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-dark-300/40 rounded-lg p-3"
            >
              <div className="flex items-center gap-2 mb-2">
                {mood.icon}
                <h3 className="font-medium">{mood.mood}</h3>
              </div>
              <div className="space-y-2">
                {mood.examples.map((example, i) => (
                  <div 
                    key={i}
                    className="text-sm bg-dark-200/40 px-3 py-2 rounded-md cursor-pointer hover:bg-dark-100/40 transition-colors"
                    onClick={() => {
                      // Artificially trigger an AI chat with this message
                      const aiChatEvent = new CustomEvent("ai-chat-message", {
                        detail: { message: example }
                      });
                      window.dispatchEvent(aiChatEvent);
                      
                      // Navigate to AI chat
                      window.location.href = "/ai-chat";
                    }}
                  >
                    "{example}"
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-6 text-center">
          <Link href="/ai-chat">
            <Button variant="outline" className="gap-2">
              <span>Yapay Zeka ile Konuş</span>
              <MoveRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}