import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { ArtistDetails } from '@/components/ArtistDetails';
import { useLocation } from 'wouter';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import { getArtistInfo, type LastfmArtist } from '@/lib/lastfm-api';
import { useToast } from '@/hooks/use-toast';

export default function ArtistPage() {
  const [, setLocation] = useLocation();
  const [artistName, setArtistName] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { toast } = useToast();
  
  // Sayfa başlığını ayarla
  document.title = artistName ? `${artistName} - Müzik Asistanım` : 'Sanatçı - Müzik Asistanım';
  
  // URL'den sanatçı adını al
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const name = params.get('name');
    
    if (name) {
      setArtistName(decodeURIComponent(name));
      setSearchQuery(decodeURIComponent(name));
    }
  }, []);
  
  // Arama işlemi
  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    if (!searchQuery.trim()) return;
    
    setIsLoading(true);
    
    try {
      // Last.fm'den sanatçı bilgilerini al (sanatçı varlığını kontrol etmek için)
      const info = await getArtistInfo(searchQuery);
      
      if (info) {
        // Sanatçı adını URL'e ekle ve sayfayı yeniden yükle
        setLocation(`/artist?name=${encodeURIComponent(searchQuery)}`);
        setArtistName(searchQuery);
      } else {
        toast({
          title: 'Sanatçı Bulunamadı',
          description: `"${searchQuery}" adında bir sanatçı bulunamadı.`,
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Sanatçı arama hatası:', error);
      toast({
        title: 'Arama Hatası',
        description: 'Sanatçı aranırken bir sorun oluştu.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Sanatçı Bilgileri</h1>
          <p className="text-muted-foreground">
            Sanatçılar hakkında detaylı bilgiler, şarkılar ve benzer sanatçılar
          </p>
        </div>
        
        {/* Arama formu */}
        <form onSubmit={handleSearch} className="flex gap-2 mb-8">
          <Input
            type="text"
            placeholder="Sanatçı adı ara..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1"
          />
          <Button type="submit" disabled={isLoading || !searchQuery.trim()}>
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
        </form>
        
        {/* Sanatçı detayları */}
        {artistName ? (
          <ArtistDetails artistName={artistName} />
        ) : (
          <div className="text-center py-12 bg-card rounded-lg border">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-muted-foreground mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <circle cx="12" cy="8" r="5" strokeWidth="2" />
              <path strokeWidth="2" d="M20 21v-2a8 8 0 0 0-16 0v2" />
            </svg>
            <h2 className="text-xl font-medium mb-2">Sanatçı Bilgisi</h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              Bir sanatçı hakkında detaylı bilgileri görmek için yukarıdaki arama kutusunu kullanın. 
              Sanatçı adını yazıp arama yapın.
            </p>
          </div>
        )}
        
        {/* Popüler sanatçılar öneri listesi eklenebilir */}
      </div>
    </Layout>
  );
}