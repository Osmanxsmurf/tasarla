import React from 'react';
import { useSpotifyAuth } from '@/context/SpotifyAuthContext';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { 
  Sparkles, 
  Compass, 
  TrendingUp, 
  Heart, 
  Clock,
  Settings,
  LogOut,
  User,
  Play
} from 'lucide-react';
import { SiSpotify } from 'react-icons/si';

interface SidebarProps {
  activeView: string;
  onViewChange: (view: string) => void;
}

export function Sidebar({ activeView, onViewChange }: SidebarProps) {
  const { isAuthenticated, user, login, logout } = useSpotifyAuth();

  const navigationItems = [
    { id: 'discover', label: 'Keşfet', icon: Compass, color: 'text-blue-400', gradient: 'from-blue-400 to-cyan-400' },
    { id: 'trending', label: 'Haftalık Trendler', icon: TrendingUp, color: 'text-orange-400', gradient: 'from-orange-400 to-pink-400' },
    { id: 'favorites', label: 'Favorilerim', icon: Heart, color: 'text-red-400', gradient: 'from-red-400 to-pink-400' },
    { id: 'recent', label: 'Son Dinlenenler', icon: Clock, color: 'text-purple-400', gradient: 'from-purple-400 to-blue-400' },
    { id: 'player', label: 'Şimdi Çalıyor', icon: Play, color: 'text-green-400', gradient: 'from-green-400 to-emerald-400' },
  ];

  return (
    <aside className="w-72 bg-black/40 backdrop-blur-xl border-r border-white/10 flex flex-col">
      {/* Logo Section */}
      <div className="p-8 border-b border-white/10">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg">
            <Sparkles className="text-white text-xl animate-pulse" />
          </div>
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 bg-clip-text text-transparent">
              Müzik Asistanım
            </h1>
            <p className="text-sm text-white/60 font-medium">Marjinal AI ile keşfet</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-6">
        <ul className="space-y-3">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            
            return (
              <li key={item.id}>
                <button
                  onClick={() => onViewChange(item.id)}
                  className={`w-full flex items-center space-x-4 p-4 rounded-2xl transition-all duration-300 group ${
                    isActive 
                      ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 shadow-lg' 
                      : 'hover:bg-white/5 hover:backdrop-blur-md'
                  }`}
                >
                  <div className={`p-2 rounded-xl ${isActive ? `bg-gradient-to-r ${item.gradient}` : 'bg-white/10'} transition-all duration-300`}>
                    <Icon className={`w-5 h-5 ${isActive ? 'text-white' : item.color} transition-colors duration-300`} />
                  </div>
                  <span className={`font-medium ${isActive ? 'text-white' : 'text-white/80'} transition-colors duration-300`}>
                    {item.label}
                  </span>
                  {isActive && (
                    <div className="ml-auto w-2 h-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full animate-pulse"></div>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User Profile */}
      <div className="p-6 border-t border-white/10">
        {isAuthenticated && user ? (
          <div className="flex items-center space-x-4 p-4 rounded-2xl bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-white/10">
            <Avatar className="w-12 h-12 ring-2 ring-purple-400/30">
              <AvatarImage src={user.images?.[0]?.url} alt={user.display_name} />
              <AvatarFallback className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                <User className="w-6 h-6" />
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-white truncate">{user.display_name}</p>
              <div className="flex items-center space-x-2 mt-1">
                <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-xs">
                  <SiSpotify className="w-3 h-3 mr-1" />
                  Premium
                </Badge>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button variant="ghost" size="sm" className="text-white/60 hover:text-white hover:bg-white/10 rounded-xl">
                <Settings className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={logout} className="text-white/60 hover:text-white hover:bg-white/10 rounded-xl">
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center space-x-4 p-4 rounded-2xl bg-white/5 border border-white/10">
              <Avatar className="w-12 h-12 bg-gradient-to-r from-gray-600 to-gray-500">
                <AvatarFallback className="bg-gradient-to-r from-gray-600 to-gray-500 text-white">
                  <User className="w-6 h-6" />
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="font-semibold text-white">Misafir Kullanıcı</p>
                <p className="text-sm text-white/60">Deneyimi kişiselleştirin</p>
              </div>
            </div>
            <Button 
              onClick={login} 
              className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-2xl py-3 font-semibold shadow-lg"
            >
              <SiSpotify className="w-5 h-5 mr-2" />
              Spotify'a Bağlan
            </Button>
          </div>
        )}
      </div>
    </aside>
  );
}
