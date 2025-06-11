import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSpotifyAuth } from '@/context/SpotifyAuthContext';
import { SpotifyAPI } from '@/lib/spotify-api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Play, ExternalLink } from 'lucide-react';
import { SiSpotify } from 'react-icons/si';

export function SpotifyCard() {
  const { isAuthenticated, tokens, login } = useSpotifyAuth();

  const { data: playlists, isLoading: playlistsLoading } = useQuery({
    queryKey: ['/api/spotify/playlists'],
    queryFn: async () => {
      if (!tokens?.access_token) return [];
      const api = new SpotifyAPI(tokens.access_token);
      return api.getUserPlaylists(6);
    },
    enabled: isAuthenticated && !!tokens?.access_token,
  });

  const { data: featuredPlaylists, isLoading: featuredLoading } = useQuery({
    queryKey: ['/api/spotify/featured'],
    queryFn: async () => {
      if (!tokens?.access_token) return [];
      const api = new SpotifyAPI(tokens.access_token);
      return api.getFeaturedPlaylists(6);
    },
    enabled: isAuthenticated && !!tokens?.access_token,
  });

  if (!isAuthenticated) {
    return (
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center justify-between text-white">
            <span className="flex items-center">
              <SiSpotify className="text-green-500 mr-2" />
              Spotify Entegrasyonu
            </span>
            <Badge variant="outline" className="border-red-500 text-red-500">Bağlı Değil</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6">
            <SiSpotify className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <p className="text-gray-400 mb-4">
              Spotify hesabınızı bağlayarak kişisel müzik deneyiminizi başlatın
            </p>
            <Button onClick={login} className="bg-green-500 hover:bg-green-600 text-white">
              <SiSpotify className="w-4 h-4 mr-2" />
              Spotify ile Bağlan
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const displayPlaylists = playlists || featuredPlaylists || [];
  const isLoading = playlistsLoading || featuredLoading;

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-white">
          <span className="flex items-center">
            <SiSpotify className="text-green-500 mr-2" />
            Spotify Entegrasyonu
          </span>
          <Badge className="bg-green-500/20 text-green-500 border-green-500">Bağlı</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center space-x-3">
                <Skeleton className="w-12 h-12 bg-gray-700" />
                <div className="flex-1">
                  <Skeleton className="h-4 w-24 bg-gray-700 mb-1" />
                  <Skeleton className="h-3 w-16 bg-gray-700" />
                </div>
                <Skeleton className="w-8 h-8 bg-gray-700" />
              </div>
            ))}
          </div>
        ) : displayPlaylists.length > 0 ? (
          <div className="space-y-3">
            {displayPlaylists.slice(0, 3).map((playlist) => (
              <div
                key={playlist.id}
                className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-700/50 transition-colors cursor-pointer"
              >
                <div className="w-12 h-12 rounded bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                  {playlist.images?.[0]?.url ? (
                    <img
                      src={playlist.images[0].url}
                      alt={playlist.name}
                      className="w-full h-full object-cover rounded"
                    />
                  ) : (
                    <SiSpotify className="text-white w-6 h-6" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-white truncate">{playlist.name}</p>
                  <p className="text-sm text-gray-400">{playlist.tracks.total} şarkı</p>
                </div>
                <div className="flex items-center space-x-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-green-500 hover:text-white"
                  >
                    <Play className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-gray-400 hover:text-white"
                    onClick={() => window.open(playlist.external_urls.spotify, '_blank')}
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
            
            {displayPlaylists.length > 3 && (
              <div className="pt-2 border-t border-gray-700">
                <p className="text-sm text-gray-400 text-center">
                  +{displayPlaylists.length - 3} playlist daha
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-6">
            <p className="text-gray-400">Henüz playlist bulunamadı</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
