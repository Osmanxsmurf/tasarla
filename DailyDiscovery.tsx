import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import { Music, Calendar, ThumbsUp, ThumbsDown, Sparkles, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { SongCard } from '@/components/SongCard';
import { MusicPlayerContext } from '@/components/Layout';
import type { Song } from '@shared/schema';
import { fetchAllSongs, addToLibrary } from '@/lib/xata';
import { useToast } from '@/hooks/use-toast';

const DAILY_CHALLENGE_KEY = 'daily_music_challenge';
const CHALLENGE_HISTORY_KEY = 'music_challenge_history';

interface DailyChallenge {
  date: string;
  songId: number;
  completed: boolean;
  liked: boolean | null;
  genre: string;
}

interface ChallengeStats {
  completed: number;
  liked: number;
  streak: number;
}

export function DailyDiscovery() {
  const { playSong } = React.useContext(MusicPlayerContext);
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [todaysSong, setTodaysSong] = useState<Song | null>(null);
  const [challenge, setChallenge] = useState<DailyChallenge | null>(null);
  const [stats, setStats] = useState<ChallengeStats>({
    completed: 0,
    liked: 0,
    streak: 0
  });
  const [showRefreshConfirm, setShowRefreshConfirm] = useState(false);

  // Kullanıcı tercihlerine göre filtre etme (geçmiş beğenilere göre)
  function getUserPreferences(): string[] {
    const history = localStorage.getItem(CHALLENGE_HISTORY_KEY);
    
    if (!history) return [];
    
    try {
      const challenges: DailyChallenge[] = JSON.parse(history);
      // En çok beğenilen türler
      const genreCounts: Record<string, number> = {};
      
      challenges.forEach(c => {
        if (c.liked && c.genre) {
          genreCounts[c.genre] = (genreCounts[c.genre] || 0) + 1;
        }
      });
      
      // En çok beğenilen 3 türü döndür
      return Object.entries(genreCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([genre]) => genre);
      
    } catch (e) {
      console.error('Geçmiş okuma hatası:', e);
      return [];
    }
  }

  // Bugünün zorluğunu yükle veya oluştur
  useEffect(() => {
    const loadTodaysChallenge = async () => {
      setLoading(true);
      try {
        const today = format(new Date(), 'yyyy-MM-dd');
        const savedChallenge = localStorage.getItem(DAILY_CHALLENGE_KEY);
        let todaysChallenge: DailyChallenge | null = null;
        
        if (savedChallenge) {
          const parsed = JSON.parse(savedChallenge);
          if (parsed.date === today) {
            todaysChallenge = parsed;
          }
        }
        
        if (!todaysChallenge) {
          // Yeni günlük zorluk oluştur
          const allSongs = await fetchAllSongs();
          
          // Kullanıcı tercihlerine göre filtrele
          const preferences = getUserPreferences();
          let filteredSongs = allSongs;
          
          if (preferences.length > 0) {
            // Kullanıcının beğendiği türlerden şarkılar daha yüksek olasılıkla seçilir
            const preferredSongs = allSongs.filter(song => 
              song.genre && preferences.includes(song.genre.toLowerCase())
            );
            
            // %70 tercih edilen türden, %30 rastgele
            if (preferredSongs.length > 0 && Math.random() < 0.7) {
              filteredSongs = preferredSongs;
            }
          }
          
          // Rastgele şarkı seç
          const randomIndex = Math.floor(Math.random() * filteredSongs.length);
          const selectedSong = filteredSongs[randomIndex];
          
          todaysChallenge = {
            date: today,
            songId: selectedSong.id,
            completed: false,
            liked: null,
            genre: selectedSong.genre || 'bilinmiyor'
          };
          
          // Kaydet
          localStorage.setItem(DAILY_CHALLENGE_KEY, JSON.stringify(todaysChallenge));
          setTodaysSong(selectedSong);
        } else {
          // Mevcut zorluğun şarkısını bul
          const songs = await fetchAllSongs();
          const song = songs.find(s => s.id === todaysChallenge?.songId);
          if (song) {
            setTodaysSong(song);
          }
        }
        
        setChallenge(todaysChallenge);
        loadStats();
        setLoading(false);
      } catch (error) {
        console.error('Günlük zorluk yüklenirken hata:', error);
        setLoading(false);
        toast({
          title: 'Hata',
          description: 'Günlük keşif zorluğu yüklenirken bir sorun oluştu.',
          variant: 'destructive'
        });
      }
    };
    
    loadTodaysChallenge();
  }, [toast]);
  
  // İstatistikleri yükle
  function loadStats() {
    try {
      const history = localStorage.getItem(CHALLENGE_HISTORY_KEY);
      
      if (!history) {
        setStats({ completed: 0, liked: 0, streak: 0 });
        return;
      }
      
      const challenges: DailyChallenge[] = JSON.parse(history);
      const completed = challenges.filter(c => c.completed).length;
      const liked = challenges.filter(c => c.liked === true).length;
      
      // Son günlerdeki streak'i hesapla
      let streak = 0;
      const sortedChallenges = [...challenges].sort((a, b) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      );
      
      let currentDate = new Date();
      
      for (const challenge of sortedChallenges) {
        const challengeDate = new Date(challenge.date);
        const diffDays = Math.floor(
          (currentDate.getTime() - challengeDate.getTime()) / (1000 * 60 * 60 * 24)
        );
        
        if (diffDays <= 1 && challenge.completed) {
          streak++;
          currentDate = challengeDate;
        } else {
          break;
        }
      }
      
      setStats({ completed, liked, streak });
      
    } catch (e) {
      console.error('İstatistik yükleme hatası:', e);
      setStats({ completed: 0, liked: 0, streak: 0 });
    }
  }
  
  // Beğeni/beğenmeme işleme
  const handleReaction = async (liked: boolean) => {
    if (!challenge || !todaysSong) return;
    
    try {
      // Zorluğu tamamlandı olarak işaretle
      const updatedChallenge: DailyChallenge = {
        ...challenge,
        completed: true,
        liked
      };
      
      localStorage.setItem(DAILY_CHALLENGE_KEY, JSON.stringify(updatedChallenge));
      setChallenge(updatedChallenge);
      
      // Geçmişe ekle
      const history = localStorage.getItem(CHALLENGE_HISTORY_KEY);
      let challenges: DailyChallenge[] = [];
      
      if (history) {
        challenges = JSON.parse(history);
        // Bugünün kaydı zaten varsa güncelle
        const todayIndex = challenges.findIndex(c => c.date === updatedChallenge.date);
        if (todayIndex >= 0) {
          challenges[todayIndex] = updatedChallenge;
        } else {
          challenges.push(updatedChallenge);
        }
      } else {
        challenges = [updatedChallenge];
      }
      
      localStorage.setItem(CHALLENGE_HISTORY_KEY, JSON.stringify(challenges));
      
      // İstatistikleri güncelle
      loadStats();
      
      // Beğenildiyse kütüphaneye ekle
      if (liked) {
        await addToLibrary(todaysSong.id);
        toast({
          title: 'Kütüphaneye Eklendi',
          description: 'Bu şarkı kütüphanenize eklendi.',
          variant: 'default',
        });
      }
      
      toast({
        title: 'Zorluk Tamamlandı',
        description: liked ? 'Harika! Bu şarkıyı beğendiniz.' : 'Anlaşıldı, bu tarz şarkıları göstermemeye çalışacağız.',
        variant: 'default',
      });
      
    } catch (error) {
      console.error('Reaksiyon kaydedilirken hata:', error);
      toast({
        title: 'Hata',
        description: 'Tepkiniz kaydedilirken bir sorun oluştu.',
        variant: 'destructive'
      });
    }
  };
  
  // Zorluğu yenile (sadece test için, normal kullanımda günde bir)
  const handleRefresh = async () => {
    if (showRefreshConfirm) {
      setLoading(true);
      localStorage.removeItem(DAILY_CHALLENGE_KEY);
      setChallenge(null);
      setTodaysSong(null);
      setShowRefreshConfirm(false);
      
      // Etki tetikleyicisinin tekrar çalışması için state'i güncelle
      const loadTodaysChallenge = async () => {
        try {
          const today = format(new Date(), 'yyyy-MM-dd');
          const allSongs = await fetchAllSongs();
          const randomIndex = Math.floor(Math.random() * allSongs.length);
          const selectedSong = allSongs[randomIndex];
          
          const todaysChallenge = {
            date: today,
            songId: selectedSong.id,
            completed: false,
            liked: null,
            genre: selectedSong.genre || 'bilinmiyor'
          };
          
          localStorage.setItem(DAILY_CHALLENGE_KEY, JSON.stringify(todaysChallenge));
          setTodaysSong(selectedSong);
          setChallenge(todaysChallenge);
          setLoading(false);
        } catch (error) {
          console.error('Zorluk yüklenirken hata:', error);
          setLoading(false);
        }
      };
      
      loadTodaysChallenge();
    } else {
      setShowRefreshConfirm(true);
    }
  };

  return (
    <Card className="w-full max-w-xl mx-auto">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-2xl font-bold flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-primary" />
            Günlük Müzik Keşfi
          </CardTitle>
          <Badge variant="outline" className="text-xs flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {format(new Date(), 'd MMMM', { locale: tr })}
          </Badge>
        </div>
        <CardDescription>
          Her gün yeni bir şarkı keşfedin ve müzik dünyanızı genişletin
        </CardDescription>
      </CardHeader>
      
      <Separator />
      
      <CardContent className="py-4 space-y-4">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-8">
            <Music className="w-12 h-12 text-muted-foreground animate-pulse" />
            <p className="mt-2 text-sm text-muted-foreground">Günlük şarkı yükleniyor...</p>
          </div>
        ) : (
          <>
            {todaysSong && (
              <div className="space-y-4">
                <div className="text-center mb-2">
                  <h3 className="text-lg font-medium">Bugünün Şarkısı</h3>
                  <p className="text-sm text-muted-foreground">
                    {challenge?.completed ? 'Tamamlandı' : 'Dinleyin ve tepkinizi verin'}
                  </p>
                </div>
                
                <SongCard 
                  song={todaysSong} 
                  onClick={() => playSong(todaysSong)}
                  className="mx-auto"
                />
                
                {!challenge?.completed && (
                  <div className="flex justify-center gap-2 mt-4">
                    <Button
                      variant="outline"
                      className="flex items-center gap-2"
                      onClick={() => handleReaction(false)}
                    >
                      <ThumbsDown className="w-4 h-4" />
                      Beğenmedim
                    </Button>
                    <Button
                      className="flex items-center gap-2"
                      onClick={() => handleReaction(true)}
                    >
                      <ThumbsUp className="w-4 h-4" />
                      Beğendim
                    </Button>
                  </div>
                )}
                
                {challenge?.completed && (
                  <div className="flex justify-center mt-4">
                    <Badge variant={challenge.liked ? "default" : "secondary"}>
                      {challenge.liked ? (
                        <span className="flex items-center gap-1">
                          <ThumbsUp className="w-3 h-3" /> Beğenildi
                        </span>
                      ) : (
                        <span className="flex items-center gap-1">
                          <ThumbsDown className="w-3 h-3" /> Beğenilmedi
                        </span>
                      )}
                    </Badge>
                  </div>
                )}
              </div>
            )}
            
            <div className="bg-muted/30 rounded-lg p-4 mt-4">
              <h3 className="text-sm font-medium mb-3">Keşif İstatistikleri</h3>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold">{stats.completed}</p>
                  <p className="text-xs text-muted-foreground">Tamamlanan</p>
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.liked}</p>
                  <p className="text-xs text-muted-foreground">Beğenilen</p>
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.streak}</p>
                  <p className="text-xs text-muted-foreground">Seri</p>
                </div>
              </div>
              
              {stats.completed > 0 && (
                <div className="mt-3">
                  <div className="flex justify-between text-xs mb-1">
                    <span>Beğeni Oranı</span>
                    <span>{Math.round((stats.liked / stats.completed) * 100)}%</span>
                  </div>
                  <Progress value={(stats.liked / stats.completed) * 100} className="h-2" />
                </div>
              )}
            </div>
          </>
        )}
      </CardContent>
      
      <CardFooter className="flex justify-between pt-0">
        <p className="text-xs text-muted-foreground">
          Her 24 saatte bir yeni şarkı
        </p>
        <Button
          variant="ghost"
          size="sm"
          className="text-xs flex items-center gap-1"
          onClick={handleRefresh}
        >
          <RefreshCw className="w-3 h-3" />
          {showRefreshConfirm ? 'Emin misiniz?' : 'Değiştir'}
        </Button>
      </CardFooter>
    </Card>
  );
}