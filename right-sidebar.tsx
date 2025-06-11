import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Shuffle, 
  Repeat,
  Volume2,
  Heart,
  ListMusic,
  Share2,
  Settings,
  Brain
} from "lucide-react";
import type { PlayingTrack, MoodAnalysis } from "@/types/music";

interface RightSidebarProps {
  currentTrack?: PlayingTrack;
  onPlayPause?: () => void;
  onNext?: () => void;
  onPrevious?: () => void;
}

export function RightSidebar({ 
  currentTrack, 
  onPlayPause, 
  onNext, 
  onPrevious 
}: RightSidebarProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  
  // Mock data for demonstration
  const mockTrack: PlayingTrack = currentTrack || {
    id: 1,
    title: "Elektronik Rüya",
    artist: "Kenan Doğulu",
    album: "Modern Hits",
    duration: 225, // 3:45
    currentTime: 83, // 1:23
    isPlaying: false,
    volume: 0.8,
    imageUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300"
  };

  const mockMoodAnalysis: MoodAnalysis = {
    mood: "Enerjik",
    confidence: 0.85,
    energy: 0.85,
    valence: 0.72,
    tempo: 128
  };

  const progress = mockTrack.duration > 0 ? (mockTrack.currentTime / mockTrack.duration) * 100 : 0;

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
    onPlayPause?.();
  };

  return (
    <aside className="w-80 bg-gray-800 border-l border-white/10 p-6 flex flex-col">
      {/* Now Playing */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4">Şu An Çalıyor</h3>
        <div className="bg-gray-700 rounded-xl p-4">
          <img 
            src={mockTrack.imageUrl} 
            alt={`${mockTrack.title} album cover`}
            className="w-full aspect-square object-cover rounded-lg mb-4"
          />
          <h4 className="font-semibold mb-1 truncate">{mockTrack.title}</h4>
          <p className="text-sm text-gray-400 mb-4 truncate">{mockTrack.artist}</p>
          
          {/* Progress Bar */}
          <div className="mb-4">
            <div className="flex justify-between text-xs text-gray-400 mb-2">
              <span>{formatTime(mockTrack.currentTime)}</span>
              <span>{formatTime(mockTrack.duration)}</span>
            </div>
            <Progress value={progress} className="h-1" />
          </div>
          
          {/* Controls */}
          <div className="flex items-center justify-center space-x-6">
            <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
              <Shuffle className="w-4 h-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-gray-400 hover:text-white"
              onClick={onPrevious}
            >
              <SkipBack className="w-4 h-4" />
            </Button>
            <Button 
              size="icon"
              className="w-10 h-10 bg-white text-black hover:bg-gray-200 hover:scale-105"
              onClick={handlePlayPause}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-gray-400 hover:text-white"
              onClick={onNext}
            >
              <SkipForward className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
              <Repeat className="w-4 h-4" />
            </Button>
          </div>

          {/* Volume */}
          <div className="flex items-center space-x-2 mt-4">
            <Volume2 className="w-4 h-4 text-gray-400" />
            <Progress value={mockTrack.volume * 100} className="flex-1 h-1" />
          </div>
        </div>
      </div>

      {/* AI Mood Analysis */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
          <Brain className="ai-purple w-5 h-5" />
          <span>Ruh Hali Analizi</span>
        </h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
            <span className="text-sm">Enerjik</span>
            <div className="flex items-center space-x-2">
              <Progress value={85} className="w-20 h-2" />
              <span className="text-xs text-gray-400">85%</span>
            </div>
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
            <span className="text-sm">Mutlu</span>
            <div className="flex items-center space-x-2">
              <Progress value={72} className="w-20 h-2" />
              <span className="text-xs text-gray-400">72%</span>
            </div>
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
            <span className="text-sm">Odaklanmış</span>
            <div className="flex items-center space-x-2">
              <Progress value={68} className="w-20 h-2" />
              <span className="text-xs text-gray-400">68%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex-1">
        <h3 className="text-lg font-semibold mb-4">Hızlı İşlemler</h3>
        <div className="space-y-3">
          <Button 
            variant="ghost" 
            className="w-full flex items-center space-x-3 p-3 bg-gray-700 hover:bg-gray-600 justify-start"
          >
            <ListMusic className="ai-blue w-4 h-4" />
            <span className="text-sm">AI Çalma Listesi Oluştur</span>
          </Button>
          <Button 
            variant="ghost" 
            className="w-full flex items-center space-x-3 p-3 bg-gray-700 hover:bg-gray-600 justify-start"
          >
            <Share2 className="ai-purple w-4 h-4" />
            <span className="text-sm">Müzik Paylaş</span>
          </Button>
          <Button 
            variant="ghost" 
            className="w-full flex items-center space-x-3 p-3 bg-gray-700 hover:bg-gray-600 justify-start"
          >
            <Settings className="ai-cyan w-4 h-4" />
            <span className="text-sm">AI Ayarları</span>
          </Button>
          <Button 
            variant="ghost" 
            className="w-full flex items-center space-x-3 p-3 bg-gray-700 hover:bg-gray-600 justify-start"
          >
            <Heart className="text-red-400 w-4 h-4" />
            <span className="text-sm">Favorilere Ekle</span>
          </Button>
        </div>
      </div>
    </aside>
  );
}
