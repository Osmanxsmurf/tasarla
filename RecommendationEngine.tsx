import React, { useState, useEffect, useCallback } from 'react';
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
import { 
  Sparkles, 
  Music, 
  Zap, 
  RefreshCw, 
  ThumbsUp, 
  Heart, 
  History, 
  Users, 
  User, 
  Search 
} from 'lucide-react';
import { Song } from '@shared/schema';
import { useOffline } from '@/hooks/use-offline';
import { similarity, shuffleArray } from '@/lib/super-ai';
import { motion } from 'framer-motion';

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
  const { toast } = useToast();
  const { isOffline } = useOffline();
  
  const [activeTab, setActiveTab] = useState('mood');
  const [selectedMood, setSelectedMood] = useState(initialMood || '');
  const [recommendations, setRecommendations] = useState<Song[]>([]);
  const [loading, setLoading] = useState(false);
  const [varietyLevel, setVarietyLevel] = useState(50); // 0-100 range for variety
  const [apiRequestCount, setApiRequestCount] = useState(0);
  const [queryText, setQueryText] = useState('');
  
  // API request limit
  const API_REQUEST_LIMIT = isOffline ? 0 : 10;
  
  // Helper to map mood to LastFM tag
  const mapMoodToLastfmTag = (mood: string): string => {
    switch (mood) {
      case 'energetic': return 'energetic';
      case 'peaceful': return 'chill';
      case 'romantic': return 'romantic';
      case 'nostalgic': return 'nostalgic';
      case 'sad': return 'sad';
      case 'motivational': return 'motivational';
      case 'focus': return 'focus';
      case 'happy': return 'happy';
      default: return mood;
    }
  };
  
  // Get recommendations based on mood
  const getMoodRecommendations = async (mood: string) => {
    setLoading(true);
    
    try {
      // Get songs from database by mood
      const moodSongs = await fetchSongsByMood(mood);
      
      // If not enough songs and API requests allowed, get more from LastFM
      if (moodSongs.length < 3 && apiRequestCount < API_REQUEST_LIMIT) {
        // Map to LastFM tag
        const lastfmTag = mapMoodToLastfmTag(mood);
        
        // Increment API request count
        setApiRequestCount(prev => prev + 1);
        
        // Get songs from LastFM
        const lastfmTracks = await getTopTracksByTag(lastfmTag, 5);
        
        // Match LastFM tracks with local database
        const allSongs = await fetchAllSongs();
        const matchedSongs = lastfmTracks.flatMap(track => {
          return allSongs.filter(song => 
            similarity(song.title.toLowerCase(), track.name.toLowerCase()) > 0.6 ||
            similarity(song.artist.toLowerCase(), track.artist.toLowerCase()) > 0.7
          );
        });
        
        // Combine and filter/shuffle
        const allRecommendations = [...moodSongs, ...matchedSongs];
        
        // If still not enough songs, return a general list
        if (allRecommendations.length < 3) {
          // Get random songs from database
          const randomSongs = shuffleArray(allSongs).slice(0, 10);
          setRecommendations(randomSongs);
        } else {
          // Shuffle existing recommendations
          setRecommendations(shuffleArray(allRecommendations));
        }
      } else {
        // Enough songs found by mood
        setRecommendations(moodSongs);
      }
    } catch (error) {
      console.error('Error getting recommendations:', error);
      toast({
        title: 'Öneri Hatası',
        description: 'Öneriler yüklenirken bir sorun oluştu.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Get personalized recommendations based on liked/recently played songs
  const getPersonalizedRecommendations = async () => {
    setLoading(true);
    
    try {
      // If no liked or recently played songs, fall back to mood or random
      if (likedSongs.length === 0 && recentlyPlayedSongs.length === 0) {
        if (selectedMood) {
          await getMoodRecommendations(selectedMood);
        } else {
          // Show random recommendations
          const allSongs = await fetchAllSongs();
          setRecommendations(shuffleArray(allSongs).slice(0, 10));
        }
        return;
      }
      
      // Analyze genres/artists from liked or recently played songs
      const sourceSongs = likedSongs.length > 0 ? likedSongs : recentlyPlayedSongs;
      
      // Count frequency of genres and artists
      const genreCounts: Record<string, number> = {};
      const artistCounts: Record<string, number> = {};
      
      sourceSongs.forEach(song => {
        if (song.genre) {
          genreCounts[song.genre] = (genreCounts[song.genre] || 0) + 1;
        }
        
        artistCounts[song.artist] = (artistCounts[song.artist] || 0) + 1;
      });
      
      // Sort genres and artists by popularity
      const sortedGenres = Object.entries(genreCounts)
        .sort((a, b) => b[1] - a[1])
        .map(([genre]) => genre);
      
      const sortedArtists = Object.entries(artistCounts)
        .sort((a, b) => b[1] - a[1])
        .map(([artist]) => artist);
      
      // Get all songs
      const allSongs = await fetchAllSongs();
      
      // Apply diversity factor based on variety level
      const diversityFactor = varietyLevel / 100; // 0-1 normalized
      
      // Score each song
      const scoredSongs = allSongs.map(song => {
        let score = 0;
        
        // Genre score
        if (song.genre && sortedGenres.includes(song.genre)) {
          const genreIndex = sortedGenres.indexOf(song.genre);
          score += (sortedGenres.length - genreIndex) * (1 - diversityFactor);
        }
        
        // Artist score
        if (sortedArtists.includes(song.artist)) {
          const artistIndex = sortedArtists.indexOf(song.artist);
          score += (sortedArtists.length - artistIndex) * (1 - diversityFactor);
        }
        
        // Diversity factor - add randomness based on diversity setting
        score += Math.random() * diversityFactor * 5;
        
        // Penalty for already listened songs
        const isAlreadyListened = sourceSongs.some(s => s.id === song.id);
        if (isAlreadyListened) {
          score -= 5;
        }
        
        return { song, score };
      });
      
      // Sort by score and get top results
      const sortedRecommendations = scoredSongs
        .sort((a, b) => b.score - a.score)
        .map(({ song }) => song)
        .slice(0, 10);
      
      setRecommendations(sortedRecommendations);
    } catch (error) {
      console.error('Error getting personalized recommendations:', error);
      toast({
        title: 'Öneri Hatası',
        description: 'Kişiselleştirilmiş öneriler yüklenirken bir sorun oluştu.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Get similar song recommendations
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
      // Get most recently played song
      const lastPlayed = recentlyPlayedSongs[0];
      
      // Check API request limit
      if (apiRequestCount >= API_REQUEST_LIMIT) {
        // If limit exceeded, show songs from database with similar mood
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
      
      // Increment API request count
      setApiRequestCount(prev => prev + 1);
      
      // Get similar tracks from LastFM
      const similarTracks = await getSimilarTracks(lastPlayed.artist, lastPlayed.title, 10);
      
      // Get all songs from database for matching
      const allSongs = await fetchAllSongs();
      
      // Match similar tracks with database
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
        // If no matches, show songs with similar mood
        const sameMoodSongs = allSongs.filter(song => 
          song.mood && lastPlayed.mood && 
          song.mood.some(m => lastPlayed.mood?.includes(m)) &&
          song.id !== lastPlayed.id
        );
        
        if (sameMoodSongs.length > 0) {
          setRecommendations(shuffleArray(sameMoodSongs).slice(0, 10));
        } else {
          // Last resort: random songs
          setRecommendations(shuffleArray(allSongs).filter(s => s.id !== lastPlayed.id).slice(0, 10));
        }
      }
    } catch (error) {
      console.error('Error getting similar song recommendations:', error);
      toast({
        title: 'Öneri Hatası',
        description: 'Benzer şarkılar getirilirken bir sorun oluştu.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Get YouTube video recommendations
  const getYouTubeRecommendations = async () => {
    if (apiRequestCount >= API_REQUEST_LIMIT) {
      toast({
        title: 'API Sınırı',
        description: 'YouTube API kullanım sınırına ulaşıldı. Lütfen daha sonra tekrar deneyin.',
        variant: 'destructive',
      });
      return;
    }
    
    // Determine search query
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
      // Increment API request count
      setApiRequestCount(prev => prev + 1);
      
      // Search YouTube
      const videoResults = await searchYouTube(query, 10);
      
      // For now, show songs from database that match the query
      const allSongs = await fetchAllSongs();
      const querySongs = allSongs.filter(song => 
        song.title.toLowerCase().includes(query.toLowerCase()) ||
        song.artist.toLowerCase().includes(query.toLowerCase()) ||
        (song.genre && song.genre.toLowerCase().includes(query.toLowerCase()))
      );
      
      if (querySongs.length > 0) {
        setRecommendations(querySongs);
      } else {
        // If no matches, show random songs
        setRecommendations(shuffleArray(allSongs).slice(0, 10));
      }
    } catch (error) {
      console.error('Error getting YouTube recommendations:', error);
      toast({
        title: 'Öneri Hatası',
        description: 'YouTube önerileri getirilirken bir sorun oluştu.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Update recommendations when tab changes
  useEffect(() => {
    const loadRecommendations = async () => {
      switch (activeTab) {
        case 'mood':
          if (selectedMood) {
            await getMoodRecommendations(selectedMood);
          }
          break;
        case 'personal':
          await getPersonalizedRecommendations();
          break;
        case 'similar':
          await getSimilarSongRecommendations();
          break;
        case 'youtube':
          await getYouTubeRecommendations();
          break;
      }
    };
    
    loadRecommendations();
  }, [activeTab, selectedMood]);
  
  // Handle mood selection
  const handleMoodSelect = (mood: string) => {
    setSelectedMood(mood);
    if (activeTab === 'mood') {
      getMoodRecommendations(mood);
    }
  };
  
  // Refresh recommendations
  const handleRefresh = () => {
    switch (activeTab) {
      case 'mood':
        if (selectedMood) {
          getMoodRecommendations(selectedMood);
        }
        break;
      case 'personal':
        getPersonalizedRecommendations();
        break;
      case 'similar':
        getSimilarSongRecommendations();
        break;
      case 'youtube':
        getYouTubeRecommendations();
        break;
    }
  };
  
  // Handle search for YouTube tab
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeTab === 'youtube') {
      getYouTubeRecommendations();
    }
  };
  
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          Müzik Önerileri
        </CardTitle>
        <CardDescription>
          Size özel müzik keşfedin
        </CardDescription>
      </CardHeader>
      
      <CardContent className="pb-2">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="mood" className="flex items-center gap-1">
              <Music className="h-4 w-4" />
              <span className="hidden sm:inline">Ruh Hali</span>
            </TabsTrigger>
            <TabsTrigger value="personal" className="flex items-center gap-1">
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">Kişisel</span>
            </TabsTrigger>
            <TabsTrigger value="similar" className="flex items-center gap-1">
              <ThumbsUp className="h-4 w-4" />
              <span className="hidden sm:inline">Benzer</span>
            </TabsTrigger>
            <TabsTrigger value="youtube" className="flex items-center gap-1">
              <Zap className="h-4 w-4" />
              <span className="hidden sm:inline">Keşfet</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="mood" className="space-y-4">
            <MoodSelector
              selectedMood={selectedMood}
              onMoodSelect={handleMoodSelect}
            />
          </TabsContent>
          
          <TabsContent value="personal" className="space-y-4">
            <div>
              <h3 className="text-sm font-medium mb-2">Çeşitlilik</h3>
              <div className="flex items-center gap-4">
                <span className="text-xs text-muted-foreground">Benzer</span>
                <Slider
                  value={[varietyLevel]}
                  min={0}
                  max={100}
                  step={10}
                  onValueChange={(values) => setVarietyLevel(values[0])}
                  className="flex-1"
                />
                <span className="text-xs text-muted-foreground">Çeşitli</span>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="flex items-center gap-1">
                <Heart className="h-3 w-3 text-pink-500" />
                <span>Beğendiğin {likedSongs.length} Şarkı</span>
              </Badge>
              
              <Badge variant="outline" className="flex items-center gap-1">
                <History className="h-3 w-3 text-blue-500" />
                <span>Son Dinlenen {recentlyPlayedSongs.length} Şarkı</span>
              </Badge>
              
              <Badge variant="outline" className="flex items-center gap-1">
                <Users className="h-3 w-3 text-purple-500" />
                <span>Benzer Zevkler</span>
              </Badge>
            </div>
          </TabsContent>
          
          <TabsContent value="similar" className="space-y-4">
            {recentlyPlayedSongs.length > 0 ? (
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Son dinlediğiniz şarkıya göre:</h3>
                <div className="bg-muted p-2 rounded-lg flex items-center gap-3">
                  <div className="h-12 w-12 rounded overflow-hidden flex-shrink-0">
                    <img 
                      src={recentlyPlayedSongs[0].coverImage || 'https://placehold.co/100/gray/white?text=No+Image'} 
                      alt={recentlyPlayedSongs[0].title} 
                      className="h-full w-full object-cover" 
                    />
                  </div>
                  <div>
                    <h4 className="font-medium text-sm">{recentlyPlayedSongs[0].title}</h4>
                    <p className="text-xs text-muted-foreground">{recentlyPlayedSongs[0].artist}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-muted-foreground text-sm">
                  Benzer şarkı önerileri için önce bir şarkı dinleyin.
                </p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="youtube" className="space-y-4">
            <form onSubmit={handleSearch} className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <input
                  type="text"
                  placeholder="Şarkı, sanatçı veya tür ara..."
                  className="w-full pl-8 pr-4 py-2 text-sm rounded-md bg-muted border-transparent focus:border-primary focus:bg-card focus:ring-1 focus:ring-primary"
                  value={queryText}
                  onChange={(e) => setQueryText(e.target.value)}
                />
              </div>
              <Button type="submit" disabled={isOffline || apiRequestCount >= API_REQUEST_LIMIT}>
                Ara
              </Button>
            </form>
            
            {isOffline && (
              <div className="text-center p-2 bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 rounded-md text-sm">
                Çevrimdışı modda YouTube araması kullanılamaz.
              </div>
            )}
          </TabsContent>
          
          {/* Recommendations list */}
          <div className="mt-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold">Öneriler</h3>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={handleRefresh}
                disabled={loading}
                className={loading ? 'animate-spin' : ''}
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
            
            {loading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="aspect-square rounded-lg bg-muted animate-pulse"></div>
                ))}
              </div>
            ) : recommendations.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {recommendations.map((song) => (
                  <motion.div
                    key={song.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <SongCard
                      song={song}
                      onPlay={playSong}
                    />
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">
                  {selectedMood ? 
                    `"${MOODS.find(m => m.id === selectedMood)?.label || selectedMood}" için henüz öneri bulunamadı.` : 
                    'Henüz öneri bulunmuyor. Lütfen bir kategori seçin.'
                  }
                </p>
              </div>
            )}
          </div>
        </Tabs>
      </CardContent>
      
      <CardFooter className="flex justify-between pt-2">
        <div className="text-xs text-muted-foreground">
          {isOffline ? (
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-yellow-500"></span>
              Çevrimdışı mod
            </span>
          ) : apiRequestCount >= API_REQUEST_LIMIT ? (
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-red-500"></span>
              API sınırına ulaşıldı
            </span>
          ) : (
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-green-500"></span>
              Öneri sistemi aktif
            </span>
          )}
        </div>
        
        <div className="text-xs text-muted-foreground">
          {recommendations.length} şarkı bulundu
        </div>
      </CardFooter>
    </Card>
  );
}
