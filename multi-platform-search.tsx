import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Search, 
  Play, 
  ExternalLink,
  Music,
  Youtube,
  Headphones,
  Sparkles,
  TrendingUp
} from "lucide-react";
import { musicIntegration } from "@/lib/music-integration";

interface MultiPlatformSearchProps {
  onTrackPlay?: (track: any) => void;
}

export function MultiPlatformSearch({ onTrackPlay }: MultiPlatformSearchProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSearch, setActiveSearch] = useState("");

  const { data: searchResults, isLoading: searchLoading } = useQuery({
    queryKey: ["/api/music/search", activeSearch],
    queryFn: () => musicIntegration.searchAcrossAllPlatforms(activeSearch, 20),
    enabled: !!activeSearch,
  });

  const { data: turkishTrending, isLoading: trendingLoading } = useQuery({
    queryKey: ["/api/music/turkish-trending"],
    queryFn: () => musicIntegration.getTurkishTrendingMusic(),
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setActiveSearch(searchQuery.trim());
    }
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'spotify': return <Music className="w-4 h-4 text-green-500" />;
      case 'youtube': return <Youtube className="w-4 h-4 text-red-500" />;
      case 'lastfm': return <Headphones className="w-4 h-4 text-red-800" />;
      default: return <Music className="w-4 h-4" />;
    }
  };

  const getPlatformName = (trackId: string) => {
    if (trackId.startsWith('spotify_')) return 'Spotify';
    if (trackId.startsWith('youtube_')) return 'YouTube';
    if (trackId.startsWith('lastfm_')) return 'Last.fm';
    return 'Bilinmeyen';
  };

  return (
    <div className="space-y-8">
      {/* Arama Bölümü */}
      <div className="glass-effect border border-purple-500/30 rounded-3xl p-6">
        <div className="flex items-center space-x-4 mb-6">
          <div className="gradient-border">
            <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-xl flex items-center justify-center">
              <Search className="text-white w-6 h-6" />
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              Çok Platform Arama
            </h2>
            <p className="text-sm text-gray-400">Spotify, YouTube ve Last.fm'de eş zamanlı ara</p>
          </div>
        </div>

        <form onSubmit={handleSearch} className="relative">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="Sanatçı, şarkı adı veya albüm ara..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-black/20 border-white/20 rounded-2xl py-4 px-6 pl-14 text-white placeholder-gray-400 focus:border-purple-500/50 focus:bg-black/30 text-lg"
            />
            <Button 
              type="submit"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-xl px-6"
              disabled={!searchQuery.trim()}
            >
              Ara
            </Button>
          </div>
        </form>

        {searchLoading && (
          <div className="mt-6 text-center">
            <div className="inline-flex items-center space-x-2 text-purple-400">
              <div className="w-5 h-5 border-2 border-purple-400 border-t-transparent rounded-full animate-spin"></div>
              <span>Tüm platformlarda aranıyor...</span>
            </div>
          </div>
        )}

        {searchResults && searchResults.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
              <Sparkles className="text-yellow-400 w-5 h-5" />
              <span>Arama Sonuçları ({searchResults.length})</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {searchResults.map((track, index) => (
                <SearchResultCard 
                  key={`${track.id}_${index}`}
                  track={track}
                  onPlay={() => onTrackPlay?.(track)}
                  platformIcon={getPlatformIcon(getPlatformName(track.id).toLowerCase())}
                  platformName={getPlatformName(track.id)}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Türkiye Trendleri */}
      <div className="glass-effect border border-orange-500/30 rounded-3xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="gradient-border">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
                <TrendingUp className="text-white w-6 h-6" />
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
                Türkiye'de Trend
              </h2>
              <p className="text-sm text-gray-400">En popüler Türkçe müzikler</p>
            </div>
          </div>
        </div>

        {trendingLoading ? (
          <div className="text-center py-8">
            <div className="inline-flex items-center space-x-2 text-orange-400">
              <div className="w-5 h-5 border-2 border-orange-400 border-t-transparent rounded-full animate-spin"></div>
              <span>Trend müzikler yükleniyor...</span>
            </div>
          </div>
        ) : turkishTrending && turkishTrending.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {turkishTrending.slice(0, 8).map((track, index) => (
              <TrendingCard 
                key={`${track.id}_${index}`}
                track={track}
                position={index + 1}
                onPlay={() => onTrackPlay?.(track)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <TrendingUp className="w-12 h-12 text-gray-500 mx-auto mb-4" />
            <p className="text-gray-400">Trend müzikler yüklenemedi</p>
            <p className="text-sm text-gray-500 mt-2">API anahtarlarınızı kontrol edin</p>
          </div>
        )}
      </div>
    </div>
  );
}

interface SearchResultCardProps {
  track: any;
  onPlay: () => void;
  platformIcon: React.ReactNode;
  platformName: string;
}

function SearchResultCard({ track, onPlay, platformIcon, platformName }: SearchResultCardProps) {
  return (
    <Card className="group glass-effect border-white/10 hover:border-purple-500/30 transition-all duration-300 hover:scale-105">
      <CardContent className="p-4">
        <div className="relative mb-3">
          <img 
            src={track.imageUrl || "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300"}
            alt={track.title}
            className="w-full aspect-square object-cover rounded-lg"
          />
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
            <Button 
              size="icon"
              className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-full shadow-2xl"
              onClick={onPlay}
            >
              <Play className="text-white w-5 h-5 fill-current ml-0.5" />
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="font-bold text-white truncate group-hover:text-purple-300 transition-colors">{track.title}</h3>
          <p className="text-sm text-gray-400 truncate">{track.artist}</p>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {platformIcon}
              <span className="text-xs text-gray-500">{platformName}</span>
            </div>
            {track.aiScore && (
              <Badge className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-300 border-purple-500/30 text-xs">
                AI: {track.aiScore}%
              </Badge>
            )}
          </div>

          <div className="flex space-x-1">
            {track.spotifyUrl && (
              <Button size="sm" variant="ghost" className="p-1 h-6 w-6">
                <ExternalLink className="w-3 h-3" />
              </Button>
            )}
            {track.youtubeUrl && (
              <Button size="sm" variant="ghost" className="p-1 h-6 w-6">
                <Youtube className="w-3 h-3" />
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface TrendingCardProps {
  track: any;
  position: number;
  onPlay: () => void;
}

function TrendingCard({ track, position, onPlay }: TrendingCardProps) {
  return (
    <Card className="group glass-effect border-white/10 hover:border-orange-500/30 transition-all duration-300 hover:scale-105">
      <CardContent className="p-4">
        <div className="relative mb-3">
          <div className="absolute top-2 left-2 z-10">
            <div className="w-6 h-6 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
              {position}
            </div>
          </div>
          <img 
            src={track.imageUrl || "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300"}
            alt={track.title}
            className="w-full aspect-square object-cover rounded-lg"
          />
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
            <Button 
              size="icon"
              className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 rounded-full shadow-2xl"
              onClick={onPlay}
            >
              <Play className="text-white w-5 h-5 fill-current ml-0.5" />
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="font-bold text-white truncate group-hover:text-orange-300 transition-colors">{track.title}</h3>
          <p className="text-sm text-gray-400 truncate">{track.artist}</p>
          
          {track.popularity && (
            <div className="flex items-center space-x-2">
              <div className="flex-1 bg-gray-600 rounded-full h-1">
                <div 
                  className="bg-gradient-to-r from-orange-500 to-red-500 h-1 rounded-full transition-all duration-300"
                  style={{ width: `${track.popularity}%` }}
                />
              </div>
              <span className="text-xs text-gray-500">{track.popularity}%</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}