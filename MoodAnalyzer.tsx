import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { useMusic } from '@/contexts/MusicContext';
import { SpeakerLoudIcon, SpeakerOffIcon } from '@radix-ui/react-icons';
import { AVAILABLE_MOODS } from '@/lib/constants';

interface MoodAnalyzerProps {
  className?: string;
  onMoodDetected?: (mood: string) => void;
}

export function MoodAnalyzer({ className, onMoodDetected }: MoodAnalyzerProps) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [detectedMood, setDetectedMood] = useState<string | null>(null);
  const [volume, setVolume] = useState(0);
  const [moodHistory, setMoodHistory] = useState<{mood: string, timestamp: Date}[]>([]);
  const { currentSong } = useMusic();

  // Ses seviyesi animasyonu için zamanlayıcı
  useEffect(() => {
    if (isListening) {
      const interval = setInterval(() => {
        setVolume(Math.random() * 0.5 + 0.1);
      }, 100);
      return () => clearInterval(interval);
    } else {
      setVolume(0);
    }
  }, [isListening]);

  // Konuşma tanıma işlemini başlat/durdur
  const toggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  // Konuşma tanımayı başlat
  const startListening = () => {
    try {
      // Simüle edilmiş konuşma tanıma (gerçek SpeechRecognition yerine)
      setIsListening(true);
      
      // Simülasyon: 3 saniye sonra bir metin oluştur
      setTimeout(() => {
        const sampleTexts = [
          "bugün çok mutluyum",
          "bugün biraz hüzünlüyüm",
          "çok enerjik hissediyorum",
          "biraz sakin müzik dinlemek istiyorum",
          "romantik bir akşam için müzik önerir misin",
          "biraz nostaljik hissediyorum"
        ];
        
        const randomText = sampleTexts[Math.floor(Math.random() * sampleTexts.length)];
        setTranscript(randomText);
        analyzeMood(randomText);
      }, 3000);
      // Not: Gerçek bir SpeechRecognition API kullanımı yerine simülasyon kullanıyoruz
    } catch (error) {
      console.error('Konuşma tanıma başlatılırken hata oluştu:', error);
      setIsListening(false);
    }
  };

  // Konuşma tanımayı durdur
  const stopListening = () => {
    setIsListening(false);
    setTranscript('');
    // Simülasyon temizlemesi
    const timeouts = window.setTimeout(() => {}, 0);
    for (let i = 0; i < timeouts; i++) {
      window.clearTimeout(i);
    }
  };

  // Metin içindeki duygu durumunu analiz et
  const analyzeMood = (text: string) => {
    // Basit bir duygu durumu analizi
    const moodMap: Record<string, string[]> = {
      'happy': ['mutlu', 'neşeli', 'harika', 'muhteşem', 'güzel', 'keyifli', 'eğlenceli'],
      'sad': ['üzgün', 'kederli', 'mutsuz', 'kötü', 'berbat', 'kırgın', 'yalnız'],
      'energetic': ['enerjik', 'heyecanlı', 'hareketli', 'coşkulu', 'dinamik'],
      'calm': ['sakin', 'huzurlu', 'rahat', 'dingin', 'sessiz', 'barışçıl'],
      'romantic': ['romantik', 'aşk', 'sevgi', 'tutku', 'duygusal'],
      'angry': ['kızgın', 'öfkeli', 'sinirli', 'gergin', 'kızmak', 'bıktım'],
      'nostalgic': ['nostaljik', 'özlem', 'geçmiş', 'eski', 'hatıra']
    };
    
    // Her duygu kategorisi için eşleşme sayısını hesapla
    const scores: Record<string, number> = {};
    
    Object.entries(moodMap).forEach(([mood, keywords]) => {
      scores[mood] = keywords.reduce((count, keyword) => {
        return count + (text.includes(keyword) ? 1 : 0);
      }, 0);
    });
    
    // En yüksek skora sahip duygu durumunu bul
    let topMood = '';
    let topScore = 0;
    
    Object.entries(scores).forEach(([mood, score]) => {
      if (score > topScore) {
        topMood = mood;
        topScore = score;
      }
    });
    
    // Eğer bir duygu tespit edildiyse
    if (topScore > 0) {
      setDetectedMood(topMood);
      
      // Duygu geçmişine ekle
      setMoodHistory(prev => [...prev, { mood: topMood, timestamp: new Date() }]);
      
      // Callback'i çağır
      if (onMoodDetected) {
        onMoodDetected(topMood);
      }
    }
  };

  // Şarkıya dayalı tahmin edilen duygu durum
  const predictedMoodFromSong = React.useMemo(() => {
    if (!currentSong) return null;
    
    // Şarkının adından duygu durumunu tahmin et (toptags mevcut değilse)
    const songTitle = currentSong.title || currentSong.name || '';
    const songArtist = typeof currentSong.artist === 'string' 
      ? currentSong.artist 
      : currentSong.artist?.name || '';
    
    // Şarkı adı veya sanatçı ismi içinden duygu durumu bul
    for (const mood of AVAILABLE_MOODS) {
      if (
        songTitle.toLowerCase().includes(mood) || 
        songArtist.toLowerCase().includes(mood)
      ) {
        return mood;
      }
    }
    
    // Varsayılan duygu durumu
    return 'happy';
  }, [currentSong]);

  return (
    <div className={cn("p-4 bg-card rounded-lg shadow-md", className)}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium">Duygu Durumu Analizi</h3>
        
        <button
          onClick={toggleListening}
          className={cn(
            "p-2 rounded-full transition-colors",
            isListening 
              ? "bg-destructive text-destructive-foreground hover:bg-destructive/90" 
              : "bg-muted text-primary hover:bg-muted/80"
          )}
        >
          {isListening ? <SpeakerLoudIcon className="w-5 h-5" /> : 
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
              <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"></path>
              <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
              <line x1="12" x2="12" y1="19" y2="22"></line>
            </svg>
          }
        </button>
      </div>
      
      {/* Ses seviyesi göstergesi */}
      {isListening && (
        <div className="mb-4 h-10 bg-muted rounded-lg overflow-hidden">
          <div 
            className="h-full bg-primary/70 transition-all duration-100"
            style={{ width: `${volume * 100}%` }}
          ></div>
        </div>
      )}
      
      {/* Tespit edilen duygu durumu */}
      {detectedMood && (
        <div className="mb-4">
          <p className="text-sm text-muted-foreground mb-1">Tespit Edilen Duygu:</p>
          <div className="flex space-x-2 items-center">
            <span className={cn(
              "px-3 py-1 rounded-full text-sm font-medium",
              detectedMood === 'happy' && "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100",
              detectedMood === 'sad' && "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100",
              detectedMood === 'energetic' && "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100",
              detectedMood === 'calm' && "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-100",
              detectedMood === 'romantic' && "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-100",
              detectedMood === 'angry' && "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100",
              detectedMood === 'nostalgic' && "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100",
            )}>
              {detectedMood.charAt(0).toUpperCase() + detectedMood.slice(1)}
            </span>
          </div>
        </div>
      )}
      
      {/* Şarkıdan tahmin edilen duygu */}
      {predictedMoodFromSong && (
        <div className="mb-4">
          <p className="text-sm text-muted-foreground mb-1">Şarkıdan Tahmin Edilen Duygu:</p>
          <div className="flex space-x-2 items-center">
            <span className={cn(
              "px-3 py-1 rounded-full text-sm font-medium",
              predictedMoodFromSong === 'happy' && "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100",
              predictedMoodFromSong === 'sad' && "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100", 
              predictedMoodFromSong === 'energetic' && "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100",
              predictedMoodFromSong === 'calm' && "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-100",
              predictedMoodFromSong === 'romantic' && "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-100",
              predictedMoodFromSong === 'angry' && "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100",
              predictedMoodFromSong === 'nostalgic' && "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100",
            )}>
              {predictedMoodFromSong.charAt(0).toUpperCase() + predictedMoodFromSong.slice(1)}
            </span>
          </div>
        </div>
      )}
      
      {/* Geçmiş duygular */}
      {moodHistory.length > 0 && (
        <div>
          <p className="text-sm text-muted-foreground mb-2">Duygu Geçmişi:</p>
          <div className="grid grid-cols-4 gap-2">
            {moodHistory.slice(-4).map((entry, index) => (
              <div key={index} className="text-center">
                <span className={cn(
                  "inline-block w-full px-2 py-1 rounded-full text-xs font-medium",
                  entry.mood === 'happy' && "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100",
                  entry.mood === 'sad' && "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100",
                  entry.mood === 'energetic' && "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100",
                  entry.mood === 'calm' && "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-100",
                  entry.mood === 'romantic' && "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-100",
                  entry.mood === 'angry' && "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100",
                  entry.mood === 'nostalgic' && "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100",
                )}>
                  {entry.mood.slice(0, 3)}
                </span>
                <p className="text-xs text-muted-foreground mt-1">{entry.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}