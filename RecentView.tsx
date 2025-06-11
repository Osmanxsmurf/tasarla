import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Clock, 
  Play, 
  Pause, 
  MoreHorizontal,
  Calendar,
  Repeat,
  Shuffle,
  Heart
} from 'lucide-react';

const recentTracks = [
  {
    id: 1,
    title: "Blinding Lights",
    artist: "The Weeknd",
    album: "After Hours",
    duration: "3:20",
    playedAt: "2 dakika önce",
    playCount: 12,
    image: "🌟",
    color: "from-purple-500 to-pink-500"
  },
  {
    id: 2,
    title: "Shape of You",
    artist: "Ed Sheeran",
    album: "÷ (Divide)",
    duration: "3:53",
    playedAt: "15 dakika önce",
    playCount: 8,
    image: "🎵",
    color: "from-orange-500 to-red-500"
  },
  {
    id: 3,
    title: "Someone Like You",
    artist: "Adele",
    album: "21",
    duration: "4:45",
    playedAt: "1 saat önce",
    playCount: 15,
    image: "💫",
    color: "from-blue-500 to-cyan-500"
  },
  {
    id: 4,
    title: "Watermelon Sugar",
    artist: "Harry Styles",
    album: "Fine Line",
    duration: "2:54",
    playedAt: "2 saat önce",
    playCount: 6,
    image: "🍉",
    color: "from-green-500 to-emerald-500"
  },
  {
    id: 5,
    title: "Bad Guy",
    artist: "Billie Eilish",
    album: "When We All Fall Asleep",
    duration: "3:14",
    playedAt: "3 saat önce",
    playCount: 9,
    image: "🖤",
    color: "from-gray-500 to-slate-600"
  }
];

const todayStats = {
  totalTime: "2sa 34dk",
  tracksPlayed: 28,
  uniqueArtists: 12,
  topGenre: "Pop"
};

export function RecentView() {
  const [currentlyPlaying, setCurrentlyPlaying] = useState<number | null>(null);

  const handlePlayPause = (trackId: number) => {
    if (currentlyPlaying === trackId) {
      setCurrentlyPlaying(null);
    } else {
      setCurrentlyPlaying(trackId);
      const track = recentTracks.find(t => t.id === trackId);
      if (track) {
        console.log(`Playing: ${track.title} by ${track.artist}`);
      }
    }
  };

  return (
    <div className="min-h-screen p-8 space-y-8">
      {/* Header */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-blue-500/20 to-cyan-500/20 rounded-3xl blur-3xl"></div>
        <div className="relative bg-white/5 backdrop-blur-3xl rounded-3xl border border-white/10 p-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="p-4 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl shadow-2xl">
                <Clock className="w-10 h-10 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-black text-white">Son Dinlenenler</h1>
                <p className="text-xl text-white/70 mt-2">Müzik geçmişiniz ve istatistikleriniz</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white rounded-2xl px-6 py-3">
                <Repeat className="w-5 h-5 mr-2" />
                Tekrar Çal
              </Button>
              <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 rounded-2xl px-6 py-3">
                <Shuffle className="w-5 h-5 mr-2" />
                Karıştır
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Today's Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 backdrop-blur-2xl border-white/10">
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-black text-white mb-2">{todayStats.totalTime}</div>
            <div className="text-white/70">Toplam Dinleme</div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 backdrop-blur-2xl border-white/10">
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-black text-white mb-2">{todayStats.tracksPlayed}</div>
            <div className="text-white/70">Çalınan Şarkı</div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-orange-500/10 to-red-500/10 backdrop-blur-2xl border-white/10">
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-black text-white mb-2">{todayStats.uniqueArtists}</div>
            <div className="text-white/70">Farklı Sanatçı</div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-pink-500/10 to-purple-500/10 backdrop-blur-2xl border-white/10">
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-black text-white mb-2">{todayStats.topGenre}</div>
            <div className="text-white/70">En Çok Dinlenen</div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Tracks */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white flex items-center">
            <Calendar className="w-6 h-6 mr-3 text-blue-400" />
            Bu Gün Dinlenenler
          </h2>
          <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
            {recentTracks.length} şarkı
          </Badge>
        </div>
        
        {recentTracks.map((track, index) => (
          <Card 
            key={track.id}
            className="bg-white/5 backdrop-blur-2xl border-white/10 hover:bg-white/10 transition-all duration-300 group"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <CardContent className="p-6">
              <div className="flex items-center space-x-6">
                {/* Play Button */}
                <Button
                  onClick={() => handlePlayPause(track.id)}
                  className={`w-14 h-14 rounded-full ${
                    currentlyPlaying === track.id 
                      ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white' 
                      : 'bg-white/10 hover:bg-white/20 text-white'
                  } transition-all duration-300`}
                >
                  {currentlyPlaying === track.id ? (
                    <Pause className="w-6 h-6" />
                  ) : (
                    <Play className="w-6 h-6" />
                  )}
                </Button>

                {/* Album Art */}
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${track.color} flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-300`}>
                  <span className="text-2xl">{track.image}</span>
                </div>

                {/* Track Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-xl font-bold text-white truncate">{track.title}</h3>
                    <Badge variant="outline" className="bg-white/10 border-white/20 text-white/70 text-xs">
                      {track.playCount}x
                    </Badge>
                  </div>
                  <p className="text-white/70 text-lg mb-1">{track.artist}</p>
                  <p className="text-white/50 text-sm">{track.album}</p>
                </div>

                {/* Time Info */}
                <div className="text-right space-y-1">
                  <div className="text-white/70 text-sm">{track.duration}</div>
                  <div className="text-white/50 text-xs">{track.playedAt}</div>
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-10 h-10 rounded-full text-white/60 hover:text-red-500 hover:bg-white/10"
                  >
                    <Heart className="w-4 h-4" />
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

      {/* Weekly Summary */}
      <Card className="bg-gradient-to-br from-purple-500/10 via-pink-500/10 to-orange-500/10 backdrop-blur-2xl border-white/10">
        <CardContent className="p-8">
          <div className="text-center space-y-6">
            <div>
              <h3 className="text-2xl font-bold text-white mb-2">Bu Hafta Toplam</h3>
              <p className="text-white/70">Müzik dinleme alışkanlıklarınız</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-4xl font-black text-white mb-2">12sa 45dk</div>
                <div className="text-white/70">Toplam Dinleme Süresi</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-black text-white mb-2">127</div>
                <div className="text-white/70">Dinlenen Şarkı</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-black text-white mb-2">34</div>
                <div className="text-white/70">Farklı Sanatçı</div>
              </div>
            </div>
            
            <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-2xl px-8 py-3">
              Detaylı İstatistikleri Gör
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}