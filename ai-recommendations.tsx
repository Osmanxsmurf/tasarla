import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Play, Star, Brain } from "lucide-react";
import type { AIRecommendation } from "@/types/music";

interface AIRecommendationsProps {
  userId: number;
  onSongPlay?: (song: AIRecommendation) => void;
}

export function AIRecommendations({ userId, onSongPlay }: AIRecommendationsProps) {
  const { data: recommendations, isLoading, error } = useQuery({
    queryKey: ["/api/user", userId, "recommendations"],
    enabled: !!userId,
  });

  if (isLoading) {
    return <AIRecommendationsSkeleton />;
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-400">AI önerileri yüklenirken hata oluştu</p>
        <p className="text-sm text-gray-500 mt-2">Lütfen daha sonra tekrar deneyin</p>
      </div>
    );
  }

  if (!recommendations || recommendations.length === 0) {
    return (
      <div className="text-center py-8">
        <Brain className="w-12 h-12 ai-purple mx-auto mb-4" />
        <p className="text-gray-400">Henüz AI önerisi yok</p>
        <p className="text-sm text-gray-500 mt-2">Müzik dinlemeye başlayın, AI sizin için öneriler oluştursun</p>
      </div>
    );
  }

  return (
    <section className="mb-12">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <div className="gradient-border">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
              <Brain className="text-white w-6 h-6" />
            </div>
          </div>
          <div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              AI Önerileri
            </h2>
            <p className="text-sm text-gray-400">Size özel seçilmiş müzikler</p>
          </div>
        </div>
        <Button 
          variant="ghost" 
          className="glass-effect border border-purple-500/30 text-purple-400 hover:text-white hover:bg-purple-500/20 transition-all duration-300"
        >
          Tümünü Gör
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {recommendations.map((song: AIRecommendation) => (
          <AIRecommendationCard 
            key={song.id} 
            song={song} 
            onPlay={() => onSongPlay?.(song)} 
          />
        ))}
      </div>
    </section>
  );
}

interface AIRecommendationCardProps {
  song: AIRecommendation;
  onPlay: () => void;
}

function AIRecommendationCard({ song, onPlay }: AIRecommendationCardProps) {
  return (
    <div className="group relative">
      <div className="glass-effect border border-white/10 rounded-2xl p-5 hover:border-purple-500/30 transition-all duration-500 hover:scale-105 cursor-pointer">
        <div className="relative overflow-hidden rounded-xl mb-4">
          <img 
            src={song.imageUrl || `https://images.unsplash.com/photo-${1493225457124 + song.id}?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400`}
            alt={`${song.title} album cover`}
            className="w-full aspect-square object-cover transition-transform duration-500 group-hover:scale-110"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400";
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
            <Button 
              size="icon"
              className="w-14 h-14 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-full shadow-2xl transform scale-0 group-hover:scale-100 transition-transform duration-300 neon-glow"
              onClick={onPlay}
            >
              <Play className="text-white w-5 h-5 fill-current ml-0.5" />
            </Button>
          </div>
        </div>
        
        <div className="space-y-3">
          <div>
            <h3 className="font-bold text-white truncate group-hover:text-purple-300 transition-colors">{song.title}</h3>
            <p className="text-sm text-gray-400 truncate">{song.artist}</p>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  className={`w-3.5 h-3.5 transition-colors ${i < Math.floor(song.aiMatch / 20) ? 'text-purple-400 fill-current' : 'text-gray-600'}`} 
                />
              ))}
            </div>
            <Badge className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-300 border-purple-500/30 text-xs">
              {song.aiMatch}% Match
            </Badge>
          </div>

          {song.reason && (
            <div className="glass-effect p-2 rounded-lg border border-purple-500/20">
              <p className="text-xs text-purple-300 leading-relaxed">{song.reason}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function AIRecommendationsSkeleton() {
  return (
    <section className="mb-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Skeleton className="w-6 h-6 rounded" />
          <Skeleton className="w-48 h-8 rounded" />
        </div>
        <Skeleton className="w-24 h-6 rounded" />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="bg-gray-700 rounded-lg p-4">
            <Skeleton className="w-full aspect-square rounded-lg mb-4" />
            <Skeleton className="w-3/4 h-4 mb-2 rounded" />
            <Skeleton className="w-1/2 h-3 mb-2 rounded" />
            <div className="flex items-center justify-between">
              <div className="flex space-x-1">
                {[...Array(5)].map((_, j) => (
                  <Skeleton key={j} className="w-3 h-3 rounded" />
                ))}
              </div>
              <Skeleton className="w-16 h-4 rounded" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
