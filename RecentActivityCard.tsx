import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { History, Bot, Music, TrendingUp } from 'lucide-react';
import { SiSpotify, SiYoutube } from 'react-icons/si';

// Mock activities since we don't have a real user system yet
const mockActivities = [
  {
    id: 1,
    activityType: 'spotify',
    description: 'Spotify playlist dinlendi',
    timestamp: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
    metadata: { playlistName: 'Chill Playlist' },
  },
  {
    id: 2,
    activityType: 'ai',
    description: 'AI\'dan ruh hali analizi alındı',
    timestamp: new Date(Date.now() - 10 * 60 * 1000), // 10 minutes ago
    metadata: { mood: 'mutlu', confidence: 0.9 },
  },
  {
    id: 3,
    activityType: 'youtube',
    description: 'YouTube\'da şarkı aratıldı',
    timestamp: new Date(Date.now() - 15 * 60 * 1000), // 15 minutes ago
    metadata: { query: 'Sezen Aksu' },
  },
  {
    id: 4,
    activityType: 'lastfm',
    description: 'Last.fm trendleri kontrol edildi',
    timestamp: new Date(Date.now() - 25 * 60 * 1000), // 25 minutes ago
    metadata: { tracksViewed: 10 },
  },
  {
    id: 5,
    activityType: 'ai',
    description: 'AI asistanına müzik önerisi soruldu',
    timestamp: new Date(Date.now() - 35 * 60 * 1000), // 35 minutes ago
    metadata: { intent: 'music_request' },
  },
];

export function RecentActivityCard() {
  // Mock query that returns static data
  const { data: activities, isLoading } = useQuery({
    queryKey: ['/api/user/1/activity'],
    queryFn: async () => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      return mockActivities;
    },
  });

  const getActivityIcon = (activityType: string) => {
    switch (activityType) {
      case 'spotify':
        return <SiSpotify className="w-4 h-4 text-green-500" />;
      case 'youtube':
        return <SiYoutube className="w-4 h-4 text-red-500" />;
      case 'lastfm':
        return <TrendingUp className="w-4 h-4 text-red-600" />;
      case 'ai':
        return <Bot className="w-4 h-4 text-purple-400" />;
      default:
        return <Music className="w-4 h-4 text-gray-400" />;
    }
  };

  const getActivityColor = (activityType: string) => {
    switch (activityType) {
      case 'spotify':
        return 'bg-green-500';
      case 'youtube':
        return 'bg-red-500';
      case 'lastfm':
        return 'bg-red-600';
      case 'ai':
        return 'bg-purple-400';
      default:
        return 'bg-gray-400';
    }
  };

  const formatTimeAgo = (timestamp: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - timestamp.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Şimdi';
    if (diffInMinutes < 60) return `${diffInMinutes} dakika önce`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} saat önce`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} gün önce`;
  };

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="flex items-center text-white">
          <History className="mr-2" />
          Son Aktiviteler
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center space-x-3">
                <Skeleton className="w-2 h-2 rounded-full bg-gray-700" />
                <div className="flex-1">
                  <Skeleton className="h-4 w-32 bg-gray-700 mb-1" />
                  <Skeleton className="h-3 w-16 bg-gray-700" />
                </div>
              </div>
            ))}
          </div>
        ) : activities && activities.length > 0 ? (
          <div className="space-y-3">
            {activities.slice(0, 6).map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3">
                <div className={`w-2 h-2 ${getActivityColor(activity.activityType)} rounded-full mt-2 flex-shrink-0`}></div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    {getActivityIcon(activity.activityType)}
                    <p className="text-sm text-white truncate">{activity.description}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-gray-400">{formatTimeAgo(activity.timestamp)}</p>
                    {activity.metadata && (
                      <div className="flex space-x-1">
                        {activity.metadata.playlistName && (
                          <Badge variant="outline" className="text-xs border-green-500/20 text-green-400">
                            {activity.metadata.playlistName}
                          </Badge>
                        )}
                        {activity.metadata.mood && (
                          <Badge variant="outline" className="text-xs border-purple-500/20 text-purple-400">
                            {activity.metadata.mood}
                          </Badge>
                        )}
                        {activity.metadata.query && (
                          <Badge variant="outline" className="text-xs border-red-500/20 text-red-400">
                            {activity.metadata.query}
                          </Badge>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6">
            <History className="w-12 h-12 text-gray-600 mx-auto mb-2" />
            <p className="text-gray-400">Henüz aktivite bulunmuyor</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
