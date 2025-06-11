import React from 'react';
import { Link, useLocation } from 'wouter';
import { cn } from '@/lib/utils';
import { Music, Home, Search, User, Disc, Sparkles, BarChart2 } from 'lucide-react';

const Sidebar = () => {
  const [location] = useLocation();

  const isActiveRoute = (route: string) => {
    return location === route;
  };

  return (
    <aside className="hidden md:flex flex-col w-64 bg-card border-r border-border h-full">
      {/* Logo */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
            <Music className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-xl font-bold">Müzik Asistanım</h1>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 overflow-y-auto py-4 px-2">
        <ul className="space-y-1">
          <li>
            <Link href="/">
              <div className={cn(
                "flex items-center px-3 py-2 text-sm rounded-md font-medium",
                isActiveRoute("/") 
                  ? "bg-primary/20 text-primary" 
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
              )}>
                <Home className="w-5 h-5 mr-3" />
                Ana Sayfa
              </div>
            </Link>
          </li>
          <li>
            <Link href="/explore">
              <div className={cn(
                "flex items-center px-3 py-2 text-sm rounded-md font-medium",
                isActiveRoute("/explore") 
                  ? "bg-primary/20 text-primary" 
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
              )}>
                <Search className="w-5 h-5 mr-3" />
                Keşfet
              </div>
            </Link>
          </li>
          <li>
            <Link href="/artists">
              <div className={cn(
                "flex items-center px-3 py-2 text-sm rounded-md font-medium",
                isActiveRoute("/artists") 
                  ? "bg-primary/20 text-primary" 
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
              )}>
                <User className="w-5 h-5 mr-3" />
                Sanatçılar
              </div>
            </Link>
          </li>
          <li>
            <Link href="/albums">
              <div className={cn(
                "flex items-center px-3 py-2 text-sm rounded-md font-medium",
                isActiveRoute("/albums") 
                  ? "bg-primary/20 text-primary" 
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
              )}>
                <Disc className="w-5 h-5 mr-3" />
                Albümler
              </div>
            </Link>
          </li>
          <li>
            <Link href="/recommendations">
              <div className={cn(
                "flex items-center px-3 py-2 text-sm rounded-md font-medium",
                isActiveRoute("/recommendations") 
                  ? "bg-primary/20 text-primary" 
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
              )}>
                <Sparkles className="w-5 h-5 mr-3" />
                Öneriler
              </div>
            </Link>
          </li>
          <li>
            <Link href="/visualizer">
              <div className={cn(
                "flex items-center px-3 py-2 text-sm rounded-md font-medium",
                isActiveRoute("/visualizer") 
                  ? "bg-primary/20 text-primary" 
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
              )}>
                <BarChart2 className="w-5 h-5 mr-3" />
                Görselleştirici
              </div>
            </Link>
          </li>
        </ul>

        <div className="mt-8 px-3">
          <h3 className="text-xs uppercase text-muted-foreground font-medium tracking-wider mb-2">Çalma Listeleri</h3>
          <ul className="space-y-1">
            <li>
              <a href="#" className="flex items-center px-3 py-2 text-sm rounded-md text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors">
                <span className="w-2 h-2 bg-primary rounded-full mr-3"></span>
                Favori Parçalarım
              </a>
            </li>
            <li>
              <a href="#" className="flex items-center px-3 py-2 text-sm rounded-md text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors">
                <span className="w-2 h-2 bg-purple-500 rounded-full mr-3"></span>
                Keşfedilecekler
              </a>
            </li>
            <li>
              <a href="#" className="flex items-center px-3 py-2 text-sm rounded-md text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors">
                <span className="w-2 h-2 bg-pink-500 rounded-full mr-3"></span>
                En Çok Dinlenenler
              </a>
            </li>
          </ul>
        </div>
      </nav>

      {/* User Menu */}
      <div className="p-4 border-t border-border mt-auto">
        <Link href="/profile">
          <div className="flex items-center space-x-2 w-full hover:bg-secondary p-2 rounded-md transition-colors">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
              <span className="text-xs font-medium">MK</span>
            </div>
            <span className="text-sm font-medium truncate">Müzik Kullanıcısı</span>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 ml-auto">
              <path d="m6 9 6 6 6-6"></path>
            </svg>
          </div>
        </Link>
      </div>
    </aside>
  );
};

export default Sidebar;
