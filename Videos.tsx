import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { YouTubePlayer } from '@/components/YouTubePlayer';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { searchYouTube, type YoutubeSearchResult } from '@/lib/youtube-api';
import { getTopTracksByTag } from '@/lib/lastfm-api';
import { Search, Music, Play, TrendingUp, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function VideosPage() {
  const [activeTab, setActiveTab] = useState<string>('discover');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchResults, setSearchResults] = useState<YoutubeSearchResult[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<YoutubeSearchResult | null>(null);
  const [topGenres, setTopGenres] = useState<string[]>([
    'pop', 'rock', 'hip hop', 'electronic', 'jazz', 'classical', 'r&b', 'indie'
  ]);
  const [selectedGenre, setSelectedGenre] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [apiRequestCount, setApiRequestCount] = useState<number>(0);
  const { toast } = useToast();
  
  // API istek limitini ayarla
  const API_REQUEST_LIMIT = 10;
  
  // Sayfa başlığını ayarla
  document.title = 'Videolar - Müzik Asistanım';
  
  // Arama işlemi
  const handleSearch = async () => {
    if (!searchQuery.trim() || apiRequestCount >= API_REQUEST_LIMIT) return;
    
    setIsLoading(true);
    
    try {
      // API istek sayısını artır
      setApiRequestCount(prevCount => prevCount + 1);
      
      // YouTube araması yap
      const results = await searchYouTube(searchQuery, 8);
      setSearchResults(results);
      
      // İlk sonucu otomatik seç
      if (results.length > 0) {
        setSelectedVideo(results[0]);
      }
      
      // Arama sekmesine geç
      setActiveTab('search');
    } catch (error) {
      console.error('Video arama hatası:', error);
      toast({
        title: 'Arama Hatası',
        description: 'Videolar aranırken bir sorun oluştu.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Tür seçildiğinde
  const handleGenreSelect = async (genre: string) => {
    if (apiRequestCount >= API_REQUEST_LIMIT) {
      toast({
        title: 'API Sınırı',
        description: 'YouTube API kullanım sınırına ulaşıldı. Lütfen daha sonra tekrar deneyin.',
        variant: 'destructive',
      });
      return;
    }
    
    setSelectedGenre(genre);
    setSearchQuery(`${genre} music`);
    
    try {
      setIsLoading(true);
      
      // API istek sayısını artır
      setApiRequestCount(prevCount => prevCount + 1);
      
      // YouTube araması yap
      const results = await searchYouTube(`${genre} music`, 8);
      setSearchResults(results);
      
      // İlk sonucu otomatik seç
      if (results.length > 0) {
        setSelectedVideo(results[0]);
      }
      
      // Arama sekmesine geç
      setActiveTab('search');
    } catch (error) {
      console.error('Tür videolarını alma hatası:', error);
      toast({
        title: 'Video Yükleme Hatası',
        description: `${genre} türündeki videolar yüklenirken bir sorun oluştu.`,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Video seçildiğinde
  const handleVideoSelect = (video: YoutubeSearchResult) => {
    setSelectedVideo(video);
  };
  
  // API istek sayısını kontrol et
  useEffect(() => {
    if (apiRequestCount >= API_REQUEST_LIMIT) {
      toast({
        title: 'API Kullanım Sınırı',
        description: 'YouTube API kullanım kotası doldu. Bazı özellikler kısıtlanabilir.',
        variant: 'destructive',
      });
    }
  }, [apiRequestCount, toast]);
  
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Müzik Videoları</h1>
          <p className="text-muted-foreground">
            YouTube üzerinden müzik videoları keşfedin ve oynatın
          </p>
        </div>
        
        {/* Arama Çubuğu */}
        <div className="flex gap-2 mb-6">
          <Input
            type="text"
            placeholder="Video veya şarkı ara..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            className="flex-1"
          />
          <Button 
            onClick={handleSearch} 
            disabled={isLoading || !searchQuery.trim() || apiRequestCount >= API_REQUEST_LIMIT}
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Aranıyor
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Search className="h-4 w-4" />
                Ara
              </span>
            )}
          </Button>
        </div>
        
        {/* Ana İçerik Bölümü */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sol Kolon - Seçilen Video Player */}
          <div className="lg:col-span-2">
            {selectedVideo ? (
              <YouTubePlayer 
                videoId={selectedVideo.id} 
                autoplay={true}
                showRelated={true}
                onVideoSelected={handleVideoSelect}
              />
            ) : (
              <Card className="w-full">
                <CardContent className="p-8 flex flex-col items-center justify-center">
                  <Music className="h-16 w-16 text-muted-foreground mb-4" />
                  <h3 className="text-xl font-medium mb-2">Video seçilmedi</h3>
                  <p className="text-muted-foreground text-center">
                    Bir video izlemek için arama yapın veya önerilen bir videoyu seçin
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
          
          {/* Sağ Kolon - Sekme İçeriği */}
          <div className="space-y-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="w-full">
                <TabsTrigger value="discover" className="flex-1 gap-1">
                  <Sparkles className="h-4 w-4" /> Keşfet
                </TabsTrigger>
                <TabsTrigger value="search" className="flex-1 gap-1">
                  <Search className="h-4 w-4" /> Arama
                </TabsTrigger>
                <TabsTrigger value="trending" className="flex-1 gap-1">
                  <TrendingUp className="h-4 w-4" /> Trendler
                </TabsTrigger>
              </TabsList>
              
              {/* Keşfet Sekmesi */}
              <TabsContent value="discover" className="space-y-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle>Müzik Türleri</CardTitle>
                    <CardDescription>Bir tür seçerek ilgili videoları keşfedin</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {topGenres.map((genre) => (
                        <Badge 
                          key={genre} 
                          variant={selectedGenre === genre ? "default" : "outline"}
                          className="cursor-pointer capitalize py-1 px-3"
                          onClick={() => handleGenreSelect(genre)}
                        >
                          {genre}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle>Önerilen Videolar</CardTitle>
                    <CardDescription>Size özel müzik videoları</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <p className="text-sm text-muted-foreground">
                      Türk müziği, rock veya pop müzik videoları keşfetmek için üstteki türlerden birini seçin.
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>
              
              {/* Arama Sekmesi */}
              <TabsContent value="search" className="space-y-4">
                {searchResults.length > 0 ? (
                  <div className="space-y-3">
                    <h3 className="text-lg font-medium">Arama Sonuçları</h3>
                    <div className="space-y-3">
                      {searchResults.map((video) => (
                        <Card 
                          key={video.id} 
                          className={`overflow-hidden cursor-pointer hover:ring-1 transition-all ${
                            selectedVideo?.id === video.id ? 'ring-2 ring-primary' : 'ring-primary/20'
                          }`}
                          onClick={() => handleVideoSelect(video)}
                        >
                          <div className="flex">
                            <div className="relative w-36 h-20">
                              <img 
                                src={video.thumbnailUrl} 
                                alt={video.title} 
                                className="w-full h-full object-cover"
                              />
                              <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                                <Play className="h-8 w-8 text-white" />
                              </div>
                            </div>
                            <div className="p-3 flex-1 overflow-hidden">
                              <h4 className="font-medium text-sm line-clamp-2">{video.title}</h4>
                              <p className="text-xs text-muted-foreground mt-1">{video.channelTitle}</p>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>
                ) : (
                  <Card>
                    <CardContent className="p-6 text-center">
                      <Search className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                      <h3 className="text-lg font-medium mb-2">Sonuç Bulunamadı</h3>
                      <p className="text-muted-foreground">
                        Henüz bir arama yapmadınız veya aramanız için bir sonuç bulunamadı.
                      </p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
              
              {/* Trendler Sekmesi */}
              <TabsContent value="trending" className="space-y-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle>Trend Videolar</CardTitle>
                    <CardDescription>Şu anda popüler olan müzik videoları</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground text-center py-4">
                      Trend video araması yapmak için, arama kutusuna "trending music" yazıp arama yapabilirsiniz.
                    </p>
                    <Button 
                      variant="outline" 
                      className="w-full" 
                      onClick={() => {
                        setSearchQuery('trending music');
                        handleSearch();
                      }}
                      disabled={apiRequestCount >= API_REQUEST_LIMIT}
                    >
                      <TrendingUp className="h-4 w-4 mr-2" />
                      Trend Videoları Göster
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
            
            {/* API Kullanım Uyarısı */}
            {apiRequestCount >= API_REQUEST_LIMIT && (
              <Card className="bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800">
                <CardContent className="p-4">
                  <p className="text-sm text-yellow-800 dark:text-yellow-400">
                    <strong>Not:</strong> YouTube API kullanım sınırına ulaşıldı. Bazı özellikler kısıtlanabilir.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}