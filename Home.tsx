import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import Layout from '@/components/Layout';
import SearchBar from '@/components/SearchBar';
import { AIAssistant } from '@/components/AIAssistant';
import { SongCard } from '@/components/SongCard';
import { ArtistCard } from '@/components/ArtistCard';
import { SongTable } from '@/components/SongTable';
import { RecommendationEngine } from '@/components/RecommendationEngine';
import { MusicPlayerContext } from '@/components/Layout';
import { fetchSongsByMood, fetchRecentlyPlayed, fetchUserLibrary } from '@/lib/xata';
import { MOODS } from '@/lib/constants';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles, Youtube, User, Brain, Music } from 'lucide-react';
import type { Song } from '@shared/schema';

const Home: React.FC = () => {
  const [selectedMood, setSelectedMood] = useState('mutlu'); // Default mood: happy
  const [_, navigate] = useLocation();
  const { playSong } = React.useContext(MusicPlayerContext);
  
  // Page title
  document.title = 'Ana Sayfa - Müzik Asistanım';
  
  // Fetch songs by mood
  const { data: moodSongs = [] } = useQuery({
    queryKey: ['/api/songs/mood', selectedMood],
    queryFn: () => fetchSongsByMood(selectedMood)
  });
  
  // Fetch recently played songs
  const { data: recentlyPlayed = [] } = useQuery({
    queryKey: ['/api/recently-played'],
    queryFn: fetchRecentlyPlayed
  });
  
  // Fetch user library (liked songs)
  const { data: likedSongs = [] } = useQuery({
    queryKey: ['/api/library'],
    queryFn: fetchUserLibrary
  });
  
  // Popular artists (derived from mood songs)
  const popularArtists = React.useMemo(() => {
    const artists = moodSongs.map(song => song.artist);
    const uniqueArtists = [...new Set(artists)];
    return uniqueArtists.slice(0, 6).map(name => ({
      name,
      // This is for demo purposes - in a real app, you'd have artist images
      imageUrl: `https://source.unsplash.com/featured/?musician&sig=${name}`
    }));
  }, [moodSongs]);
  
  const handleArtistClick = (artistName: string) => {
    navigate(`/artist?name=${encodeURIComponent(artistName)}`);
  };
  
  return (
    <Layout>
      <div className="container px-4 mx-auto">
        <h1 className="text-3xl font-bold mb-6">Merhaba, hoş geldiniz!</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
          <div className="lg:col-span-8 space-y-8">
            {/* AI Assistant */}
            <div>
              <AIAssistant />
            </div>
            
            {/* Recently Played */}
            <SongTable 
              songs={recentlyPlayed}
              title="Son Çalınanlar"
              showViewAll
              onViewAllClick={() => navigate('/recently-played')}
            />
            
            {/* Recommendations */}
            <RecommendationEngine 
              initialMood={selectedMood}
              recentlyPlayedSongs={recentlyPlayed}
              likedSongs={likedSongs}
            />
            
            {/* Popular Artists */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Popüler Sanatçılar</h2>
                <Button 
                  variant="ghost"
                  onClick={() => navigate('/artist')}
                >
                  Tümünü Gör
                </Button>
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {popularArtists.map((artist, index) => (
                  <ArtistCard 
                    key={index}
                    name={artist.name}
                    imageUrl={artist.imageUrl}
                    onClick={() => handleArtistClick(artist.name)}
                  />
                ))}
              </div>
            </div>
          </div>
          
          <div className="lg:col-span-4 space-y-6">
            {/* Search Bar */}
            <SearchBar className="w-full" autoFocus={false} />
            
            {/* Mood Songs */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-xl flex items-center gap-2">
                  <Music className="h-5 w-5 text-primary" />
                  {MOODS.find(m => m.id === selectedMood)?.label || 'Mutlu'} Müzikler
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {moodSongs.slice(0, 3).map((song) => (
                    <SongCard 
                      key={song.id} 
                      song={song} 
                      onClick={() => playSong(song)}
                      isCompact
                    />
                  ))}
                  {moodSongs.length > 3 && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full mt-2"
                      onClick={() => navigate(`/search?mood=${selectedMood}`)}
                    >
                      Daha Fazla Göster
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
            
            {/* Music Discovery */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-xl flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  Müzik Keşfi
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Her gün yeni müzikler keşfedin ve müzik dünyanızı genişletin.
                </p>
                <Button className="w-full" onClick={() => navigate('/discovery')}>
                  Günlük Keşfe Git
                </Button>
              </CardContent>
            </Card>
            
            {/* Video Section */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-xl flex items-center gap-2">
                  <Youtube className="h-5 w-5 text-primary" />
                  YouTube Müzikleri
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  YouTube'dan favori şarkılarınızı keşfedin ve izleyin.
                </p>
                <Button className="w-full" onClick={() => navigate('/videos')}>
                  Video Keşfine Git
                </Button>
              </CardContent>
            </Card>
            
            {/* Artist Section */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-xl flex items-center gap-2">
                  <User className="h-5 w-5 text-primary" />
                  Sanatçı Keşfi
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Sanatçılar hakkında ayrıntılı bilgi edinin ve benzer sanatçıları keşfedin.
                </p>
                <Button className="w-full" onClick={() => navigate('/artist')}>
                  Sanatçı Keşfine Git
                </Button>
              </CardContent>
            </Card>
            
            {/* AI Assistant */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-xl flex items-center gap-2">
                  <Brain className="h-5 w-5 text-primary" />
                  Yapay Zeka Asistanı
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Müzik önerileri ve bilgiler için yapay zeka asistanımızla sohbet edin.
                </p>
                <Button className="w-full" onClick={() => navigate('/ai')}>
                  Asistana Git
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Home;