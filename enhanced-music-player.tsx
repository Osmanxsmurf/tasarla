import { useEffect, useState, useRef } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, Volume1, VolumeX, Heart, Share2, Music, MoreHorizontal } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Howl } from 'howler';
import { formatDuration } from '@/lib/utils';
import type { Song } from '@shared/schema';
import { DEFAULT_COVER_URL } from '@/lib/constants';
import { addToLibrary, removeFromLibrary, addToRecentlyPlayed } from '@/lib/xata';
import { useToast } from '@/hooks/use-toast';

interface EnhancedMusicPlayerProps {
  currentSong: Song | null;
  isPlaying: boolean;
  onPlayStateChange: (isPlaying: boolean) => void;
}

export function EnhancedMusicPlayer({ currentSong, isPlaying, onPlayStateChange }: EnhancedMusicPlayerProps) {
  const [volume, setVolume] = useState(0.7);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [previousVolume, setPreviousVolume] = useState(0.7);
  const howlerRef = useRef<Howl | null>(null);
  const { toast } = useToast();
  
  // Şarkı değiştiğinde yeni Howl nesnesi oluştur
  useEffect(() => {
    if (currentSong && currentSong.audioUrl) {
      // Önceki Howl nesnesini temizle
      if (howlerRef.current) {
        howlerRef.current.stop();
        howlerRef.current.unload();
      }
      
      setHasError(false);
      setProgress(0);
      
      // Yeni Howl nesnesi oluştur
      const newHowl = new Howl({
        src: [currentSong.audioUrl],
        html5: true,
        volume: volume,
        onload: () => {
          setDuration(newHowl.duration() * 1000);
        },
        onplay: () => {
          onPlayStateChange(true);
          
          // Son çalınanlar listesine ekle
          addToRecentlyPlayed(currentSong.id).catch(err => {
            console.error('Şarkı son çalınanlara eklenirken hata:', err);
          });
          
          // İlerleme çubuğunu güncelle
          requestAnimationFrame(updateProgress);
        },
        onpause: () => {
          onPlayStateChange(false);
        },
        onstop: () => {
          onPlayStateChange(false);
          setProgress(0);
        },
        onend: () => {
          onPlayStateChange(false);
          setProgress(0);
        },
        onloaderror: (id, error) => {
          console.error('Şarkı yüklenirken hata:', error);
          setHasError(true);
          toast({
            title: 'Şarkı Yüklenemedi',
            description: 'Şarkı dosyası yüklenirken bir hata oluştu. Lütfen tekrar deneyin.',
            variant: 'destructive',
          });
        },
        onplayerror: (id, error) => {
          console.error('Şarkı çalınırken hata:', error);
          setHasError(true);
          toast({
            title: 'Oynatma Hatası',
            description: 'Şarkı çalınırken bir hata oluştu. Lütfen tekrar deneyin.',
            variant: 'destructive',
          });
        }
      });
      
      howlerRef.current = newHowl;
      
      // Şarkı otomatik çal
      if (isPlaying) {
        newHowl.play();
      }
      
      return () => {
        if (newHowl) {
          newHowl.stop();
          newHowl.unload();
        }
      };
    }
  }, [currentSong, onPlayStateChange]);
  
  // İlerleme çubuğunu güncelle
  const updateProgress = () => {
    if (howlerRef.current && currentSong) {
      const seek = howlerRef.current.seek() || 0;
      setProgress(seek * 1000);
      
      if (howlerRef.current.playing()) {
        requestAnimationFrame(updateProgress);
      }
    }
  };
  
  // Çal/Duraklat
  const togglePlayPause = () => {
    if (howlerRef.current && currentSong) {
      if (isPlaying) {
        howlerRef.current.pause();
      } else {
        if (hasError) {
          // Hata durumunda yeniden yüklemeyi dene
          howlerRef.current.load();
          setHasError(false);
        }
        howlerRef.current.play();
      }
    }
  };
  
  // Ses seviyesini değiştir
  const handleVolumeChange = (newVolume: number[]) => {
    const value = newVolume[0];
    setVolume(value);
    setPreviousVolume(value);
    setIsMuted(value === 0);
    
    if (howlerRef.current) {
      howlerRef.current.volume(value);
    }
  };
  
  // Sessize alma/açma
  const toggleMute = () => {
    if (isMuted) {
      setVolume(previousVolume);
      setIsMuted(false);
      if (howlerRef.current) {
        howlerRef.current.volume(previousVolume);
      }
    } else {
      setPreviousVolume(volume);
      setVolume(0);
      setIsMuted(true);
      if (howlerRef.current) {
        howlerRef.current.volume(0);
      }
    }
  };
  
  // İlerleme çubuğunda tıklanan konuma gitme
  const handleProgressChange = (newProgress: number[]) => {
    const value = newProgress[0];
    setProgress(value);
    
    if (howlerRef.current && duration > 0) {
      const seconds = (value / 100) * (duration / 1000);
      howlerRef.current.seek(seconds);
      
      if (!isPlaying) {
        togglePlayPause();
      }
    }
  };
  
  // Beğen/Beğenme
  const toggleLike = async () => {
    if (currentSong) {
      try {
        if (isLiked) {
          await removeFromLibrary(currentSong.id);
          setIsLiked(false);
          toast({
            title: 'Beğenilerinizden Kaldırıldı',
            description: 'Şarkı beğenilerinizden kaldırıldı.',
          });
        } else {
          await addToLibrary(currentSong.id);
          setIsLiked(true);
          toast({
            title: 'Beğenilerinize Eklendi',
            description: 'Şarkı beğenilerinize eklendi.',
          });
        }
      } catch (error) {
        console.error('Beğenme işlemi sırasında hata:', error);
        toast({
          title: 'İşlem Hatası',
          description: 'Beğenme işlemi sırasında bir hata oluştu.',
          variant: 'destructive',
        });
      }
    }
  };
  
  // Paylaş (örnek olarak URL kopyalama)
  const handleShare = () => {
    if (currentSong) {
      // Gerçek bir uygulamada burada daha karmaşık bir paylaşma mekanizması olabilir
      navigator.clipboard.writeText(`Dinle: ${currentSong.title} - ${currentSong.artist}`);
      toast({
        title: 'Bağlantı Kopyalandı',
        description: 'Şarkı bilgisi panoya kopyalandı.',
      });
    }
  };
  
  // Küçültme/Büyütme
  const toggleMinimize = () => {
    setMinimized(!minimized);
  };
  
  // Eğer şarkı yoksa basitleştirilmiş boş oynatıcı göster
  if (!currentSong) {
    return (
      <div className="bg-card border-t py-3 px-4 fixed bottom-0 left-0 right-0 z-10">
        <div className="flex items-center justify-center">
          <div className="text-sm text-muted-foreground flex items-center gap-2">
            <Music className="h-4 w-4" />
            <span>Şu anda çalan şarkı yok</span>
          </div>
        </div>
      </div>
    );
  }
  
  // Küçültülmüş oynatıcı
  if (minimized) {
    return (
      <Card className="fixed bottom-4 right-4 z-10 w-64 shadow-lg">
        <CardContent className="p-3">
          <div className="flex items-center gap-3">
            <img
              src={currentSong.coverUrl || DEFAULT_COVER_URL}
              alt={currentSong.title}
              className="h-10 w-10 rounded-md object-cover"
            />
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm truncate">{currentSong.title}</p>
              <p className="text-xs text-muted-foreground truncate">{currentSong.artist}</p>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 text-primary"
              onClick={togglePlayPause}
            >
              {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8"
              onClick={toggleMinimize}
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  // Tam oynatıcı
  const progressPercent = duration > 0 ? (progress / duration) * 100 : 0;
  
  return (
    <div className="bg-card border-t py-3 px-4 fixed bottom-0 left-0 right-0 z-10">
      {/* İlerleme çubuğu */}
      <div className="absolute top-0 left-0 right-0">
        <Progress value={progressPercent} className="h-1 rounded-none" />
      </div>
      
      <div className="flex flex-col sm:flex-row items-center gap-4">
        {/* Albüm kapağı ve şarkı bilgisi */}
        <div className="flex items-center gap-3 w-full sm:w-3/12">
          <img
            src={currentSong.coverUrl || DEFAULT_COVER_URL}
            alt={currentSong.title}
            className="h-12 w-12 rounded-md object-cover"
          />
          <div className="min-w-0">
            <p className="font-medium truncate">{currentSong.title}</p>
            <p className="text-sm text-muted-foreground truncate">{currentSong.artist}</p>
          </div>
        </div>
        
        {/* Oynatma kontrolleri ve zamanlayıcı */}
        <div className="flex flex-col items-center gap-1 w-full sm:w-5/12">
          <div className="flex items-center gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8" disabled>
                    <SkipBack className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Önceki Şarkı</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <Button
              variant="outline" 
              size="icon"
              className="h-10 w-10 rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
              onClick={togglePlayPause}
              disabled={hasError}
            >
              {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 ml-0.5" />}
            </Button>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8" disabled>
                    <SkipForward className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Sonraki Şarkı</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          
          <div className="flex items-center gap-2 text-xs text-muted-foreground w-full">
            <span>{formatDuration(progress)}</span>
            <Slider
              defaultValue={[0]}
              value={[progressPercent]}
              max={100}
              step={0.1}
              className="flex-1"
              disabled={hasError}
              onValueChange={(value) => handleProgressChange(value)}
            />
            <span>{formatDuration(duration)}</span>
          </div>
        </div>
        
        {/* Sağ taraftaki kontroller */}
        <div className="flex items-center gap-3 w-full sm:w-4/12 justify-end">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn("h-8 w-8", isLiked && "text-primary")}
                  onClick={toggleLike}
                >
                  <Heart className="h-4 w-4" fill={isLiked ? "currentColor" : "none"} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{isLiked ? 'Beğenmekten Vazgeç' : 'Beğen'}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={handleShare}
                >
                  <Share2 className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Paylaş</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <div className="flex items-center gap-2 w-24">
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={toggleMute}>
              {isMuted ? (
                <VolumeX className="h-4 w-4" />
              ) : volume < 0.5 ? (
                <Volume1 className="h-4 w-4" />
              ) : (
                <Volume2 className="h-4 w-4" />
              )}
            </Button>
            <Slider
              defaultValue={[0.7]}
              value={[volume]}
              max={1}
              step={0.01}
              className="w-16"
              onValueChange={(value) => handleVolumeChange(value)}
            />
          </div>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 hidden sm:flex"
                  onClick={toggleMinimize}
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Küçült</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </div>
  );
}

// cn yardımcı fonksiyonu
function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}