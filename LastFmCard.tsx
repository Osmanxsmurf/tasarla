import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { LastFmAPI } from '@/lib/lastfm-api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { TrendingUp, RefreshCw } from 'lucide-react';
import { SiYoutube } from 'react-icons/si';
import { queryClient } from '@/lib/queryClient';

export function LastFmCard() {
  const lastfmApi = new LastFmAPI();

  const { data: trendingTracks, isLoading, error } = useQuery({
    queryKey: ['/api/lastfm/trending'],
    queryFn: () => lastfmApi.getTopTracks(10),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ['/api/lastfm/trending'] });
  };

  const handleYouTubeSearch = (artist: string, track: string) => {
    const query = `${artist} ${track}`;
    const youtubeUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;
    window.open(youtubeUrl, '_blank');
  };

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-white">
          <span className="flex items-center">
            <TrendingUp className="text-red-600 mr-2" />
            Trending Müzikler
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRefresh}
            disabled={isLoading}
            className="text-gray-400 hover:text-white"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center space-x-3">
                <Skeleton className="w-6 h-6 bg-gray-700" />
                <div className="flex-1">
                  <Skeleton className="h-4 w-32 bg-gray-700 mb-1" />
                  <Skeleton className="h-3 w-24 bg-gray-700" />
                </div>
                <Skeleton className="w-8 h-8 bg-gray-700" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-6">
            <p className="text-red-400 mb-2">Last.fm verilerine ulaşılamıyor</p>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              className="border-gray-600 text-gray-400 hover:text-white"
            >
              Tekrar Dene
            </Button>
          </div>
        ) : trendingTracks && trendingTracks.length > 0 ? (
          <div className="space-y-3">
            {trendingTracks.slice(0, 5).map((track, index) => (
              <div key={`${track.artist.name}-${track.name}`} className="flex items-center space-x-3">
                <span className="text-red-600 font-bold text-lg w-6">{index + 1}</span>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-white truncate">{track.name}</p>
                  <p className="text-sm text-gray-400 truncate">{track.artist.name}</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleYouTubeSearch(track.artist.name, track.name)}
                  className="text-red-500 hover:text-white"
                >
                  <SiYoutube className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6">
            <p className="text-gray-400">Trend verisi bulunamadı</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
