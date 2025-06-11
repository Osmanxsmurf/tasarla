import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { ThumbsUp, ThumbsDown, Share2, ExternalLink, Heart, Play, Pause } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { 
  searchYouTube, 
  getRelatedVideos, 
  getYouTubeEmbedUrl, 
  getYouTubeWatchUrl,
  formatDuration,
  type YoutubeSearchResult,
  type YoutubeVideoDetails
} from '@/lib/youtube-api';
import type { Song } from '@shared/schema';

interface YouTubePlayerProps {
  searchQuery?: string;
  videoId?: string;
  autoplay?: boolean;
  showRelated?: boolean;
  onVideoSelected?: (video: YoutubeSearchResult) => void;
  className?: string;
}

export function YouTubePlayer({
  searchQuery,
  videoId: initialVideoId,
  autoplay = false,
  showRelated = true,
  onVideoSelected,
  className
}: YouTubePlayerProps) {
  const [videoId, setVideoId] = useState<string | null>(initialVideoId || null);
  const [isPlaying, setIsPlaying] = useState<boolean>(autoplay);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [relatedVideos, setRelatedVideos] = useState<YoutubeSearchResult[]>([]);
  const [requestCount, setRequestCount] = useState<number>(0); // API çağrı sayısını takip et
  const { toast } = useToast();
  
  // YouTube API çağrılarını sınırla - quota aşımını önle
  const MAX_REQUESTS_PER_SESSION = 10; // Bu sayıyı projenize göre ayarlayın
  
  // Arama sorgusu değiştiğinde video bul
  useEffect(() => {
    if (!searchQuery || requestCount >= MAX_REQUESTS_PER_SESSION) return;
    
    const searchVideo = async () => {
      setIsLoading(true);
      try {
        // API çağrı sayısını artır
        setRequestCount(prev => prev + 1);
        
        const results = await searchYouTube(searchQuery, 1);
        if (results.length > 0) {
          setVideoId(results[0].id);
          setIsPlaying(autoplay);
        } else {
          setError('Video bulunamadı');
        }
      } catch (err) {
        console.error('Video arama hatası:', err);
        setError('Video yüklenirken bir hata oluştu');
        toast({
          title: 'Video Arama Hatası',
          description: 'Video araması sırasında bir sorun oluştu.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    searchVideo();
  }, [searchQuery, autoplay, toast, requestCount]);
  
  // Video ID değiştiğinde ilgili videoları getir
  useEffect(() => {
    if (!videoId || !showRelated || requestCount >= MAX_REQUESTS_PER_SESSION) return;

    const fetchRelatedVideos = async () => {
      try {
        // API çağrı sayısını artır
        setRequestCount(prev => prev + 1);
        
        const videos = await getRelatedVideos(videoId, 5);
        setRelatedVideos(videos);
      } catch (err) {
        console.error('İlgili videolar yüklenirken hata:', err);
      }
    };

    fetchRelatedVideos();
  }, [videoId, showRelated, requestCount]);
  
  // API kotası aşıldığında uyarı göster
  useEffect(() => {
    if (requestCount >= MAX_REQUESTS_PER_SESSION) {
      toast({
        title: 'API Kullanım Sınırı',
        description: 'YouTube API kullanım kotası dolmak üzere. Bazı özellikler kısıtlanabilir.',
        variant: 'default',
      });
    }
  }, [requestCount, toast]);
  
  // Başka bir video seç
  const handleVideoSelect = (video: YoutubeSearchResult) => {
    setVideoId(video.id);
    setIsPlaying(true);
    if (onVideoSelected) {
      onVideoSelected(video);
    }
  };
  
  // YouTube'da aç
  const openInYouTube = () => {
    if (!videoId) return;
    window.open(getYouTubeWatchUrl(videoId), '_blank');
  };
  
  if (isLoading) {
    return (
      <Card className={`overflow-hidden ${className}`}>
        <CardContent className="p-0">
          <div className="aspect-video bg-muted flex items-center justify-center">
            <Skeleton className="w-12 h-12 rounded-full" />
          </div>
        </CardContent>
        <CardFooter className="flex justify-between p-4">
          <Skeleton className="h-4 w-[250px]" />
          <Skeleton className="h-10 w-[100px]" />
        </CardFooter>
      </Card>
    );
  }
  
  if (error || !videoId) {
    return (
      <Card className={`overflow-hidden ${className}`}>
        <CardContent className="p-6 text-center">
          <div className="text-destructive mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mx-auto mb-2">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            <p>{error || 'Video yüklenemedi'}</p>
          </div>
          {searchQuery && (
            <Button 
              variant="outline" 
              onClick={() => window.open(`https://www.youtube.com/results?search_query=${encodeURIComponent(searchQuery)}`, '_blank')}
            >
              YouTube'da Ara
            </Button>
          )}
        </CardContent>
      </Card>
    );
  }
  
  return (
    <div className={`space-y-4 ${className}`}>
      <Card className="overflow-hidden">
        <CardContent className="p-0">
          <div className="aspect-video bg-black">
            <iframe
              width="100%"
              height="100%"
              src={getYouTubeEmbedUrl(videoId, isPlaying ? 1 : 0)}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
            ></iframe>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between p-4">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={openInYouTube}>
              <ExternalLink className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon">
              <Heart className="h-4 w-4" />
            </Button>
          </div>
        </CardFooter>
      </Card>
      
      {showRelated && relatedVideos.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-lg font-medium">Benzer Videolar</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {relatedVideos.map((video) => (
              <Card 
                key={video.id} 
                className="overflow-hidden cursor-pointer hover:ring-1 ring-primary/20 transition-all"
                onClick={() => handleVideoSelect(video)}
              >
                <div className="flex md:flex-row flex-col">
                  <div className="relative w-full md:w-48 h-32">
                    <img 
                      src={video.thumbnailUrl} 
                      alt={video.title} 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                      <Play className="h-10 w-10 text-white" />
                    </div>
                  </div>
                  <div className="p-3 flex-1 overflow-hidden flex flex-col">
                    <h4 className="font-medium text-sm line-clamp-2">{video.title}</h4>
                    <p className="text-xs text-muted-foreground mt-1">{video.channelTitle}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}