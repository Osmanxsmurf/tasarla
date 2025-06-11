import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Sparkles, 
  Music, 
  Play, 
  Heart, 
  Search,
  Wand2,
  Volume2,
  Headphones,
  Star,
  Zap
} from 'lucide-react';

const moodCategories = [
  { name: 'Mutlu', emoji: '😊', color: 'from-amber-400 via-yellow-400 to-orange-500', description: 'Neşeli ve pozitif enerjik müzikler', shadow: 'shadow-amber-500/25' },
  { name: 'Sakin', emoji: '😌', color: 'from-blue-400 via-cyan-400 to-teal-500', description: 'Huzurlu ve meditasyon müzikleri', shadow: 'shadow-blue-500/25' },
  { name: 'Romantik', emoji: '💕', color: 'from-pink-400 via-rose-400 to-red-500', description: 'Aşk ve duygusal şarkılar', shadow: 'shadow-pink-500/25' },
  { name: 'Enerjik', emoji: '⚡', color: 'from-orange-400 via-red-400 to-pink-500', description: 'Motivasyon ve egzersiz müzikleri', shadow: 'shadow-red-500/25' },
  { name: 'Nostaljik', emoji: '🌙', color: 'from-purple-400 via-indigo-400 to-blue-500', description: 'Eski güzel günler', shadow: 'shadow-purple-500/25' },
  { name: 'Odaklanmış', emoji: '🎯', color: 'from-green-400 via-emerald-400 to-cyan-500', description: 'Çalışma ve konsantrasyon', shadow: 'shadow-green-500/25' },
];

export function DiscoverView() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMood, setSelectedMood] = useState<string | null>(null);

  return (
    <div className="min-h-screen p-8 space-y-12">
      {/* Ultra Modern Hero Section */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-orange-500/20 rounded-3xl blur-3xl"></div>
        <div className="relative text-center space-y-8 p-12 bg-white/5 backdrop-blur-3xl rounded-3xl border border-white/10">
          <div className="flex items-center justify-center space-x-4">
            <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl shadow-2xl shadow-purple-500/50">
              <Sparkles className="w-8 h-8 text-white animate-pulse" />
            </div>
            <h1 className="text-5xl font-black bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent">
              Marjinal AI
            </h1>
            <div className="p-3 bg-gradient-to-r from-pink-500 to-orange-500 rounded-2xl shadow-2xl shadow-pink-500/50">
              <Wand2 className="w-8 h-8 text-white animate-bounce" />
            </div>
          </div>
          <p className="text-2xl text-white/90 max-w-3xl mx-auto font-light leading-relaxed">
            Yapay zeka gücüyle müzik dünyasını keşfedin. Ruh halinizi anlayan, zevkinizi öğrenen akıllı asistanınız.
          </p>
          
          {/* Enhanced Search */}
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-1000"></div>
              <div className="relative flex items-center bg-black/50 backdrop-blur-xl rounded-2xl border border-white/20 p-2">
                <Search className="w-6 h-6 text-white/60 ml-4" />
                <Input
                  placeholder="Hangi müzik türünü keşfetmek istiyorsun?"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 bg-transparent border-none text-white placeholder-white/50 text-lg focus:outline-none focus:ring-0"
                />
                <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-xl px-8 py-3 text-white font-semibold shadow-lg">
                  <Wand2 className="w-5 h-5 mr-2" />
                  Keşfet
                </Button>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-3 justify-center">
              {['Turkish Pop', 'Jazz', 'Electronic', 'Rock', 'Classical', 'Hip Hop'].map((genre) => (
                <Badge 
                  key={genre}
                  className="bg-white/10 hover:bg-white/20 border-white/30 text-white/90 px-4 py-2 rounded-full cursor-pointer transition-all duration-300 hover:scale-105"
                >
                  {genre}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Artistic Mood Selection */}
      <div className="space-y-8">
        <div className="text-center space-y-4">
          <h2 className="text-4xl font-bold text-white flex items-center justify-center">
            <Heart className="w-8 h-8 mr-4 text-pink-400 animate-pulse" />
            Ruh Halinizi Seçin
            <Headphones className="w-8 h-8 ml-4 text-blue-400" />
          </h2>
          <p className="text-xl text-white/70">AI'ımız ruh halinizi anlayarak size özel müzikler önerecek</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {moodCategories.map((mood, index) => (
            <div
              key={mood.name}
              className={`group relative cursor-pointer transform transition-all duration-500 hover:scale-105 ${
                selectedMood === mood.name ? 'scale-105' : ''
              }`}
              onClick={() => setSelectedMood(mood.name)}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Glow Effect */}
              <div className={`absolute inset-0 bg-gradient-to-r ${mood.color} rounded-3xl opacity-0 group-hover:opacity-30 blur-xl transition-opacity duration-500`}></div>
              
              {/* Card */}
              <Card className={`relative bg-white/5 backdrop-blur-2xl border-white/10 rounded-3xl overflow-hidden ${mood.shadow} ${
                selectedMood === mood.name ? 'ring-2 ring-white/50 bg-white/10' : ''
              }`}>
                <CardContent className="p-8 text-center space-y-6">
                  {/* Animated Icon */}
                  <div className={`relative w-24 h-24 mx-auto rounded-3xl bg-gradient-to-br ${mood.color} flex items-center justify-center text-4xl shadow-2xl group-hover:rotate-12 transition-transform duration-500`}>
                    <div className="absolute inset-0 bg-white/20 rounded-3xl animate-pulse"></div>
                    <span className="relative z-10">{mood.emoji}</span>
                  </div>
                  
                  {/* Content */}
                  <div className="space-y-3">
                    <h3 className="text-2xl font-bold text-white">{mood.name}</h3>
                    <p className="text-white/70 leading-relaxed">{mood.description}</p>
                  </div>
                  
                  {/* Action Button */}
                  <Button 
                    className={`bg-gradient-to-r ${mood.color} hover:shadow-lg text-white rounded-2xl px-6 py-3 font-semibold group-hover:scale-110 transition-all duration-300`}
                  >
                    <Play className="w-5 h-5 mr-2" />
                    Dinle
                  </Button>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>

      {/* Premium Features Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* AI Recommendation Engine */}
        <Card className="bg-gradient-to-br from-purple-500/10 via-pink-500/10 to-orange-500/10 backdrop-blur-2xl border-white/10 rounded-3xl overflow-hidden">
          <CardContent className="p-8 space-y-6">
            <div className="flex items-center space-x-4">
              <div className="p-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl shadow-xl">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white">AI Öneri Motoru</h3>
                <p className="text-white/70">Gelişmiş algoritma ile kişisel öneriler</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Star className="w-5 h-5 text-yellow-400" />
                <span className="text-white/90">Dinleme geçmişinizi analiz eder</span>
              </div>
              <div className="flex items-center space-x-3">
                <Star className="w-5 h-5 text-yellow-400" />
                <span className="text-white/90">Ruh halinizi akıllıca tahmin eder</span>
              </div>
              <div className="flex items-center space-x-3">
                <Star className="w-5 h-5 text-yellow-400" />
                <span className="text-white/90">Yeni keşifler önerir</span>
              </div>
            </div>
            
            <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-2xl py-4 text-lg font-semibold">
              <Wand2 className="w-5 h-5 mr-2" />
              AI Önerilerini Gör
            </Button>
          </CardContent>
        </Card>

        {/* Smart Playlists */}
        <Card className="bg-gradient-to-br from-blue-500/10 via-cyan-500/10 to-teal-500/10 backdrop-blur-2xl border-white/10 rounded-3xl overflow-hidden">
          <CardContent className="p-8 space-y-6">
            <div className="flex items-center space-x-4">
              <div className="p-4 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl shadow-xl">
                <Volume2 className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white">Akıllı Listeler</h3>
                <p className="text-white/70">Otomatik oluşturulan playlist'ler</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Music className="w-5 h-5 text-cyan-400" />
                <span className="text-white/90">Günlük keşif listeleri</span>
              </div>
              <div className="flex items-center space-x-3">
                <Music className="w-5 h-5 text-cyan-400" />
                <span className="text-white/90">Ruh haline özel karışımlar</span>
              </div>
              <div className="flex items-center space-x-3">
                <Music className="w-5 h-5 text-cyan-400" />
                <span className="text-white/90">Trend bazlı koleksiyonlar</span>
              </div>
            </div>
            
            <Button className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-2xl py-4 text-lg font-semibold">
              <Play className="w-5 h-5 mr-2" />
              Listelerime Git
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}