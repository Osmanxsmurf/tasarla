import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Volume2, 
  VolumeX, 
  Repeat, 
  Shuffle, 
  Heart,
  Share2,
  Download,
  Radio,
  Mic2,
  Music,
  ListMusic,
  Users
} from 'lucide-react';

const currentTrack = {
  id: 1,
  title: "Bohemian Rhapsody",
  artist: "Queen",
  album: "A Night at the Opera",
  duration: 355, // seconds
  image: "👑",
  color: "from-yellow-500 to-orange-500",
  audioUrl: "/audio/sample-track.mp3" // Would be real URL in production
};

const queue = [
  {
    id: 2,
    title: "Imagine",
    artist: "John Lennon",
    album: "Imagine",
    duration: 181,
    image: "🕊️",
    color: "from-blue-500 to-cyan-500"
  },
  {
    id: 3,
    title: "Hotel California",
    artist: "Eagles",
    album: "Hotel California",
    duration: 390,
    image: "🌴",
    color: "from-orange-500 to-red-500"
  },
  {
    id: 4,
    title: "Stairway to Heaven",
    artist: "Led Zeppelin",
    album: "Led Zeppelin IV",
    duration: 482,
    image: "⚡",
    color: "from-purple-500 to-pink-500"
  }
];

export function PlayerView() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState([75]);
  const [isMuted, setIsMuted] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement>(null);

  // Simulate audio playback progress
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTime(prev => {
          if (prev >= currentTrack.duration) {
            setIsPlaying(false);
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
    }
  };

  const handleProgressChange = (value: number[]) => {
    const newTime = value[0];
    setCurrentTime(newTime);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
  };

  const handleVolumeChange = (value: number[]) => {
    setVolume(value);
    setIsMuted(false);
    if (audioRef.current) {
      audioRef.current.volume = value[0] / 100;
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
    }
  };

  const progress = (currentTime / currentTrack.duration) * 100;

  return (
    <div className="min-h-screen p-8 space-y-8">
      {/* Hidden audio element for actual playback */}
      <audio ref={audioRef} src={currentTrack.audioUrl} />
      
      {/* Now Playing Header */}
      <div className="text-center space-y-4">
        <Badge className="bg-green-500/20 text-green-400 border-green-500/30 px-4 py-2">
          <Radio className="w-4 h-4 mr-2" />
          Şimdi Çalıyor
        </Badge>
        <h1 className="text-3xl font-bold text-white">Müzik Çalar</h1>
      </div>

      {/* Main Player */}
      <div className="max-w-2xl mx-auto">
        <Card className="bg-white/5 backdrop-blur-3xl border-white/10 shadow-2xl">
          <CardContent className="p-8 space-y-8">
            {/* Album Art */}
            <div className="relative">
              <div className={`w-80 h-80 mx-auto rounded-3xl bg-gradient-to-br ${currentTrack.color} flex items-center justify-center shadow-2xl ${isPlaying ? 'animate-pulse' : ''}`}>
                <span className="text-8xl">{currentTrack.image}</span>
              </div>
              {isPlaying && (
                <div className="absolute inset-0 rounded-3xl bg-white/10 animate-ping"></div>
              )}
            </div>

            {/* Track Info */}
            <div className="text-center space-y-3">
              <h2 className="text-3xl font-bold text-white">{currentTrack.title}</h2>
              <p className="text-xl text-white/70">{currentTrack.artist}</p>
              <p className="text-lg text-white/50">{currentTrack.album}</p>
            </div>

            {/* Progress Bar */}
            <div className="space-y-3">
              <Slider
                value={[currentTime]}
                max={currentTrack.duration}
                step={1}
                onValueChange={handleProgressChange}
                className="cursor-pointer"
              />
              <div className="flex items-center justify-between text-sm text-white/60">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(currentTrack.duration)}</span>
              </div>
            </div>

            {/* Main Controls */}
            <div className="flex items-center justify-center space-x-8">
              <Button
                variant={isShuffle ? 'default' : 'outline'}
                size="lg"
                onClick={() => setIsShuffle(!isShuffle)}
                className="w-14 h-14 rounded-full"
              >
                <Shuffle className="w-6 h-6" />
              </Button>
              
              <Button
                size="lg"
                className="w-16 h-16 rounded-full bg-white/10 hover:bg-white/20 text-white"
              >
                <SkipBack className="w-8 h-8" />
              </Button>
              
              <Button
                onClick={handlePlayPause}
                size="lg"
                className="w-20 h-20 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white shadow-2xl"
              >
                {isPlaying ? (
                  <Pause className="w-10 h-10" />
                ) : (
                  <Play className="w-10 h-10" />
                )}
              </Button>
              
              <Button
                size="lg"
                className="w-16 h-16 rounded-full bg-white/10 hover:bg-white/20 text-white"
              >
                <SkipForward className="w-8 h-8" />
              </Button>
              
              <Button
                variant={isRepeat ? 'default' : 'outline'}
                size="lg"
                onClick={() => setIsRepeat(!isRepeat)}
                className="w-14 h-14 rounded-full"
              >
                <Repeat className="w-6 h-6" />
              </Button>
            </div>

            {/* Secondary Controls */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsLiked(!isLiked)}
                  className={`text-white/60 hover:text-white ${isLiked ? 'text-red-500' : ''}`}
                >
                  <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white/60 hover:text-white"
                >
                  <Share2 className="w-5 h-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white/60 hover:text-white"
                >
                  <Download className="w-5 h-5" />
                </Button>
              </div>

              {/* Volume Control */}
              <div className="flex items-center space-x-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleMute}
                  className="text-white/60 hover:text-white"
                >
                  {isMuted || volume[0] === 0 ? (
                    <VolumeX className="w-5 h-5" />
                  ) : (
                    <Volume2 className="w-5 h-5" />
                  )}
                </Button>
                <div className="w-24">
                  <Slider
                    value={isMuted ? [0] : volume}
                    max={100}
                    step={1}
                    onValueChange={handleVolumeChange}
                    className="cursor-pointer"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Queue */}
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white flex items-center">
            <ListMusic className="w-6 h-6 mr-3 text-purple-400" />
            Sıradaki Şarkılar
          </h2>
          <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">
            {queue.length} şarkı
          </Badge>
        </div>
        
        <div className="space-y-3">
          {queue.map((track, index) => (
            <Card
              key={track.id}
              className="bg-white/5 backdrop-blur-2xl border-white/10 hover:bg-white/10 transition-all duration-300 cursor-pointer"
            >
              <CardContent className="p-4">
                <div className="flex items-center space-x-4">
                  <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white/60 text-sm font-semibold">
                    {index + 1}
                  </div>
                  
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${track.color} flex items-center justify-center shadow-lg`}>
                    <span className="text-lg">{track.image}</span>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-white truncate">{track.title}</h3>
                    <p className="text-sm text-white/70 truncate">{track.artist}</p>
                  </div>
                  
                  <div className="text-sm text-white/60">
                    {formatTime(track.duration)}
                  </div>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-white/60 hover:text-white"
                  >
                    <Play className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Listening Together */}
      <Card className="max-w-2xl mx-auto bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 backdrop-blur-2xl border-white/10">
        <CardContent className="p-8 text-center space-y-6">
          <div className="flex items-center justify-center space-x-3">
            <Users className="w-8 h-8 text-blue-400" />
            <h3 className="text-2xl font-bold text-white">Birlikte Dinle</h3>
          </div>
          <p className="text-white/70 text-lg">
            Arkadaşlarınızla aynı anda müzik dinleyin ve sohbet edin
          </p>
          <div className="flex items-center justify-center space-x-4">
            <Button className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-2xl px-6 py-3">
              <Users className="w-5 h-5 mr-2" />
              Oda Oluştur
            </Button>
            <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 rounded-2xl px-6 py-3">
              <Mic2 className="w-5 h-5 mr-2" />
              Odaya Katıl
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}