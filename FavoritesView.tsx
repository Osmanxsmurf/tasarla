import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Heart, 
  Play, 
  Pause, 
  Search, 
  Filter, 
  Grid3x3, 
  List,
  MoreHorizontal,
  Download,
  Share2,
  Plus
} from 'lucide-react';

const favoriteTracks = [
  {
    id: 1,
    title: "Bohemian Rhapsody",
    artist: "Queen",
    album: "A Night at the Opera",
    duration: "5:55",
    dateAdded: "2 gün önce",
    plays: 47,
    image: "👑",
    color: "from-yellow-500 to-orange-500"
  },
  {
    id: 2,
    title: "Imagine",
    artist: "John Lennon",
    album: "Imagine",
    duration: "3:01",
    dateAdded: "1 hafta önce",
    plays: 32,
    image: "🕊️",
    color: "from-blue-500 to-cyan-500"
  },
  {
    id: 3,
    title: "Hotel California",
    artist: "Eagles",
    album: "Hotel California",
    duration: "6:30",
    dateAdded: "3 gün önce",
    plays: 28,
    image: "🌴",
    color: "from-orange-500 to-red-500"
  },
  {
    id: 4,
    title: "Stairway to Heaven",
    artist: "Led Zeppelin",
    album: "Led Zeppelin IV",
    duration: "8:02",
    dateAdded: "5 gün önce",
    plays: 41,
    image: "⚡",
    color: "from-purple-500 to-pink-500"
  },
  {
    id: 5,
    title: "Sweet Child O' Mine",
    artist: "Guns N' Roses",
    album: "Appetite for Destruction",
    duration: "5:03",
    dateAdded: "1 gün önce",
    plays: 19,
    image: "🌹",
    color: "from-red-500 to-pink-500"
  }
];

const playlists = [
  {
    id: 1,
    name: "Çalışma Listem",
    trackCount: 24,
    duration: "1sa 32dk",
    image: "📚",
    color: "from-blue-500 to-cyan-500"
  },
  {
    id: 2,
    name: "Egzersiz Motivasyonu",
    trackCount: 18,
    duration: "58dk",
    image: "💪",
    color: "from-orange-500 to-red-500"
  },
  {
    id: 3,
    name: "Akşam Rahatlama",
    trackCount: 15,
    duration: "45dk",
    image: "🌙",
    color: "from-purple-500 to-indigo-500"
  }
];

export function FavoritesView() {
  const [currentlyPlaying, setCurrentlyPlaying] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [searchQuery, setSearchQuery] = useState('');

  const handlePlayPause = (trackId: number) => {
    if (currentlyPlaying === trackId) {
      setCurrentlyPlaying(null);
      // Stop audio
    } else {
      setCurrentlyPlaying(trackId);
      // Start playing audio
      const track = favoriteTracks.find(t => t.id === trackId);
      if (track) {
        // In a real app, you would start playing the actual audio file
        console.log(`Playing: ${track.title} by ${track.artist}`);
      }
    }
  };

  const filteredTracks = favoriteTracks.filter(track =>
    track.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    track.artist.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen p-8 space-y-8">
      {/* Header */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 via-pink-500/20 to-rose-500/20 rounded-3xl blur-3xl"></div>
        <div className="relative bg-white/5 backdrop-blur-3xl rounded-3xl border border-white/10 p-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="p-4 bg-gradient-to-r from-red-500 to-pink-500 rounded-2xl shadow-2xl">
                <Heart className="w-10 h-10 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-black text-white">Favorilerim</h1>
                <p className="text-xl text-white/70 mt-2">{favoriteTracks.length} beğendiğiniz şarkı</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white rounded-2xl px-6 py-3">
                <Play className="w-5 h-5 mr-2" />
                Tümünü Çal
              </Button>
              <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 rounded-2xl px-6 py-3">
                <Download className="w-5 h-5 mr-2" />
                İndir
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/50" />
            <Input
              placeholder="Favorilerinizde ara..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white/10 border-white/20 text-white placeholder-white/50 rounded-2xl w-80"
            />
          </div>
          <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 rounded-2xl">
            <Filter className="w-5 h-5 mr-2" />
            Filtrele
          </Button>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            onClick={() => setViewMode('list')}
            className="rounded-xl"
          >
            <List className="w-5 h-5" />
          </Button>
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            onClick={() => setViewMode('grid')}
            className="rounded-xl"
          >
            <Grid3x3 className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Tracks List */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-white">Şarkılar</h2>
        {filteredTracks.map((track, index) => (
          <Card 
            key={track.id}
            className="bg-white/5 backdrop-blur-2xl border-white/10 hover:bg-white/10 transition-all duration-300 group"
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
                    <Heart className="w-5 h-5 text-red-500 fill-current" />
                  </div>
                  <p className="text-white/70 text-lg mb-1">{track.artist}</p>
                  <p className="text-white/50 text-sm">{track.album}</p>
                </div>

                {/* Stats */}
                <div className="text-right space-y-1">
                  <div className="text-white/70 text-sm">{track.duration}</div>
                  <div className="text-white/50 text-xs">{track.plays} çalınma</div>
                  <div className="text-white/50 text-xs">{track.dateAdded}</div>
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-2">
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

      {/* Playlists */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">Özel Listelerim</h2>
          <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-2xl">
            <Plus className="w-5 h-5 mr-2" />
            Yeni Liste
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {playlists.map((playlist) => (
            <Card
              key={playlist.id}
              className="bg-white/5 backdrop-blur-2xl border-white/10 hover:border-white/30 transition-all duration-300 group cursor-pointer"
            >
              <CardContent className="p-6 space-y-4">
                <div className={`w-full h-32 rounded-2xl bg-gradient-to-br ${playlist.color} flex items-center justify-center text-4xl shadow-lg group-hover:scale-105 transition-transform duration-300`}>
                  {playlist.image}
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-white">{playlist.name}</h3>
                  <div className="flex items-center justify-between text-sm text-white/60">
                    <span>{playlist.trackCount} şarkı</span>
                    <span>{playlist.duration}</span>
                  </div>
                  <Button 
                    size="sm"
                    className="w-full bg-white/10 hover:bg-white/20 text-white rounded-xl mt-3"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Çal
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}