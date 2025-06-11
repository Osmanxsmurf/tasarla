import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { SongCard } from './SongCard';
import { MusicPlayerContext } from './Layout';
import { MoodSelector } from './MoodSelector';
import { MOODS } from '@/lib/constants';
import { getTopTracksByTag, getSimilarTracks } from '@/lib/lastfm-api';
import { searchYouTube } from '@/lib/youtube-api';
import { fetchAllSongs, fetchSongsByMood } from '@/lib/xata';
import { useToast } from '@/hooks/use-toast';
import { Sparkles, Music, Zap, RefreshCw, ThumbsUp, Heart, History, Users, User, Search } from 'lucide-react';
import type { Song } from '@shared/schema';

interface RecommendationEngineProps {
  className?: string;
  initialMood?: string;
  recentlyPlayedSongs?: Song[];
  likedSongs?: Song[];
}

export function RecommendationEngine({ 
  className, 
  initialMood,
  recentlyPlayedSongs = [],
  likedSongs = []
}: RecommendationEngineProps) {
  const { playSong } = React.useContext(MusicPlayerContext);
  const [activeTab, setActiveTab] = useState('mood');
  const [selectedMood, setSelectedMood] = useState(initialMood || '');
  const [recommendations, setRecommendations] = useState<Song[]>([]);
  const [loading, setLoading] = useState(false);
  const [varietyLevel, setVarietyLevel] = useState(50); // 0-100 arasında çeşitlilik seviyesi
  const [apiRequestCount, setApiRequestCount] = useState(0);
  const [queryText, setQueryText] = useState('');
  const { toast } = useToast();
  
  // API istek sayısı sınırı
  const API_REQUEST_LIMIT = 10;
  
  // Ruh haline göre öneriler
  const getMoodRecommendations = async (mood: string) => {
    setLoading(true);
    
    try {
      // Veritabanından belirli bir ruh haline göre şarkılar
      const moodSongs = await fetchSongsByMood(mood);
      
      // Eğer yeterli sayıda şarkı bulunamazsa, Last.fm'den tür bazlı öneriler al
      if (moodSongs.length < 3 && apiRequestCount < API_REQUEST_LIMIT) {
        // Last.fm'deki benzer türlerle eşleştir
        const lastfmTag = mapMoodToLastfmTag(mood);
        
        // API istek sayısını artır
        setApiRequestCount(prev => prev + 1);
        
        const lastfmTracks = await getTopTracksByTag(lastfmTag, 5);
        
        // Last.fm'den gelen önerileri yerel veritabanındaki şarkılarla eşleştir
        const allSongs = await fetchAllSongs();
        const matchedSongs = lastfmTracks.flatMap(track => {
          // Benzer şarkıları bul (başlık ve sanatçı adı benzerliğine göre)
          return allSongs.filter(song => 
            similarity(song.title.toLowerCase(), track.name.toLowerCase()) > 0.6 ||
            similarity(song.artist.toLowerCase(), track.artist.toLowerCase()) > 0.7
          );
        });
        
        // Tüm şarkıları birleştir ve filtreleme/karıştırma yap
        const allRecommendations = [...moodSongs, ...matchedSongs];
        
        // Eğer hala yeterli şarkı yoksa, genel bir şarkı listesi döndür
        if (allRecommendations.length < 3) {
          // Veritabanındaki tüm şarkıları karıştırarak 10 tane al
          const randomSongs = shuffleArray(allSongs).slice(0, 10);
          setRecommendations(randomSongs);
        } else {
          // Var olan önerileri karıştır
          setRecommendations(shuffleArray(allRecommendations));
        }
      } else {
        // Yeterli şarkı bulundu, ruh haline göre şarkıları göster
        setRecommendations(moodSongs);
      }
    } catch (error) {
      console.error('Öneri getirme hatası:', error);
      toast({
        title: 'Öneri Hatası',
        description: 'Öneriler yüklenirken bir sorun oluştu.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Beğenilen ve dinlenen şarkılara göre öneriler
  const getPersonalizedRecommendations = async () => {
    setLoading(true);
    
    try {
      if (likedSongs.length === 0 && recentlyPlayedSongs.length === 0) {
        // Beğenilen veya son dinlenen şarkı yoksa, ruh hali bazlı önerilere geç
        if (selectedMood) {
          await getMoodRecommendations(selectedMood);
        } else {
          // Hiçbir şey yoksa rastgele öneriler göster
          const allSongs = await fetchAllSongs();
          setRecommendations(shuffleArray(allSongs).slice(0, 10));
        }
        return;
      }
      
      // Beğenilen şarkılar veya son dinlenen şarkıların türlerini/sanatçılarını analiz et
      const sourceSongs = likedSongs.length > 0 ? likedSongs : recentlyPlayedSongs;
      
      // Türler ve sanatçılar için frekans analizi
      const genreCounts: Record<string, number> = {};
      const artistCounts: Record<string, number> = {};
      
      sourceSongs.forEach(song => {
        if (song.genre) {
          genreCounts[song.genre] = (genreCounts[song.genre] || 0) + 1;
        }
        
        artistCounts[song.artist] = (artistCounts[song.artist] || 0) + 1;
      });
      
      // En popüler tür ve sanatçıyı bul
      const sortedGenres = Object.entries(genreCounts)
        .sort((a, b) => b[1] - a[1])
        .map(([genre]) => genre);
      
      const sortedArtists = Object.entries(artistCounts)
        .sort((a, b) => b[1] - a[1])
        .map(([artist]) => artist);
      
      // Tüm şarkıları getir
      const allSongs = await fetchAllSongs();
      
      // Farklı türlere ağırlık ver (çeşitlilik seviyesine göre)
      const diversityFactor = varietyLevel / 100; // 0-1 arası normalize et
      
      // Şarkıları puanla
      const scoredSongs = allSongs.map(song => {
        let score = 0;
        
        // Tür puanı
        if (song.genre && sortedGenres.includes(song.genre)) {
          const genreIndex = sortedGenres.indexOf(song.genre);
          score += (sortedGenres.length - genreIndex) * (1 - diversityFactor);
        }
        
        // Sanatçı puanı
        if (sortedArtists.includes(song.artist)) {
          const artistIndex = sortedArtists.indexOf(song.artist);
          score += (sortedArtists.length - artistIndex) * (1 - diversityFactor);
        }
        
        // Çeşitlilik faktörü
        score += Math.random() * diversityFactor * 5;
        
        // Zaten dinlenen şarkılar için ceza
        const isAlreadyListened = sourceSongs.some(s => s.id === song.id);
        if (isAlreadyListened) {
          score -= 5;
        }
        
        return { song, score };
      });
      
      // Puanlara göre sırala ve en yüksek puanlıları seç
      const sortedRecommendations = scoredSongs
        .sort((a, b) => b.score - a.score)
        .map(({ song }) => song)
        .slice(0, 10);
      
      setRecommendations(sortedRecommendations);
    } catch (error) {
      console.error('Kişisel öneri hatası:', error);
      toast({
        title: 'Öneri Hatası',
        description: 'Kişiselleştirilmiş öneriler yüklenirken bir sorun oluştu.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Benzer şarkılar önerisi
  const getSimilarSongRecommendations = async () => {
    if (recentlyPlayedSongs.length === 0) {
      toast({
        title: 'Öneri Yapılamıyor',
        description: 'Benzer şarkı önerisi için yakın zamanda dinlediğiniz bir şarkı olmalı.',
        variant: 'default',
      });
      return;
    }
    
    setLoading(true);
    
    try {
      // Son dinlenen şarkı
      const lastPlayed = recentlyPlayedSongs[0];
      
      // API istek sınırını kontrol et
      if (apiRequestCount >= API_REQUEST_LIMIT) {
        // API sınırı aşıldıysa veritabanından rastgele şarkılar göster
        const allSongs = await fetchAllSongs();
        const sameMoodSongs = allSongs.filter(song => 
          song.mood && lastPlayed.mood && 
          song.mood.some(m => lastPlayed.mood?.includes(m)) &&
          song.id !== lastPlayed.id
        );
        
        if (sameMoodSongs.length > 0) {
          setRecommendations(shuffleArray(sameMoodSongs).slice(0, 10));
        } else {
          setRecommendations(shuffleArray(allSongs).filter(s => s.id !== lastPlayed.id).slice(0, 10));
        }
        return;
      }
      
      // API istek sayısını artır
      setApiRequestCount(prev => prev + 1);
      
      // Last.fm API'den benzer şarkılar al
      const similarTracks = await getSimilarTracks(lastPlayed.artist, lastPlayed.title, 10);
      
      // Veritabanından tüm şarkıları al
      const allSongs = await fetchAllSongs();
      
      // Benzer şarkıları eşleştir
      const matchedSongs = similarTracks.flatMap(track => {
        return allSongs.filter(song => 
          (similarity(song.title.toLowerCase(), track.name.toLowerCase()) > 0.6 ||
           similarity(song.artist.toLowerCase(), track.artist.toLowerCase()) > 0.7) &&
          song.id !== lastPlayed.id
        );
      });
      
      if (matchedSongs.length > 0) {
        setRecommendations(matchedSongs);
      } else {
        // Eşleşme bulunamazsa aynı türdeki şarkıları göster
        const sameMoodSongs = allSongs.filter(song => 
          song.mood && lastPlayed.mood && 
          song.mood.some(m => lastPlayed.mood?.includes(m)) &&
          song.id !== lastPlayed.id
        );
        
        if (sameMoodSongs.length > 0) {
          setRecommendations(shuffleArray(sameMoodSongs).slice(0, 10));
        } else {
          // Son çare: rastgele şarkılar
          setRecommendations(shuffleArray(allSongs).filter(s => s.id !== lastPlayed.id).slice(0, 10));
        }
      }
    } catch (error) {
      console.error('Benzer şarkı önerisi hatası:', error);
      toast({
        title: 'Öneri Hatası',
        description: 'Benzer şarkılar getirilirken bir sorun oluştu.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };
  
  // YouTube video önerileri
  const getYouTubeRecommendations = async () => {
    if (apiRequestCount >= API_REQUEST_LIMIT) {
      toast({
        title: 'API Sınırı',
        description: 'YouTube API kullanım sınırına ulaşıldı. Lütfen daha sonra tekrar deneyin.',
        variant: 'destructive',
      });
      return;
    }
    
    // Sorgu metnini belirle
    let query = queryText;
    if (!query) {
      if (selectedMood) {
        query = `${selectedMood} music`;
      } else if (recentlyPlayedSongs.length > 0) {
        const lastPlayed = recentlyPlayedSongs[0];
        query = `${lastPlayed.artist} ${lastPlayed.title} music`;
      } else {
        query = 'recommended music 2023';
      }
    }
    
    setLoading(true);
    
    try {
      // API istek sayısını artır
      setApiRequestCount(prev => prev + 1);
      
      // YouTube API'den videolar al
      const videoResults = await searchYouTube(query, 10);
      
      // Sonuçları YouTube video ID'leri ile işle ve gerekirse yeni bir bileşen oluştur
      // Bu projede şu anda tam entegrasyon yapılmıyor, sadece temel yapı oluşturuluyor
      
      // Ancak, önerilen şarkıları veritabanından getirip gösterelim
      const allSongs = await fetchAllSongs();
      const querySongs = allSongs.filter(song => 
        song.title.toLowerCase().includes(query.toLowerCase()) ||
        song.artist.toLowerCase().includes(query.toLowerCase()) ||
        (song.genre && song.genre.toLowerCase().includes(query.toLowerCase()))
      );
      
      if (querySongs.length > 0) {
        setRecommendations(querySongs);
      } else {
        // Eşleşme bulunamazsa rastgele şarkılar göster
        setRecommendations(shuffleArray(allSongs).slice(0, 10));
      }
    } catch (error) {
      console.error('YouTube öneri hatası:', error);
      toast({
        title: 'Öneri Hatası',
        description: 'YouTube önerileri getirilirken bir sorun oluştu.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Seçilen sekme değiştiğinde önerileri güncelle
  useEffect(() => {
    switch (activeTab) {
      case 'mood':
        if (selectedMood) {
          getMoodRecommendations(selectedMood);
        }
        break;
      case 'personalized':
        getPersonalizedRecommendations();
        break;
      case 'similar':
        getSimilarSongRecommendations();
        break;
      case 'youtube':
        getYouTubeRecommendations();
        break;
    }
  }, [activeTab, selectedMood]);
  
  // Ruh hali değiştiğinde önerileri güncelle
  const handleMoodSelect = (mood: string) => {
    setSelectedMood(mood);
    if (activeTab === 'mood') {
      getMoodRecommendations(mood);
    }
  };
  
  // Çeşitlilik seviyesi değiştiğinde önerileri güncelle
  const handleVarietyChange = (value: number[]) => {
    setVarietyLevel(value[0]);
    if (activeTab === 'personalized') {
      // Çeşitlilik değiştiğinde tavsiyeyi anında güncelleme
      getPersonalizedRecommendations();
    }
  };
  
  // YouTube sorgusu değiştiğinde
  const handleQuerySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeTab === 'youtube') {
      getYouTubeRecommendations();
    }
  };
  
  return (
    <Card className={`overflow-hidden ${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          Akıllı Müzik Önerileri
        </CardTitle>
        <CardDescription>
          Ruh halinize ve dinleme geçmişinize göre kişiselleştirilmiş öneriler
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full">
            <TabsTrigger value="mood" className="flex-1 gap-1">
              <Music className="h-4 w-4" /> Ruh Hali
            </TabsTrigger>
            <TabsTrigger value="personalized" className="flex-1 gap-1">
              <Heart className="h-4 w-4" /> Kişisel
            </TabsTrigger>
            <TabsTrigger value="similar" className="flex-1 gap-1">
              <History className="h-4 w-4" /> Benzer
            </TabsTrigger>
            <TabsTrigger value="youtube" className="flex-1 gap-1">
              <Zap className="h-4 w-4" /> YouTube
            </TabsTrigger>
          </TabsList>
          
          {/* Ruh Hali Sekmesi */}
          <TabsContent value="mood">
            <div className="space-y-4">
              <div className="mb-4">
                <h3 className="text-sm font-medium mb-2">Ruh Halinizi Seçin</h3>
                <div className="flex flex-wrap gap-2">
                  {MOODS.map((mood) => (
                    <Badge 
                      key={String(mood.id)}
                      variant={selectedMood === mood.id ? "default" : "outline"}
                      className="cursor-pointer capitalize"
                      onClick={() => handleMoodSelect(mood.id as string)}
                    >
                      {mood.label as React.ReactNode}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-sm font-medium">Önerilen Şarkılar</h3>
                {loading ? (
                  <div className="text-center py-8">
                    <svg className="animate-spin h-8 w-8 text-primary mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <p className="mt-2 text-sm text-muted-foreground">Öneriler yükleniyor...</p>
                  </div>
                ) : recommendations.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {recommendations.slice(0, 6).map((song) => (
                      <SongCard 
                        key={song.id}
                        song={song}
                        onClick={() => playSong(song)}
                        isCompact
                      />
                    ))}
                  </div>
                ) : selectedMood ? (
                  <div className="text-center py-8">
                    <Music className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                    <p className="text-muted-foreground">Bu ruh hali için öneri bulunamadı.</p>
                    <p className="text-xs text-muted-foreground mt-1">Lütfen başka bir ruh hali seçin.</p>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Sparkles className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                    <p className="text-muted-foreground">Öneriler için bir ruh hali seçin.</p>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
          
          {/* Kişisel Öneriler Sekmesi */}
          <TabsContent value="personalized">
            <div className="space-y-4">
              <div className="mb-4">
                <h3 className="text-sm font-medium mb-2">Çeşitlilik Seviyesi</h3>
                <div className="flex items-center gap-4">
                  <span className="text-xs text-muted-foreground">Benzer</span>
                  <Slider
                    value={[varietyLevel]}
                    min={0}
                    max={100}
                    step={10}
                    className="flex-1"
                    onValueChange={handleVarietyChange}
                  />
                  <span className="text-xs text-muted-foreground">Farklı</span>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-medium">Sizin İçin Öneriler</h3>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="flex items-center gap-1"
                    onClick={getPersonalizedRecommendations}
                  >
                    <RefreshCw className="h-3 w-3" />
                    <span className="text-xs">Yenile</span>
                  </Button>
                </div>
                
                {loading ? (
                  <div className="text-center py-8">
                    <svg className="animate-spin h-8 w-8 text-primary mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <p className="mt-2 text-sm text-muted-foreground">Öneriler yükleniyor...</p>
                  </div>
                ) : recommendations.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {recommendations.slice(0, 6).map((song) => (
                      <SongCard 
                        key={song.id}
                        song={song}
                        onClick={() => playSong(song)}
                        isCompact
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                    <p className="text-muted-foreground">Kişiselleştirilmiş öneriler için daha fazla şarkı dinleyin.</p>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
          
          {/* Benzer Şarkılar Sekmesi */}
          <TabsContent value="similar">
            <div className="space-y-4">
              {recentlyPlayedSongs.length > 0 ? (
                <>
                  <div className="mb-4">
                    <h3 className="text-sm font-medium mb-2">Son Dinlenen Şarkı</h3>
                    <SongCard 
                      song={recentlyPlayedSongs[0]}
                      onClick={() => playSong(recentlyPlayedSongs[0])}
                    />
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-sm font-medium">Benzer Şarkılar</h3>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="flex items-center gap-1"
                        onClick={getSimilarSongRecommendations}
                      >
                        <RefreshCw className="h-3 w-3" />
                        <span className="text-xs">Yenile</span>
                      </Button>
                    </div>
                    
                    {loading ? (
                      <div className="text-center py-8">
                        <svg className="animate-spin h-8 w-8 text-primary mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <p className="mt-2 text-sm text-muted-foreground">Benzer şarkılar yükleniyor...</p>
                      </div>
                    ) : recommendations.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {recommendations.slice(0, 6).map((song) => (
                          <SongCard 
                            key={song.id}
                            song={song}
                            onClick={() => playSong(song)}
                            isCompact
                          />
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <Music className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                        <p className="text-muted-foreground">Benzer şarkı bulunamadı.</p>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="text-center py-12">
                  <History className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground">Benzer şarkı önerileri için önce bir şarkı dinleyin.</p>
                </div>
              )}
            </div>
          </TabsContent>
          
          {/* YouTube Sekmesi */}
          <TabsContent value="youtube">
            <div className="space-y-4">
              <form onSubmit={handleQuerySubmit} className="flex gap-2">
                <input
                  type="text"
                  className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="YouTube'da ara..."
                  value={queryText}
                  onChange={(e) => setQueryText(e.target.value)}
                />
                <Button 
                  type="submit" 
                  size="sm"
                  disabled={apiRequestCount >= API_REQUEST_LIMIT}
                >
                  <Search className="h-4 w-4" />
                </Button>
              </form>
              
              {apiRequestCount >= API_REQUEST_LIMIT && (
                <div className="bg-yellow-50 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200 p-2 rounded-md text-xs">
                  YouTube API kullanım sınırına ulaşıldı. Video önerileri sınırlı olabilir.
                </div>
              )}
              
              <div className="space-y-4">
                <h3 className="text-sm font-medium">Video Önerileri</h3>
                {loading ? (
                  <div className="text-center py-8">
                    <svg className="animate-spin h-8 w-8 text-primary mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <p className="mt-2 text-sm text-muted-foreground">Video önerileri yükleniyor...</p>
                  </div>
                ) : recommendations.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {recommendations.slice(0, 6).map((song) => (
                      <SongCard 
                        key={song.id}
                        song={song}
                        onClick={() => playSong(song)}
                        isCompact
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Zap className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                    <p className="text-muted-foreground">Youtube önerileri için arama yapın.</p>
                  </div>
                )}
              </div>
              
              <div className="text-center mt-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  disabled={apiRequestCount >= API_REQUEST_LIMIT}
                  onClick={() => window.location.href = '/videos'}
                >
                  YouTube Videolarına Git
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      
      <CardFooter className="flex justify-between border-t pt-4">
        <p className="text-xs text-muted-foreground">
          Önerilen: {recommendations.length} şarkı
        </p>
        <a 
          href="https://www.last.fm/" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-xs text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
        >
          <img src="https://www.last.fm/static/images/lastfm_logo_16.png" alt="Last.fm" className="h-3" />
          Last.fm verilerini içerir
        </a>
      </CardFooter>
    </Card>
  );
}

// YARDIMCI FONKSİYONLAR

// Ruh halini Last.fm türlerine eşleme
function mapMoodToLastfmTag(mood: string): string {
  const moodMap: Record<string, string> = {
    'mutlu': 'happy',
    'üzgün': 'sad',
    'heyecanlı': 'energetic',
    'sakin': 'calm',
    'romantik': 'romantic',
    'nostaljik': 'nostalgic',
    'enerjik': 'energetic',
    'hüzünlü': 'melancholy',
    'dinlendirici': 'relaxing',
    'konsantre': 'focus',
    'motivasyonlu': 'motivational',
    'neşeli': 'happy',
    'depresif': 'sad',
    'agresif': 'angry',
    'karizmatik': 'cool'
  };
  
  return moodMap[mood.toLowerCase()] || mood;
}

// Diziyi karıştır
function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

// İki metin arasındaki benzerliği ölç (Levenshtein mesafesi kullanarak)
function similarity(s1: string, s2: string): number {
  if (s1 === s2) return 1.0;
  
  const longer = s1.length > s2.length ? s1 : s2;
  const shorter = s1.length > s2.length ? s2 : s1;
  
  if (longer.length === 0) return 1.0;
  
  return (longer.length - levenshteinDistance(longer, shorter)) / longer.length;
}

// Levenshtein mesafesi hesaplama
function levenshteinDistance(s1: string, s2: string): number {
  s1 = s1.toLowerCase();
  s2 = s2.toLowerCase();

  const costs = [];
  for (let i = 0; i <= s1.length; i++) {
    let lastValue = i;
    for (let j = 0; j <= s2.length; j++) {
      if (i === 0) {
        costs[j] = j;
      } else if (j > 0) {
        let newValue = costs[j - 1];
        if (s1.charAt(i - 1) !== s2.charAt(j - 1)) {
          newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1;
        }
        costs[j - 1] = lastValue;
        lastValue = newValue;
      }
    }
    if (i > 0) costs[s2.length] = lastValue;
  }
  
  return costs[s2.length];
}