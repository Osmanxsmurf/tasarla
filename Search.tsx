import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import SearchBar from '@/components/SearchBar';
import { SongTable } from '@/components/SongTable';
import { SongCard } from '@/components/SongCard';
import { ArtistCard } from '@/components/ArtistCard';
import { MoodSelector } from '@/components/MoodSelector';
import { MusicPlayerContext } from '@/components/Layout';
import { searchSongs, fetchSongsByMood, fetchSongsByArtist } from '@/lib/xata';
import { useToast } from '@/hooks/use-toast';
import type { Song } from '@shared/schema';

const Search: React.FC = () => {
  const [location] = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const { playSong } = React.useContext(MusicPlayerContext);
  const { toast } = useToast();
  
  // Parse query params from URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const q = params.get('q');
    const mood = params.get('mood');
    
    if (q) {
      setSearchQuery(q);
      setSelectedMood(null);
    } else if (mood) {
      setSelectedMood(mood);
      setSearchQuery('');
    }
  }, [location]);
  
  // Search query
  const { data: searchResults = [], isLoading: isSearchLoading } = useQuery({
    queryKey: ['/api/songs/search', searchQuery],
    queryFn: () => searchSongs(searchQuery),
    enabled: searchQuery.length > 0
  });
  
  // Mood filter
  const { data: moodResults = [], isLoading: isMoodLoading } = useQuery({
    queryKey: ['/api/songs/mood', selectedMood],
    queryFn: () => fetchSongsByMood(selectedMood || ''),
    enabled: !!selectedMood
  });
  
  const isLoading = isSearchLoading || isMoodLoading;
  
  // Get artists from search results
  const artists = React.useMemo(() => {
    if (!searchResults.length) return [];
    
    // Artist adlarını al ve tekrarları kaldır (case-insensitive karşılaştırma için)
    const artistNamesLower = new Map<string, string>();
    searchResults.forEach(song => {
      const lowerName = song.artist.toLowerCase();
      if (!artistNamesLower.has(lowerName)) {
        artistNamesLower.set(lowerName, song.artist);
      }
    });
    
    // Orijinal yazımları kullanarak sanatçı dizisini oluştur
    const artistNames = Array.from(artistNamesLower.values());
    return artistNames.map(name => ({
      name,
      // This is for demo purposes - in a real app, you'd have artist images
      imageUrl: `https://source.unsplash.com/featured/?musician&sig=${encodeURIComponent(name)}`
    }));
  }, [searchResults]);
  
  // Handle search submit
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setSelectedMood(null);
  };
  
  // Handle mood selection
  const handleMoodSelect = (mood: string) => {
    setSelectedMood(mood);
    setSearchQuery('');
  };
  
  // Handle artist click - doğrudan sanatçı şarkılarını getir
  const handleArtistClick = async (artistName: string) => {
    try {
      // Doğrudan şarkıları getir
      const artistSongs = await fetchSongsByArtist(artistName);
      
      if (artistSongs.length > 0) {
        // Eğer şarkılar bulunursa, onları göster
        setSearchQuery(artistName);
        setSelectedMood(null);
      } else {
        // Şarkı bulunamazsa, arama yapmayı dene
        setSearchQuery(artistName);
        setSelectedMood(null);
        
        // Hata mesajı göster
        toast({
          title: "Sanatçı bulunamadı",
          description: `"${artistName}" adlı sanatçı için şarkı bulunamadı.`,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error fetching artist songs:", error);
      setSearchQuery(artistName);
      setSelectedMood(null);
    }
  };
  
  // Determine which results to show
  const songsToDisplay = selectedMood ? moodResults : searchResults;
  const hasResults = songsToDisplay.length > 0;
  
  return (
    <div>
      <SearchBar onSearch={handleSearch} className="mb-8" autoFocus />
      
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4">Ruh Haline Göre Filtrele</h3>
        <MoodSelector onSelect={handleMoodSelect} />
      </div>
      
      <Separator className="my-6" />
      
      {isLoading ? (
        <div className="p-10 text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-current border-t-transparent"></div>
          <p className="mt-4 text-muted-foreground">Aranıyor...</p>
        </div>
      ) : (
        <>
          {searchQuery && (
            <h2 className="text-2xl font-bold mb-6">
              "{searchQuery}" için arama sonuçları
            </h2>
          )}
          
          {selectedMood && (
            <h2 className="text-2xl font-bold mb-6">
              "{selectedMood}" ruh hali için sonuçlar
            </h2>
          )}
          
          {!hasResults && !isLoading && (
            <div className="p-10 text-center">
              <p className="text-muted-foreground">
                {searchQuery 
                  ? `"${searchQuery}" için sonuç bulunamadı` 
                  : selectedMood 
                    ? `"${selectedMood}" ruh hali için şarkı bulunamadı` 
                    : 'Aramaya başlamak için yukarıdaki arama çubuğunu kullanın'}
              </p>
            </div>
          )}
          
          {hasResults && (
            <Tabs defaultValue="songs">
              <TabsList className="mb-6">
                <TabsTrigger value="songs">Şarkılar</TabsTrigger>
                {artists.length > 0 && (
                  <TabsTrigger value="artists">Sanatçılar</TabsTrigger>
                )}
              </TabsList>
              
              <TabsContent value="songs">
                <SongTable songs={songsToDisplay} />
              </TabsContent>
              
              {artists.length > 0 && (
                <TabsContent value="artists">
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
                    {artists.map((artist, index) => (
                      <ArtistCard
                        key={index}
                        name={artist.name}
                        imageUrl={artist.imageUrl}
                        onClick={() => handleArtistClick(artist.name)}
                      />
                    ))}
                  </div>
                </TabsContent>
              )}
            </Tabs>
          )}
        </>
      )}
    </div>
  );
};

export default Search;
