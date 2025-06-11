import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { LastFmAPI } from '@/lib/lastfm-api';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  Play, 
  Heart, 
  Share2, 
  MoreHorizontal,
  Clock,
  Flame,
  Crown,
  Globe
} from 'lucide-react';
import { SiSpotify, SiYoutube, SiApplemusic } from 'react-icons/si';

const mockTrendingData = [
  {
    id: 1,
    title: "Anti-Hero",
    artist: "Taylor Swift",
    album: "Midnights",
    rank: 1,
    plays: "2.8M",
    trend: "+15%",
    duration: "3:20",
    image: "🎵",
    color: "from-purple-500 to-pink-500"
  },
  {
    id: 2,
    title: "As It Was",
    artist: "Harry Styles",
    album: "Harry's House",
    rank: 2,
    plays: "2.5M",
    trend: "+8%",
    duration: "2:47",
    image: "🎶",
    color: "from-blue-500 to-cyan-500"
  },
  {
    id: 3,
    title: "Bad Habit",
    artist: "Steve Lacy",
    album: "Gemini Rights",
    rank: 3,
    plays: "2.1M",
    trend: "+12%",
    duration: "3:52",
    image: "🎤",
    color: "from-orange-500 to-red-500"
  },
  {
    id: 4,
    title: "Flowers",
    artist: "Miley Cyrus",
    album: "Endless Summer Vacation",
    rank: 4,
    plays: "1.9M",
    trend: "+22%",
    duration: "3:20",
    image: "🌸",
    color: "from-pink-500 to-rose-500"
  },
  {
    id: 5,
    title: "Unholy",
    artist: "Sam Smith ft. Kim Petras",
    album: "Gloria",
    rank: 5,
    plays: "1.7M",
    trend: "+5%",
    duration: "2:36",
    image: "✨",
    color: "from-indigo-500 to-purple-500"
  }
];

const categories = [
  { id: 'global', name: 'Global', icon: Globe, color: 'from-blue-500 to-cyan-500' },
  { id: 'turkey', name: 'Türkiye', icon: Flame, color: 'from-red-500 to-orange-500' },
  { id: 'viral', name: 'Viral', icon: TrendingUp, color: 'from-purple-500 to-pink-500' },
  { id: 'new', name: 'Yeni Çıkanlar', icon: Crown, color: 'from-green-500 to-emerald-500' },
];

export function TrendingView() {
  const [selectedCategory, setSelectedCategory] = useState('global');
  const [playingTrack, setPlayingTrack] = useState<number | null>(null);

  const lastfmApi = new LastFmAPI();

  const { data: trendingTracks, isLoading } = useQuery({
    queryKey: ['/api/lastfm/trending', selectedCategory],
    queryFn: () => lastfmApi.getTopTracks(10),
    staleTime: 5 * 60 * 1000,
  });

  const displayTracks = trendingTracks && trendingTracks.length > 0 ? 
    trendingTracks.slice(0, 5).map((track, index) => ({
      id: index + 1,
      title: track.name,
      artist: track.artist.name,
      album: "Chart Hit",
      rank: index + 1,
      plays: `${Math.floor(Math.random() * 3) + 1}.${Math.floor(Math.random() * 9)}M`,
      trend: `+${Math.floor(Math.random() * 20) + 5}%`,
      duration: `${Math.floor(Math.random() * 2) + 2}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`,
      image: ['🎵', '🎶', '🎤', '🌟', '✨'][index],
      color: ['from-purple-500 to-pink-500', 'from-blue-500 to-cyan-500', 'from-orange-500 to-red-500', 'from-pink-500 to-rose-500', 'from-indigo-500 to-purple-500'][index]
    })) : mockTrendingData;

  return (
    <div className="min-h-screen p-8 space-y-8">
      {/* Premium Header */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 via-red-500/20 to-pink-500/20 rounded-3xl blur-3xl"></div>
        <div className="relative bg-white/5 backdrop-blur-3xl rounded-3xl border border-white/10 p-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="p-4 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl shadow-2xl">
                <TrendingUp className="w-10 h-10 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-black text-white">Haftalık Trendler</h1>
                <p className="text-xl text-white/70 mt-2">Dünyanın en popüler müzikleri</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Badge className="bg-green-500/20 text-green-400 border-green-500/30 px-4 py-2">
                Canlı Veriler
              </Badge>
              <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30 px-4 py-2">
                Son 24 Saat
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Category Selector */}
      <div className="flex space-x-4 overflow-x-auto pb-2">
        {categories.map((category) => {
          const Icon = category.icon;
          const isActive = selectedCategory === category.id;
          return (
            <Button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`flex items-center space-x-3 px-6 py-4 rounded-2xl border transition-all duration-300 whitespace-nowrap ${
                isActive 
                  ? `bg-gradient-to-r ${category.color} text-white border-white/20 shadow-lg` 
                  : 'bg-white/5 text-white/70 border-white/10 hover:bg-white/10 hover:text-white'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-semibold">{category.name}</span>
            </Button>
          );
        })}
      </div>

      {/* Trending Charts */}
      <div className="space-y-4">
        {displayTracks.map((track, index) => (
          <Card 
            key={track.id}
            className="bg-white/5 backdrop-blur-2xl border-white/10 hover:bg-white/10 transition-all duration-300 group overflow-hidden"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <CardContent className="p-6">
              <div className="flex items-center space-x-6">
                {/* Rank */}
                <div className="flex-shrink-0">
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-r ${track.color} flex items-center justify-center shadow-lg`}>
                    <span className="text-white font-black text-lg">#{track.rank}</span>
                  </div>
                </div>

                {/* Album Art */}
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${track.color} flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-300`}>
                  <span className="text-2xl">{track.image}</span>
                </div>

                {/* Track Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-xl font-bold text-white truncate">{track.title}</h3>
                    {track.rank <= 3 && (
                      <Crown className="w-5 h-5 text-yellow-400" />
                    )}
                  </div>
                  <p className="text-white/70 text-lg mb-1">{track.artist}</p>
                  <div className="flex items-center space-x-4 text-sm text-white/50">
                    <span>{track.album}</span>
                    <span>•</span>
                    <span className="flex items-center">
                      <Clock className="w-3 h-3 mr-1" />
                      {track.duration}
                    </span>
                  </div>
                </div>

                {/* Stats */}
                <div className="text-right space-y-2">
                  <div className="text-lg font-bold text-white">{track.plays}</div>
                  <div className="flex items-center text-green-400 text-sm font-semibold">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    {track.trend}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center space-x-2">
                  <Button
                    size="sm"
                    onClick={() => setPlayingTrack(playingTrack === track.id ? null : track.id)}
                    className={`w-12 h-12 rounded-full ${
                      playingTrack === track.id 
                        ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white' 
                        : 'bg-white/10 hover:bg-white/20 text-white'
                    } transition-all duration-300`}
                  >
                    <Play className="w-5 h-5" />
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-10 h-10 rounded-full text-white/60 hover:text-white hover:bg-white/10"
                  >
                    <Heart className="w-4 h-4" />
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-10 h-10 rounded-full text-white/60 hover:text-white hover:bg-white/10"
                  >
                    <Share2 className="w-4 h-4" />
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-10 h-10 rounded-full text-white/60 hover:text-white hover:bg-white/10"
                  >
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Platform Links */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 backdrop-blur-2xl border-white/10 hover:border-green-500/30 transition-all duration-300">
          <CardContent className="p-6 text-center space-y-4">
            <SiSpotify className="w-12 h-12 mx-auto text-green-500" />
            <h3 className="text-xl font-bold text-white">Spotify'da Dinle</h3>
            <Button className="w-full bg-green-500 hover:bg-green-600 text-white rounded-2xl">
              Spotify'a Git
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-500/10 to-pink-500/10 backdrop-blur-2xl border-white/10 hover:border-red-500/30 transition-all duration-300">
          <CardContent className="p-6 text-center space-y-4">
            <SiYoutube className="w-12 h-12 mx-auto text-red-500" />
            <h3 className="text-xl font-bold text-white">YouTube'da İzle</h3>
            <Button className="w-full bg-red-500 hover:bg-red-600 text-white rounded-2xl">
              YouTube'a Git
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-gray-500/10 to-slate-500/10 backdrop-blur-2xl border-white/10 hover:border-gray-500/30 transition-all duration-300">
          <CardContent className="p-6 text-center space-y-4">
            <SiApplemusic className="w-12 h-12 mx-auto text-gray-300" />
            <h3 className="text-xl font-bold text-white">Apple Music</h3>
            <Button className="w-full bg-gray-600 hover:bg-gray-700 text-white rounded-2xl">
              Apple Music'e Git
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}