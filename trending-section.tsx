import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Play, Flame, TrendingUp } from "lucide-react";
import type { TrendingSong } from "@/types/music";

interface TrendingSectionProps {
  onSongPlay?: (song: TrendingSong) => void;
}

export function TrendingSection({ onSongPlay }: TrendingSectionProps) {
  const { data: trendingSongs, isLoading, error } = useQuery({
    queryKey: ["/api/songs/trending"],
    select: (data) => data?.slice(0, 10) || [], // Limit to top 10
  });

  if (isLoading) {
    return <TrendingSkeleton />;
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-400">Trend şarkılar yüklenirken hata oluştu</p>
        <p className="text-sm text-gray-500 mt-2">Lütfen daha sonra tekrar deneyin</p>
      </div>
    );
  }

  if (!trendingSongs || trendingSongs.length === 0) {
    return (
      <div className="text-center py-8">
        <Flame className="w-12 h-12 text-orange-500 mx-auto mb-4" />
        <p className="text-gray-400">Henüz trend şarkı yok</p>
        <p className="text-sm text-gray-500 mt-2">Yakında popüler şarkıları burada göreceksiniz</p>
      </div>
    );
  }

  // Mock trending data with positions and percentages
  const mockTrendingData = [
    { position: 1, title: "Sen Anlat Karadeniz", artist: "Sezen Aksu", trendPercentage: 24, imageUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100" },
    { position: 2, title: "Gel Gör Beni Aşk Neyledi", artist: "Tarkan", trendPercentage: 18, imageUrl: "https://images.unsplash.com/photo-1571330735066-03aaa9429d89?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100" },
    { position: 3, title: "Derdim Olsun", artist: "Manga", trendPercentage: 15, imageUrl: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100" },
    { position: 4, title: "Aşk Laftan Anlamaz", artist: "Buray", trendPercentage: 12, imageUrl: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100" },
    { position: 5, title: "Unuturum Elbet", artist: "Murat Boz", trendPercentage: 10, imageUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100" },
  ];

  return (
    <section>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold flex items-center space-x-3">
          <Flame className="text-orange-500 w-6 h-6" />
          <span>Türkiye'de Trend</span>
        </h2>
        <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
          Tümünü Gör
        </Button>
      </div>
      
      <div className="space-y-4">
        {mockTrendingData.map((song) => (
          <TrendingItem 
            key={song.position} 
            song={song} 
            onPlay={() => onSongPlay?.(song as TrendingSong)} 
          />
        ))}
      </div>
    </section>
  );
}

interface TrendingItemProps {
  song: {
    position: number;
    title: string;
    artist: string;
    trendPercentage: number;
    imageUrl: string;
  };
  onPlay: () => void;
}

function TrendingItem({ song, onPlay }: TrendingItemProps) {
  return (
    <div className="flex items-center space-x-4 p-4 rounded-lg hover:bg-white/5 transition-colors cursor-pointer group">
      <div className="text-lg font-bold text-gray-400 w-6">
        #{song.position}
      </div>
      
      <img 
        src={song.imageUrl}
        alt={`${song.title} cover`}
        className="w-12 h-12 rounded-lg object-cover"
        onError={(e) => {
          const target = e.target as HTMLImageElement;
          target.src = "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100";
        }}
      />
      
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold truncate">{song.title}</h3>
        <p className="text-sm text-gray-400 truncate">{song.artist}</p>
      </div>
      
      <div className="flex items-center space-x-3">
        <Badge variant="secondary" className="bg-green-500/20 text-green-400">
          <TrendingUp className="w-3 h-3 mr-1" />
          +{song.trendPercentage}%
        </Badge>
        
        <Button 
          variant="ghost" 
          size="icon"
          className="opacity-0 group-hover:opacity-100 transition-opacity hover:text-green-400"
          onClick={onPlay}
        >
          <Play className="w-5 h-5 fill-current" />
        </Button>
      </div>
    </div>
  );
}

function TrendingSkeleton() {
  return (
    <section>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Skeleton className="w-6 h-6 rounded" />
          <Skeleton className="w-48 h-8 rounded" />
        </div>
        <Skeleton className="w-24 h-6 rounded" />
      </div>
      
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center space-x-4 p-4">
            <Skeleton className="w-6 h-6 rounded" />
            <Skeleton className="w-12 h-12 rounded-lg" />
            <div className="flex-1">
              <Skeleton className="w-3/4 h-4 mb-2 rounded" />
              <Skeleton className="w-1/2 h-3 rounded" />
            </div>
            <Skeleton className="w-16 h-6 rounded" />
            <Skeleton className="w-8 h-8 rounded" />
          </div>
        ))}
      </div>
    </section>
  );
}
