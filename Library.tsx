import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import SearchBar from '@/components/SearchBar';
import { SongTable } from '@/components/SongTable';
import { fetchUserLibrary, fetchRecentlyPlayed } from '@/lib/xata';

const Library: React.FC = () => {
  // Fetch user's library
  const { data: librarySongs = [], isLoading: isLibraryLoading } = useQuery({
    queryKey: ['/api/library'],
    queryFn: fetchUserLibrary
  });
  
  // Fetch recently played songs
  const { data: recentlyPlayed = [], isLoading: isRecentlyLoading } = useQuery({
    queryKey: ['/api/recently-played'],
    queryFn: fetchRecentlyPlayed
  });
  
  const isLoading = isLibraryLoading || isRecentlyLoading;
  
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Kütüphanem</h1>
      
      <SearchBar className="mb-8" />
      
      {isLoading ? (
        <div className="p-10 text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-current border-t-transparent"></div>
          <p className="mt-4 text-muted-foreground">Yükleniyor...</p>
        </div>
      ) : (
        <Tabs defaultValue="library">
          <TabsList className="mb-6">
            <TabsTrigger value="library">Beğendiklerim</TabsTrigger>
            <TabsTrigger value="recently-played">Son Çalınanlar</TabsTrigger>
          </TabsList>
          
          <TabsContent value="library">
            {librarySongs.length === 0 ? (
              <div className="p-10 text-center">
                <p className="text-muted-foreground">
                  Kütüphanenizde henüz şarkı bulunmuyor.
                </p>
                <p className="mt-2 text-muted-foreground">
                  Şarkıları beğenmek için ♥ düğmesine tıklayın.
                </p>
              </div>
            ) : (
              <SongTable songs={librarySongs} />
            )}
          </TabsContent>
          
          <TabsContent value="recently-played">
            {recentlyPlayed.length === 0 ? (
              <div className="p-10 text-center">
                <p className="text-muted-foreground">
                  Henüz hiç şarkı çalmadınız.
                </p>
              </div>
            ) : (
              <SongTable songs={recentlyPlayed} />
            )}
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default Library;
