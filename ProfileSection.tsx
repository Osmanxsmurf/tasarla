import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Settings, Music, Heart, BarChart2, User, Clock, Edit } from 'lucide-react';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import { CURRENT_USER_ID } from '@/lib/constants';
import { fetchUserLibrary, fetchRecentlyPlayed } from '@/lib/xata';
import type { Song } from '@shared/schema';
import { SongCard } from './SongCard';
import { MusicPlayerContext } from './Layout';

interface UserPreferences {
  favoriteGenres: { name: string; count: number }[];
  favoriteArtists: { name: string; count: number }[];
  totalListenTime: number;
  listenCount: number;
}

export const ProfileSection: React.FC = () => {
  const { playSong } = React.useContext(MusicPlayerContext);
  const [activeTab, setActiveTab] = useState('overview');
  const [libraryStats, setLibraryStats] = useState<{ total: number, recent: number }>({ total: 0, recent: 0 });
  const [recentlyPlayed, setRecentlyPlayed] = useState<Song[]>([]);
  const [library, setLibrary] = useState<Song[]>([]);
  const [userPreferences, setUserPreferences] = useState<UserPreferences>({
    favoriteGenres: [],
    favoriteArtists: [],
    totalListenTime: 0,
    listenCount: 0
  });
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Kütüphane şarkılarını getir
        const libraryData = await fetchUserLibrary();
        setLibrary(libraryData);
        
        // Son çalınanları getir
        const recentData = await fetchRecentlyPlayed();
        setRecentlyPlayed(recentData);
        
        // İstatistikleri hesapla
        calculateUserPreferences(libraryData, recentData);
        
        setLibraryStats({
          total: libraryData.length,
          recent: recentData.length
        });
        
        setLoading(false);
      } catch (error) {
        console.error('Profil verisi yüklenirken hata:', error);
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  const calculateUserPreferences = (libraryData: Song[], recentData: Song[]) => {
    // Tür istatistikleri
    const genreCounts: Record<string, number> = {};
    // Sanatçı istatistikleri
    const artistCounts: Record<string, number> = {};
    // Dinleme süresi (varsayılan şarkı süresi 3 dakika)
    let totalDuration = 0;
    
    // Kütüphane şarkılarını analiz et
    libraryData.forEach(song => {
      // Tür sayısını artır
      if (song.genre) {
        genreCounts[song.genre] = (genreCounts[song.genre] || 0) + 1;
      }
      
      // Sanatçı sayısını artır
      artistCounts[song.artist] = (artistCounts[song.artist] || 0) + 1;
      
      // Toplam süreyi hesapla (milisaniye cinsinden)
      totalDuration += song.duration || 180000; // 3 dakika varsayılan
    });
    
    // Son çalınanları analiz et (her şarkı en az bir kez dinlenmiş)
    recentData.forEach(song => {
      if (song.genre) {
        genreCounts[song.genre] = (genreCounts[song.genre] || 0) + 0.5; // Yarım ağırlık ver
      }
      artistCounts[song.artist] = (artistCounts[song.artist] || 0) + 0.5; // Yarım ağırlık ver
    });
    
    // Sıralı türler
    const favoriteGenres = Object.entries(genreCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
      
    // Sıralı sanatçılar
    const favoriteArtists = Object.entries(artistCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
    
    setUserPreferences({
      favoriteGenres,
      favoriteArtists,
      totalListenTime: Math.floor(totalDuration / 60000), // Dakika cinsinden
      listenCount: recentData.length
    });
  };
  
  // Son dinlenen şarkıların sınırlı sayıda gösterimi
  const limitedRecentlyPlayed = recentlyPlayed.slice(0, 3);
  
  // Formatlanmış dinleme süresi
  const formatListenTime = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes} dakika`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours} saat ${remainingMinutes > 0 ? `${remainingMinutes} dakika` : ''}`;
  };
  
  return (
    <Card className="w-full overflow-hidden">
      <CardHeader className="pb-0">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16 border-2 border-primary">
              <AvatarImage src="/default-avatar.jpg" alt="Profil" />
              <AvatarFallback>
                <User className="h-8 w-8" />
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-xl font-bold">Osman Özdoğan</CardTitle>
              <CardDescription className="text-sm flex items-center gap-1 mt-1">
                <Clock className="w-3 h-3" />
                Katılma: {format(new Date(2023, 4, 15), 'd MMMM yyyy', { locale: tr })}
              </CardDescription>
            </div>
          </div>
          <Button variant="ghost" size="icon" className="rounded-full">
            <Edit className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="pt-6">
        <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full mb-4">
            <TabsTrigger value="overview" className="flex-1 gap-1.5">
              <BarChart2 className="w-4 h-4" /> Genel Bakış
            </TabsTrigger>
            <TabsTrigger value="library" className="flex-1 gap-1.5">
              <Heart className="w-4 h-4" /> Kütüphane
            </TabsTrigger>
            <TabsTrigger value="history" className="flex-1 gap-1.5">
              <Clock className="w-4 h-4" /> Geçmiş
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex-1 gap-1.5">
              <Settings className="w-4 h-4" /> Ayarlar
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-6">
            {loading ? (
              <div className="text-center py-8">
                <Music className="w-12 h-12 text-primary/30 mx-auto animate-pulse" />
                <p className="text-muted-foreground mt-2">Profil verileri yükleniyor...</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-card rounded-lg border p-4 text-center">
                    <p className="text-3xl font-bold">{libraryStats.total}</p>
                    <p className="text-xs text-muted-foreground">Kütüphanede</p>
                  </div>
                  <div className="bg-card rounded-lg border p-4 text-center">
                    <p className="text-3xl font-bold">{userPreferences.listenCount}</p>
                    <p className="text-xs text-muted-foreground">Dinlenen</p>
                  </div>
                  <div className="bg-card rounded-lg border p-4 text-center">
                    <p className="text-3xl font-bold">{formatListenTime(userPreferences.totalListenTime).split(' ')[0]}</p>
                    <p className="text-xs text-muted-foreground">Saat Dinlendi</p>
                  </div>
                  <div className="bg-card rounded-lg border p-4 text-center">
                    <p className="text-3xl font-bold">{userPreferences.favoriteGenres.length > 0 ? userPreferences.favoriteGenres[0].name : '-'}</p>
                    <p className="text-xs text-muted-foreground">Favori Tür</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Favori Türler */}
                  <div className="space-y-3">
                    <h3 className="text-sm font-medium flex items-center gap-2">
                      <Music className="w-4 h-4 text-primary" />
                      Favori Türler
                    </h3>
                    <div className="space-y-2.5">
                      {userPreferences.favoriteGenres.map((genre, index) => (
                        <div key={index} className="space-y-1">
                          <div className="flex items-center justify-between text-sm">
                            <span className="capitalize">{genre.name}</span>
                            <span className="text-xs text-muted-foreground">{Math.round(genre.count)} şarkı</span>
                          </div>
                          <Progress 
                            value={genre.count / (userPreferences.favoriteGenres[0]?.count || 1) * 100} 
                            className="h-1.5" 
                          />
                        </div>
                      ))}
                      {userPreferences.favoriteGenres.length === 0 && (
                        <p className="text-sm text-muted-foreground">Henüz yeterli veri yok</p>
                      )}
                    </div>
                  </div>
                  
                  {/* Favori Sanatçılar */}
                  <div className="space-y-3">
                    <h3 className="text-sm font-medium flex items-center gap-2">
                      <User className="w-4 h-4 text-primary" />
                      Favori Sanatçılar
                    </h3>
                    <div className="space-y-2">
                      {userPreferences.favoriteArtists.map((artist, index) => (
                        <Badge key={index} variant="outline" className="mr-2 mb-2">
                          {artist.name}
                        </Badge>
                      ))}
                      {userPreferences.favoriteArtists.length === 0 && (
                        <p className="text-sm text-muted-foreground">Henüz yeterli veri yok</p>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Son Dinlenenler */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <h3 className="text-sm font-medium flex items-center gap-2">
                      <Clock className="w-4 h-4 text-primary" />
                      Son Dinlenenler
                    </h3>
                    {recentlyPlayed.length > 3 && (
                      <Button variant="link" size="sm" className="text-xs p-0 h-auto">
                        Tümünü Gör
                      </Button>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {limitedRecentlyPlayed.map((song) => (
                      <SongCard
                        key={song.id}
                        song={song}
                        onClick={() => playSong(song)}
                        isCompact
                      />
                    ))}
                    {limitedRecentlyPlayed.length === 0 && (
                      <p className="text-sm text-muted-foreground col-span-3">
                        Henüz hiç şarkı dinlemediniz
                      </p>
                    )}
                  </div>
                </div>
              </>
            )}
          </TabsContent>
          
          <TabsContent value="library" className="min-h-[200px]">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Kütüphanem</h3>
                <Badge variant="outline">{libraryStats.total} şarkı</Badge>
              </div>
              
              {loading ? (
                <div className="text-center py-12">
                  <Heart className="w-12 h-12 text-primary/30 mx-auto animate-pulse" />
                  <p className="text-muted-foreground mt-2">Kütüphane yükleniyor...</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {library.slice(0, 6).map((song) => (
                    <SongCard
                      key={song.id}
                      song={song}
                      onClick={() => playSong(song)}
                    />
                  ))}
                  {library.length === 0 && (
                    <p className="text-sm text-muted-foreground col-span-3 py-8 text-center">
                      Kütüphanenizde henüz şarkı bulunmuyor
                    </p>
                  )}
                </div>
              )}
              
              {library.length > 6 && (
                <div className="text-center mt-6">
                  <Button variant="outline">Daha Fazla Göster</Button>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="history" className="min-h-[200px]">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Dinleme Geçmişi</h3>
                <Badge variant="outline">{recentlyPlayed.length} şarkı</Badge>
              </div>
              
              {loading ? (
                <div className="text-center py-12">
                  <Clock className="w-12 h-12 text-primary/30 mx-auto animate-pulse" />
                  <p className="text-muted-foreground mt-2">Geçmiş yükleniyor...</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentlyPlayed.map((song, index) => (
                    <div key={song.id} className="flex items-center space-x-4 border-b pb-2">
                      <div className="text-lg font-medium text-muted-foreground">{index + 1}</div>
                      <SongCard
                        song={song}
                        onClick={() => playSong(song)}
                        isCompact
                      />
                    </div>
                  ))}
                  {recentlyPlayed.length === 0 && (
                    <p className="text-sm text-muted-foreground py-8 text-center">
                      Henüz dinleme geçmişiniz bulunmuyor
                    </p>
                  )}
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="settings" className="min-h-[200px]">
            <div className="space-y-6">
              <div className="space-y-3">
                <h3 className="text-lg font-medium">Hesap Ayarları</h3>
                <p className="text-sm text-muted-foreground">
                  Profil bilgilerinizi düzenleyin ve tercihlerinizi ayarlayın
                </p>
                
                <div className="bg-card rounded-lg border p-4 mt-4">
                  <p className="text-sm">Bu özellik yakında kullanıma sunulacak.</p>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      
      <CardFooter className="flex justify-end border-t pt-4">
        <Button variant="ghost" size="sm">Profili Düzenle</Button>
      </CardFooter>
    </Card>
  );
};