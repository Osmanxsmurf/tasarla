import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { YouTubeAPI } from '@/lib/youtube-api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Volume2, 
  ExternalLink,
  Search 
} from 'lucide-react';
import { SiYoutube } from 'react-icons/si';

interface YouTubeCardProps {
  className?: string;
}

export function YouTubeCard({ className }: YouTubeCardProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState([75]);
  
  const youtubeApi = new YouTubeAPI();

  const { data: searchResults, isLoading, refetch } = useQuery({
    queryKey: ['/api/youtube/search', searchQuery],
    queryFn: () => youtubeApi.searchVideos(searchQuery, 6),
    enabled: false, // Only search when explicitly triggered
  });

  const handleSearch = () => {
    if (searchQuery.trim()) {
      refetch();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleVideoSelect = (videoId: string) => {
    setSelectedVideo(videoId);
    setIsPlaying(true);
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <Card className={`bg-gray-800 border-gray-700 ${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-white">
          <span className="flex items-center">
            <SiYoutube className="text-red-500 mr-2" />
            YouTube Müzik Çalar
          </span>
          <Button
            variant="ghost"
            size="sm"
            className="text-gray-400 hover:text-white"
            onClick={() => selectedVideo && window.open(`https://youtube.com/watch?v=${selectedVideo}`, '_blank')}
          >
            <ExternalLink className="w-4 h-4" />
          </Button>
        </CardTitle>
        
        {/* Search Bar */}
        <div className="flex items-center space-x-2">
          <Input
            type="text"
            placeholder="Şarkı, sanatçı veya video arayın..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            className="bg-gray-700 border-gray-600 text-white"
          />
          <Button
            onClick={handleSearch}
            disabled={!searchQuery.trim() || isLoading}
            className="bg-red-500 hover:bg-red-600"
          >
            <Search className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent>
        {/* Video Player */}
        <div className="aspect-video bg-black rounded-lg mb-4 flex items-center justify-center">
          {selectedVideo ? (
            <iframe
              src={youtubeApi.getEmbedUrl(selectedVideo)}
              title="YouTube video player"
              className="w-full h-full rounded-lg"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <div className="text-center">
              <SiYoutube className="w-16 h-16 text-red-500 mb-4 mx-auto" />
              <p className="text-gray-400">Şarkı seçin veya AI asistanından öneri alın</p>
            </div>
          )}
        </div>

        {/* Search Results */}
        {isLoading ? (
          <div className="space-y-2 mb-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center space-x-3 p-2">
                <Skeleton className="w-16 h-12 bg-gray-700" />
                <div className="flex-1">
                  <Skeleton className="h-4 w-32 bg-gray-700 mb-1" />
                  <Skeleton className="h-3 w-24 bg-gray-700" />
                </div>
                <Skeleton className="w-8 h-8 bg-gray-700" />
              </div>
            ))}
          </div>
        ) : searchResults && searchResults.length > 0 ? (
          <div className="space-y-2 mb-4 max-h-48 overflow-y-auto">
            {searchResults.map((video) => (
              <div
                key={video.id.videoId}
                className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-700/50 cursor-pointer transition-colors"
                onClick={() => handleVideoSelect(video.id.videoId)}
              >
                <img
                  src={video.snippet.thumbnails.default.url}
                  alt={video.snippet.title}
                  className="w-16 h-12 object-cover rounded"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-white text-sm truncate">
                    {video.snippet.title}
                  </p>
                  <p className="text-xs text-gray-400 truncate">
                    {video.snippet.channelTitle}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-red-500 hover:text-white"
                >
                  <Play className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        ) : searchQuery && !isLoading ? (
          <div className="text-center py-4 mb-4">
            <p className="text-gray-400">"{searchQuery}" için sonuç bulunamadı</p>
          </div>
        ) : null}

        {/* Player Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              className="text-2xl text-gray-400 hover:text-red-500"
            >
              <SkipBack className="w-5 h-5" />
            </Button>
            <Button
              onClick={togglePlayPause}
              variant="ghost"
              size="sm"
              className="text-3xl text-gray-400 hover:text-red-500"
            >
              {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-2xl text-gray-400 hover:text-red-500"
            >
              <SkipForward className="w-5 h-5" />
            </Button>
          </div>

          <div className="flex-1 mx-6">
            <div className="bg-gray-700 rounded-full h-2">
              <div className="bg-red-500 rounded-full h-2 w-1/3"></div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Volume2 className="w-4 h-4 text-gray-400" />
            <div className="w-20">
              <Slider
                value={volume}
                onValueChange={setVolume}
                max={100}
                step={1}
                className="cursor-pointer"
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
