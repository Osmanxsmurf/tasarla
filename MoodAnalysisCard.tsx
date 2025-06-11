import React from 'react';
import { useAI } from '@/context/AIContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Brain, RefreshCw } from 'lucide-react';

export function MoodAnalysisCard() {
  const { currentMood, analyzeMood } = useAI();

  const handleMoodAnalysis = async () => {
    // Demo mood analysis
    await analyzeMood('mutlu');
  };

  const moodColors: { [key: string]: string } = {
    mutlu: 'from-yellow-500 to-orange-500',
    üzgün: 'from-blue-500 to-purple-500',
    sakin: 'from-green-500 to-teal-500',
    enerjik: 'from-red-500 to-pink-500',
    romantik: 'from-pink-500 to-rose-500',
    nostaljik: 'from-indigo-500 to-purple-500',
    heyecanlı: 'from-orange-500 to-red-500',
    default: 'from-purple-500 to-pink-500',
  };

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-white">
          <span className="flex items-center">
            <Brain className="text-purple-400 mr-2" />
            Ruh Hali Analizi
          </span>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
            <span className="text-xs text-gray-400">HuggingFace AI</span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {currentMood ? (
          <div className="space-y-4">
            <div className="text-center">
              <div 
                className={`w-20 h-20 bg-gradient-to-br ${moodColors[currentMood.mood] || moodColors.default} rounded-full mx-auto mb-3 flex items-center justify-center`}
              >
                <span className="text-3xl">{currentMood.emoji}</span>
              </div>
              <p className="font-semibold text-lg text-white capitalize">
                {currentMood.mood}
              </p>
              <p className="text-sm text-gray-400">
                %{Math.round(currentMood.confidence * 100)} güven oranı
              </p>
              <p className="text-sm text-gray-300 mt-2">
                {currentMood.description}
              </p>
            </div>

            {/* Mood-based recommendations */}
            <div className="space-y-2">
              <h4 className="font-medium text-sm text-gray-300">Önerilen Türler:</h4>
              <div className="flex flex-wrap gap-2">
                {currentMood.recommendedGenres.map((genre, index) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className="bg-purple-500/20 text-purple-400 border-purple-500 text-xs"
                  >
                    {genre}
                  </Badge>
                ))}
              </div>
            </div>

            <Button
              onClick={handleMoodAnalysis}
              variant="outline"
              size="sm"
              className="w-full border-gray-600 text-gray-400 hover:text-white"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Yeniden Analiz Et
            </Button>
          </div>
        ) : (
          <div className="text-center space-y-4">
            <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full mx-auto flex items-center justify-center">
              <Brain className="w-8 h-8 text-white" />
            </div>
            <div>
              <p className="font-semibold text-lg text-white mb-2">Ruh Hali Belirsiz</p>
              <p className="text-sm text-gray-400 mb-4">
                AI asistanına ruh halinizi söyleyin ve kişiselleştirilmiş müzik önerileri alın
              </p>
              <Button
                onClick={handleMoodAnalysis}
                variant="outline"
                size="sm"
                className="border-purple-500 text-purple-400 hover:bg-purple-500 hover:text-white"
              >
                <Brain className="w-4 h-4 mr-2" />
                Analiz Başlat
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
