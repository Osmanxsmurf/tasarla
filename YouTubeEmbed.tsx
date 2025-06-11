import React, { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { getEmbedUrl } from '@/lib/youtube';

// Global değişkenleri tanıma
declare global {
  interface Window {
    onYouTubeIframeAPIReady: () => void;
    YT: any;
  }
}

// Player durumları
type PlayerState = 'unstarted' | 'ended' | 'playing' | 'paused' | 'buffering' | 'cued' | 'ready';

interface YouTubeEmbedProps {
  videoId: string;
  className?: string;
  width?: string;
  height?: string;
  onStateChange?: (state: PlayerState) => void;
  onReady?: () => void;
  onError?: (error: number) => void;
  autoplay?: boolean;
  controls?: boolean;
  rel?: boolean;
  showInfo?: boolean;
  aspectRatio?: boolean;
}

export const YouTubeEmbed: React.FC<YouTubeEmbedProps> = ({
  videoId,
  className = '',
  width = '100%',
  height = '100%',
  onStateChange,
  onReady,
  onError,
  autoplay = false,
  controls = true,
  rel = false,
  showInfo = true,
  aspectRatio = true,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<any>(null);
  const [apiLoaded, setApiLoaded] = useState(false);
  const [playerReady, setPlayerReady] = useState(false);

  // API durumunun kod tarafından belirlenmesi 
  const getPlayerState = (stateCode: number): PlayerState => {
    switch (stateCode) {
      case -1: return 'unstarted';
      case 0: return 'ended';
      case 1: return 'playing';
      case 2: return 'paused';
      case 3: return 'buffering';
      case 5: return 'cued';
      default: return 'ready';
    }
  };

  // YouTube API yükleme
  useEffect(() => {
    // API zaten varsa tekrar yükleme
    if (window.YT && window.YT.Player) {
      setApiLoaded(true);
      return;
    }

    // API yok, yükleme yapılacak
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';

    window.onYouTubeIframeAPIReady = () => {
      setApiLoaded(true);
    };

    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

    return () => {
      window.onYouTubeIframeAPIReady = () => {};
    };
  }, []);

  // Player oluşturma
  useEffect(() => {
    if (!apiLoaded || !containerRef.current) return;

    const containerId = containerRef.current.id;

    // Durumları yönetecek handler
    const onPlayerStateChange = (event: any) => {
      const newState = getPlayerState(event.data);
      onStateChange?.(newState);
    };

    // Player hazır olduğunda
    const onPlayerReady = (event: any) => {
      setPlayerReady(true);
      onReady?.();
    };

    // Player hata verdiğinde
    const onPlayerError = (event: any) => {
      onError?.(event.data);
    };

    // Player'ı oluştur
    playerRef.current = new window.YT.Player(containerId, {
      width,
      height,
      videoId,
      playerVars: {
        autoplay: autoplay ? 1 : 0,
        controls: controls ? 1 : 0,
        rel: rel ? 1 : 0,
        showinfo: showInfo ? 1 : 0,
        modestbranding: 1,
      },
      events: {
        onReady: onPlayerReady,
        onStateChange: onPlayerStateChange,
        onError: onPlayerError,
      },
    });

    // Komponent ayrıldığında player'ı temizle
    return () => {
      if (playerRef.current) {
        playerRef.current.destroy();
      }
    };
  }, [apiLoaded, videoId]);

  // Video ID değiştiğinde
  useEffect(() => {
    if (playerReady && playerRef.current) {
      playerRef.current.loadVideoById(videoId);
    }
  }, [videoId]);

  // Benzersiz ID oluştur
  const uniqueId = `youtube-player-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className={cn(
      "relative overflow-hidden", 
      aspectRatio && "aspect-video",
      className
    )}>
      <div
        id={uniqueId}
        ref={containerRef}
        className="absolute inset-0 w-full h-full"
      />
    </div>
  );
};