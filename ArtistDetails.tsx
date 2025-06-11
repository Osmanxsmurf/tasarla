import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { Music, User, Tag, ExternalLink, Users, Info } from 'lucide-react';
import { getArtistInfo, getSimilarTracks, type LastfmArtist } from '@/lib/lastfm-api';
import { SongCard } from './SongCard';
import { MusicPlayerContext } from './Layout';
import type { Song } from '@shared/schema';
import { fetchSongsByArtist } from '@/lib/xata';
import { useToast } from '@/hooks/use-toast';

interface ArtistDetailsProps {
  artistName: string;
  className?: string;
}

export function ArtistDetails({ artistName, className }: ArtistDetailsProps) {
  const { playSong } = React.useContext(MusicPlayerContext);
  const [artistInfo, setArtistInfo] = useState<LastfmArtist | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [songs, setSongs] = useState<Song[]>([]);
  const { toast } = useToast();
  
  // Sanatçı bilgilerini yükle
  useEffect(() => {
    const loadArtistInfo = async () => {
      if (!artistName) return;
      
      setLoading(true);
      setError(null);
      
      try {
        // Last.fm'den sanatçı bilgilerini al
        const info = await getArtistInfo(artistName);
        setArtistInfo(info);
        
        // Veritabanından sanatçının şarkılarını al
        const artistSongs = await fetchSongsByArtist(artistName);
        setSongs(artistSongs);
      } catch (err) {
        console.error('Sanatçı bilgileri yüklenirken hata:', err);
        setError('Sanatçı bilgileri yüklenirken bir hata oluştu.');
        toast({
          title: 'Yükleme Hatası',
          description: 'Sanatçı bilgileri yüklenirken bir sorun oluştu.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };
    
    loadArtistInfo();
  }, [artistName, toast]);
  
  // HTML içeriğini düzeltme
  const cleanHtml = (html: string) => {
    return html
      .replace(/<a\s+href="[^"]*">/g, '')
      .replace(/<\/a>/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  };
  
  // Yükleme gösterimi
  if (loading) {
    return (
      <Card className={className}>
        <CardContent className="p-6">
          <div className="flex gap-4 items-center mb-6">
            <Skeleton className="h-24 w-24 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-32" />
            </div>
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        </CardContent>
      </Card>
    );
  }
  
  // Hata gösterimi
  if (error || !artistInfo) {
    return (
      <Card className={className}>
        <CardContent className="p-6 text-center">
          <div className="text-destructive mb-4">
            <User className="h-16 w-16 mx-auto mb-2" />
            <p>{error || 'Sanatçı bilgileri bulunamadı.'}</p>
          </div>
          <Button variant="outline" onClick={() => window.history.back()}>
            Geri Dön
          </Button>
        </CardContent>
      </Card>
    );
  }
  
  // İstatistik sayılarını formatla
  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };
  
  return (
    <Card className={className}>
      <CardHeader className="pb-0">
        <div className="flex flex-col sm:flex-row gap-4 items-center sm:items-start">
          <Avatar className="h-24 w-24 rounded-full border-2 border-primary">
            <AvatarImage src={artistInfo.imageUrl} alt={artistInfo.name} />
            <AvatarFallback>
              <User className="h-12 w-12" />
            </AvatarFallback>
          </Avatar>
          <div className="text-center sm:text-left">
            <CardTitle className="text-2xl font-bold mb-1">{artistInfo.name}</CardTitle>
            <CardDescription>
              <div className="flex flex-wrap justify-center sm:justify-start gap-2 mt-2">
                {artistInfo.tags.slice(0, 5).map((tag) => (
                  <Badge key={tag} variant="outline" className="capitalize">
                    {tag}
                  </Badge>
                ))}
              </div>
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-6">
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="w-full mb-4">
            <TabsTrigger value="overview" className="flex-1 gap-1.5">
              <Info className="w-4 h-4" /> Bilgiler
            </TabsTrigger>
            <TabsTrigger value="songs" className="flex-1 gap-1.5">
              <Music className="w-4 h-4" /> Şarkılar
            </TabsTrigger>
            <TabsTrigger value="similar" className="flex-1 gap-1.5">
              <Users className="w-4 h-4" /> Benzer Sanatçılar
            </TabsTrigger>
          </TabsList>
          
          {/* Genel Bilgiler */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
              <div className="bg-card rounded-lg border p-4 text-center">
                <p className="text-xl font-bold">{formatNumber(artistInfo.listeners)}</p>
                <p className="text-xs text-muted-foreground">Dinleyici</p>
              </div>
              <div className="bg-card rounded-lg border p-4 text-center">
                <p className="text-xl font-bold">{formatNumber(artistInfo.playcount)}</p>
                <p className="text-xs text-muted-foreground">Çalınma</p>
              </div>
              <div className="bg-card rounded-lg border p-4 text-center">
                <p className="text-xl font-bold">{songs.length}</p>
                <p className="text-xs text-muted-foreground">Şarkı</p>
              </div>
              <div className="bg-card rounded-lg border p-4 text-center">
                <p className="text-xl font-bold">{artistInfo.similar.length}</p>
                <p className="text-xs text-muted-foreground">Benzer Sanatçı</p>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-2">Hakkında</h3>
              <div className="text-sm text-muted-foreground">
                {artistInfo.summary ? (
                  <p>{cleanHtml(artistInfo.summary)}</p>
                ) : (
                  <p>Bu sanatçı hakkında bilgi bulunmuyor.</p>
                )}
                
                {artistInfo.url && (
                  <Button
                    variant="link"
                    className="p-0 h-auto text-primary flex items-center gap-1 mt-2"
                    onClick={() => window.open(artistInfo.url, '_blank')}
                  >
                    <ExternalLink className="h-3 w-3" />
                    <span className="text-xs">Last.fm'de Görüntüle</span>
                  </Button>
                )}
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-2">Popüler Türler</h3>
              <div className="flex flex-wrap gap-2">
                {artistInfo.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="capitalize">
                    <Tag className="h-3 w-3 mr-1" />
                    {tag}
                  </Badge>
                ))}
                {artistInfo.tags.length === 0 && (
                  <p className="text-sm text-muted-foreground">Tür bilgisi bulunamadı.</p>
                )}
              </div>
            </div>
          </TabsContent>
          
          {/* Şarkılar */}
          <TabsContent value="songs" className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {songs.map((song) => (
                <SongCard
                  key={song.id}
                  song={song}
                  onClick={() => playSong(song)}
                  isCompact
                />
              ))}
              {songs.length === 0 && (
                <div className="col-span-full text-center py-8">
                  <Music className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                  <p className="text-muted-foreground">Bu sanatçı için şarkı bulunamadı.</p>
                </div>
              )}
            </div>
          </TabsContent>
          
          {/* Benzer Sanatçılar */}
          <TabsContent value="similar" className="space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {artistInfo.similar.map((artist, index) => (
                <Card key={index} className="overflow-hidden hover:ring-1 ring-primary/20 transition-all cursor-pointer">
                  <div className="p-4 text-center">
                    <Avatar className="h-20 w-20 mx-auto mb-3">
                      <AvatarImage src={artist.imageUrl} alt={artist.name} />
                      <AvatarFallback>
                        <User className="h-8 w-8" />
                      </AvatarFallback>
                    </Avatar>
                    <h4 className="font-medium text-sm truncate">{artist.name}</h4>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-2 w-full text-xs"
                      onClick={() => window.open(artist.url, '_blank')}
                    >
                      <ExternalLink className="h-3 w-3 mr-1" />
                      Profili Görüntüle
                    </Button>
                  </div>
                </Card>
              ))}
              {artistInfo.similar.length === 0 && (
                <div className="col-span-full text-center py-8">
                  <Users className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                  <p className="text-muted-foreground">Benzer sanatçı bulunamadı.</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      
      <CardFooter className="flex justify-center border-t pt-4">
        <a 
          href={artistInfo.url} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-xs text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
        >
          <img src="https://www.last.fm/static/images/lastfm_logo_16.png" alt="Last.fm" className="h-3" />
          Last.fm'den Veriler
        </a>
      </CardFooter>
    </Card>
  );
}