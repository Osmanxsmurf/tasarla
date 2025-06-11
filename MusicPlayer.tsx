import React, { useState, useEffect } from 'react';
import { useMusic } from '@/contexts/MusicContext';
import { cn } from '@/lib/utils';
import { Song } from '@/lib/data';
import { YouTubeEmbed } from './YouTubeEmbed';
import { searchYouTube, createSearchQuery } from '@/lib/youtube';
import { DEFAULT_COVER_URL } from '@/lib/constants';
// Icon bileşeni gerekli değil, SVG'leri doğrudan kullanıyoruz

interface MusicPlayerProps {
  className?: string;
}

export function MusicPlayer({ className }: MusicPlayerProps) {
  const { currentSong, isPlaying, playNextSong, playPreviousSong, togglePlay } = useMusic();
  const [videoId, setVideoId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [playerState, setPlayerState] = useState<'playing' | 'paused' | 'loading' | 'error'>('paused');
  const [volume, setVolume] = useState(80);

  // Şarkı değiştiğinde YouTube'dan videoyu ara
  useEffect(() => {
    if (!currentSong) return;
    
    async function findVideo() {
      setLoading(true);
      setPlayerState('loading');
      
      try {
        // YouTube'da arama yap
        const query = createSearchQuery(currentSong.title || currentSong.name, currentSong.artist || currentSong.artist?.name);
        const results = await searchYouTube(query, 1);
        
        if (results.length > 0) {
          setVideoId(results[0].videoId);
          setPlayerState(isPlaying ? 'playing' : 'paused');
        } else {
          console.error('Şarkı için video bulunamadı');
          setPlayerState('error');
        }
      } catch (error) {
        console.error('Video arama hatası:', error);
        setPlayerState('error');
      } finally {
        setLoading(false);
      }
    }
    
    findVideo();
  }, [currentSong]);
  
  // Şarkı çalma durumu değiştiğinde
  useEffect(() => {
    setPlayerState(isPlaying ? 'playing' : 'paused');
  }, [isPlaying]);

  // Player durumu değiştiğinde
  const handlePlayerStateChange = (state: string) => {
    if (state === 'ended') {
      playNextSong();
    } else if (state === 'playing') {
      setPlayerState('playing');
    } else if (state === 'paused') {
      setPlayerState('paused');
    }
  };
  
  // Ses seviyesi değiştiğinde
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVolume(parseInt(e.target.value));
  };
  
  if (!currentSong) {
    return (
      <div className={cn("bg-card shadow-lg rounded-lg p-4 flex flex-col items-center justify-center text-center h-64", className)}>
        <div className="text-muted-foreground">
          <p>Şu anda çalan şarkı yok</p>
          <p className="text-sm mt-2">Bir şarkı seçerek dinlemeye başlayabilirsiniz.</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className={cn("bg-card shadow-lg rounded-lg p-4", className)}>
      <div className="flex flex-col md:flex-row gap-4">
        {/* Şarkı bilgileri ve kapak resmi */}
        <div className="flex flex-col md:w-1/3">
          <div className="aspect-square bg-muted rounded-lg overflow-hidden">
            {currentSong.imageUrl ? (
              <img 
                src={currentSong.imageUrl} 
                alt={`${currentSong.title || currentSong.name} kapak resmi`}
                className="w-full h-full object-cover"
              />
            ) : (
              <img 
                src={DEFAULT_COVER_URL}
                alt="Varsayılan kapak resmi"
                className="w-full h-full object-cover"
              />
            )}
          </div>
          
          <div className="mt-4">
            <h3 className="text-lg font-semibold truncate">{currentSong.title || currentSong.name}</h3>
            <p className="text-muted-foreground truncate">{currentSong.artist || currentSong.artist?.name}</p>
            {currentSong.album && (
              <p className="text-sm text-muted-foreground truncate mt-1">{currentSong.album}</p>
            )}
          </div>
        </div>
        
        {/* Video oynatıcı */}
        <div className="flex-1">
          {videoId ? (
            <div className="relative aspect-video rounded-lg overflow-hidden bg-black">
              <YouTubeEmbed 
                videoId={videoId}
                onStateChange={handlePlayerStateChange}
                autoplay={isPlaying}
              />
              
              {loading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                  <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
                </div>
              )}
              
              {playerState === 'error' && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/70 text-white">
                  <div className="text-center p-4">
                    <p>Video yüklenemedi</p>
                    <button 
                      onClick={() => playNextSong()}
                      className="mt-2 px-4 py-2 bg-primary text-primary-foreground rounded-md"
                    >
                      Sonraki şarkıya geç
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="aspect-video rounded-lg bg-muted flex items-center justify-center">
              <div className="animate-pulse">
                <p className="text-muted-foreground">Video yükleniyor...</p>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Kontroller */}
      <div className="mt-4">
        <div className="flex items-center justify-between">
          {/* Ses seviyesi */}
          <div className="flex items-center space-x-2">
            <button 
              className="p-2 rounded-full hover:bg-muted text-foreground"
              onClick={() => setVolume(prev => (prev > 0 ? 0 : 80))}
            >
              {volume === 0 ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M11 5 6 9H2v6h4l5 4V5Z"/>
                  <path d="M23 9l-6 6"/>
                  <path d="m17 9 6 6"/>
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M11 5 6 9H2v6h4l5 4V5Z"/>
                  <path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>
                  <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>
                </svg>
              )}
            </button>
            <input 
              type="range" 
              min="0" 
              max="100" 
              value={volume} 
              onChange={handleVolumeChange}
              className="w-24 h-2 bg-muted rounded-lg appearance-none cursor-pointer"
            />
          </div>
          
          {/* Oynatma kontrolleri */}
          <div className="flex items-center space-x-4">
            <button 
              className="p-3 rounded-full hover:bg-muted text-foreground"
              onClick={playPreviousSong}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m11 17-5-5 5-5"/>
                <path d="m18 17-5-5 5-5"/>
              </svg>
            </button>
            
            <button 
              className="p-3 rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
              onClick={togglePlay}
            >
              {playerState === 'playing' ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="6" y="4" width="4" height="16"/>
                  <rect x="14" y="4" width="4" height="16"/>
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="5 3 19 12 5 21 5 3"/>
                </svg>
              )}
            </button>
            
            <button 
              className="p-3 rounded-full hover:bg-muted text-foreground"
              onClick={playNextSong}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m13 17 5-5-5-5"/>
                <path d="m6 17 5-5-5-5"/>
              </svg>
            </button>
          </div>
          
          {/* Tam ekran veya kapama kontrolleri */}
          <div>
            <button className="p-2 rounded-full hover:bg-muted text-foreground">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 3h6v6"/>
                <path d="M9 21H3v-6"/>
                <path d="m21 3-7 7"/>
                <path d="m3 21 7-7"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}