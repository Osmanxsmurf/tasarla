import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { useMusic } from '@/contexts/MusicContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface LyricsAnalyzerProps {
  className?: string;
}

export function LyricsAnalyzer({ className }: LyricsAnalyzerProps) {
  const { currentSong } = useMusic();
  const [lyrics, setLyrics] = useState<string | null>(null);
  const [translation, setTranslation] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [wordFrequency, setWordFrequency] = useState<{word: string, count: number}[]>([]);
  const [sentiment, setSentiment] = useState<{
    positive: number;
    negative: number;
    neutral: number;
    overall: string;
  }>({ positive: 0, negative: 0, neutral: 0, overall: 'neutral' });

  // Şarkı değiştiğinde şarkı sözlerini al
  useEffect(() => {
    if (!currentSong) {
      setLyrics(null);
      return;
    }

    const fetchLyrics = async () => {
      setLoading(true);
      
      try {
        // Gerçek bir API çağrısı yerine simüle edilmiş veri
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Simüle edilmiş şarkı sözleri
        const simulatedLyrics = getSimulatedLyrics(currentSong.title || currentSong.name || '', currentSong.artist || '');
        setLyrics(simulatedLyrics);
        
        // Şarkı sözü analizi yap
        analyzeLyrics(simulatedLyrics);
        
        // Çeviri oluştur (simüle edilmiş)
        simulateTranslation(simulatedLyrics);
      } catch (error) {
        console.error('Şarkı sözleri getirilirken hata:', error);
        setLyrics('Şarkı sözleri bulunamadı.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchLyrics();
  }, [currentSong]);
  
  // Şarkı sözlerini analiz et
  const analyzeLyrics = (text: string) => {
    if (!text) return;
    
    // Kelime sıklığı analizi
    const words = text.toLowerCase()
      .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, '')
      .split(/\s+/)
      .filter(word => word.length > 3);
      
    const wordCount: Record<string, number> = {};
    
    words.forEach(word => {
      if (wordCount[word]) {
        wordCount[word]++;
      } else {
        wordCount[word] = 1;
      }
    });
    
    // En sık kullanılan kelimeleri al
    const sortedWords = Object.entries(wordCount)
      .map(([word, count]) => ({ word, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);
      
    setWordFrequency(sortedWords);
    
    // Basit bir duygu analizi (gerçek bir NLP kütüphanesi yerine)
    const positiveWords = ['love', 'happy', 'joy', 'smile', 'beautiful', 'perfect', 'amazing', 'aşk', 'mutlu', 'güzel', 'harika', 'muhteşem'];
    const negativeWords = ['hate', 'sad', 'pain', 'hurt', 'cry', 'fear', 'angry', 'acı', 'üzgün', 'ağla', 'korku', 'kızgın', 'nefret'];
    
    let positiveScore = 0;
    let negativeScore = 0;
    let neutralScore = 0;
    
    words.forEach(word => {
      if (positiveWords.includes(word)) {
        positiveScore++;
      } else if (negativeWords.includes(word)) {
        negativeScore++;
      } else {
        neutralScore++;
      }
    });
    
    const total = positiveScore + negativeScore + neutralScore;
    
    let overall = 'neutral';
    if (positiveScore > negativeScore && positiveScore / total > 0.2) {
      overall = 'positive';
    } else if (negativeScore > positiveScore && negativeScore / total > 0.2) {
      overall = 'negative';
    }
    
    setSentiment({
      positive: Math.round((positiveScore / total) * 100) || 0,
      negative: Math.round((negativeScore / total) * 100) || 0,
      neutral: Math.round((neutralScore / total) * 100) || 0,
      overall
    });
  };
  
  // Simüle edilmiş çeviri oluştur
  const simulateTranslation = async (text: string) => {
    if (!text) {
      setTranslation(null);
      return;
    }
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Orijinal metnin biraz değiştirilmiş versiyonu
    const translatedLines = text.split('\n').map(line => {
      if (line.trim().length === 0) return '';
      
      // Rastgele değiştirilmiş metin
      return line.length > 5 
        ? `${line.substring(0, Math.floor(line.length / 2))}... (Türkçe çeviri)` 
        : line;
    });
    
    setTranslation(translatedLines.join('\n'));
  };
  
  // Simüle edilmiş şarkı sözleri oluştur
  const getSimulatedLyrics = (title: string, artist: string): string => {
    // Bazı örnek şarkı sözleri
    const lyrics = [
      "Verse 1:\nBu gece uyku tutmaz yine\nDüşünceler dönüp duruyor kafamda\nSenin hayalin, senin sesin\nHepsi bir anı oldu artık\n\nChorus:\nBen seni unutmak için sevmedim\nAşkı yaşamak için sevdim\nKaderimdi, yazgımdı belki de\nAma pişman değilim, yine olsa yine severdim\n\nVerse 2:\nYağmur yağıyor camlarıma\nDamlaları izlerken seni düşünüyorum\nBelki sen de bir yerlerde\nBeni hatırlıyorsundur, kim bilir?",
      
      "Verse 1:\nThe lights go out and I can't be saved\nTides that I tried to swim against\nYou've put me down upon my knees\nOh I beg, I beg and plead, singing\n\nChorus:\nCome out of the things unsaid\nShoot an apple off my head\nAnd a trouble that can't be named\nA tiger's waiting to be tamed, singing",
      
      "Verse 1:\nBazen gökyüzüne bakıp\nYıldızlarda seni arıyorum\nGecenin karanlığında\nBir umut ışığı bekliyorum\n\nChorus:\nSen gittin, ben kaldım burada\nAnılarla baş başa\nHer nefeste seni yaşıyorum\nHer şarkıda seni duyuyorum"
    ];
    
    // Rastgele bir şarkı sözü seç
    return lyrics[Math.floor(Math.random() * lyrics.length)];
  };
  
  // Şarkı yoksa boş içerik göster
  if (!currentSong) {
    return (
      <Card className={cn("", className)}>
        <CardHeader>
          <CardTitle>Şarkı Sözleri</CardTitle>
        </CardHeader>
        <CardContent className="text-center text-muted-foreground py-10">
          Şarkı sözlerini görüntülemek için bir şarkı çalın.
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className={cn("", className)}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Şarkı Sözleri</span>
          <span className="text-sm font-normal text-muted-foreground">
            {currentSong.title || currentSong.name} - {currentSong.artist}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="lyrics" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-4">
            <TabsTrigger value="lyrics">Şarkı Sözleri</TabsTrigger>
            <TabsTrigger value="translation">Çeviri</TabsTrigger>
            <TabsTrigger value="analysis">Analiz</TabsTrigger>
          </TabsList>
          
          {/* Şarkı Sözleri */}
          <TabsContent value="lyrics" className="min-h-[300px]">
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
              </div>
            ) : lyrics ? (
              <div className="whitespace-pre-line">{lyrics}</div>
            ) : (
              <div className="text-center text-muted-foreground">
                Bu şarkı için söz bulunamadı.
              </div>
            )}
          </TabsContent>
          
          {/* Çeviri */}
          <TabsContent value="translation" className="min-h-[300px]">
            {loading || !lyrics ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
              </div>
            ) : translation ? (
              <div className="whitespace-pre-line">{translation}</div>
            ) : (
              <div className="text-center text-muted-foreground">
                Bu şarkı için çeviri bulunamadı.
              </div>
            )}
          </TabsContent>
          
          {/* Analiz */}
          <TabsContent value="analysis" className="min-h-[300px]">
            {loading || !lyrics ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
              </div>
            ) : (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-2">Duygu Analizi</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span>Pozitif</span>
                      <span>{sentiment.positive}%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2.5">
                      <div 
                        className="bg-green-500 h-2.5 rounded-full" 
                        style={{ width: `${sentiment.positive}%` }}
                      ></div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span>Negatif</span>
                      <span>{sentiment.negative}%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2.5">
                      <div 
                        className="bg-red-500 h-2.5 rounded-full" 
                        style={{ width: `${sentiment.negative}%` }}
                      ></div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span>Nötr</span>
                      <span>{sentiment.neutral}%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2.5">
                      <div 
                        className="bg-blue-500 h-2.5 rounded-full" 
                        style={{ width: `${sentiment.neutral}%` }}
                      ></div>
                    </div>
                    
                    <div className="mt-2 text-center">
                      <span className={cn(
                        "px-3 py-1 rounded-full text-sm font-medium",
                        sentiment.overall === 'positive' && "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100",
                        sentiment.overall === 'negative' && "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100",
                        sentiment.overall === 'neutral' && "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100",
                      )}>
                        {sentiment.overall === 'positive' && 'Olumlu Duygular'}
                        {sentiment.overall === 'negative' && 'Olumsuz Duygular'}
                        {sentiment.overall === 'neutral' && 'Nötr Duygular'}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-2">En Çok Kullanılan Kelimeler</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {wordFrequency.map((item, index) => (
                      <div 
                        key={index}
                        className="bg-muted/50 p-2 rounded-md flex items-center justify-between"
                      >
                        <span>{item.word}</span>
                        <span className="text-sm text-muted-foreground">{item.count}x</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}