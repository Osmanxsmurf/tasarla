import React from 'react';
import { DiscoverView } from './views/DiscoverView';
import { TrendingView } from './views/TrendingView';
import { FavoritesView } from './views/FavoritesView';
import { RecentView } from './views/RecentView';
import { PlayerView } from './views/PlayerView';

interface MainContentProps {
  activeView: string;
}

export function MainContent({ activeView }: MainContentProps) {
  const getViewTitle = (view: string) => {
    const titles: { [key: string]: { title: string; subtitle: string; emoji: string } } = {
      discover: { title: 'Müzik Keşfi', subtitle: 'Marjinal AI ile yeni müzikler keşfedin', emoji: '🎵' },
      trending: { title: 'Haftalık Trendler', subtitle: 'Bu hafta en popüler şarkılar', emoji: '📈' },
      favorites: { title: 'Favorilerim', subtitle: 'Beğendiğiniz şarkılar', emoji: '❤️' },
      recent: { title: 'Son Dinlenenler', subtitle: 'Yakın zamanda dinlediğiniz müzikler', emoji: '⏰' },
      player: { title: 'Şimdi Çalıyor', subtitle: 'Aktif müzik çalar', emoji: '🎶' },
    };
    return titles[view] || { title: 'Keşfet', subtitle: 'Müzik dünyasına dalın', emoji: '🎵' };
  };

  const { title, subtitle, emoji } = getViewTitle(activeView);

  const renderView = () => {
    switch (activeView) {
      case 'discover':
        return <DiscoverView />;
      case 'trending':
        return <TrendingView />;
      case 'favorites':
        return <FavoritesView />;
      case 'recent':
        return <RecentView />;
      case 'player':
        return <PlayerView />;
      default:
        return <DiscoverView />;
    }
  };

  return (
    <div className="flex-1 flex flex-col">
      {/* Modern Header */}
      <header className="h-20 bg-black/30 backdrop-blur-xl border-b border-white/10 flex items-center justify-between px-8">
        <div className="flex items-center space-x-4">
          <div className="text-3xl">{emoji}</div>
          <div>
            <h2 className="text-2xl font-bold text-white">{title}</h2>
            <p className="text-sm text-white/60 font-medium">{subtitle}</p>
          </div>
        </div>
        
        {/* AI Status Indicator */}
        <div className="flex items-center space-x-3 bg-white/5 px-4 py-2 rounded-full border border-white/10">
          <div className="w-2 h-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full animate-pulse"></div>
          <span className="text-sm text-white/80 font-medium">Marjinal AI Aktif</span>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 overflow-y-auto bg-transparent">
        {renderView()}
      </div>
    </div>
  );
}
