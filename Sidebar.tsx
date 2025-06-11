import React from 'react';
import { Link, useLocation } from 'wouter';
import { Home, Search, Heart, ListMusic, User, X, Brain, Sparkles, Youtube } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetClose } from '@/components/ui/sheet';
import { MoodSelector } from './MoodSelector';
import { cn } from '@/lib/utils';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  currentPath: string;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, currentPath }) => {
  const [location] = useLocation();
  const menuItems = [
    { icon: <Home className="h-5 w-5" />, label: 'Ana Sayfa', path: '/' },
    { icon: <Search className="h-5 w-5" />, label: 'Ara', path: '/search' },
    { icon: <Brain className="h-5 w-5" />, label: 'Yapay Zeka', path: '/ai' },
    { icon: <Sparkles className="h-5 w-5" />, label: 'Günlük Keşif', path: '/discovery' },
    { icon: <Youtube className="h-5 w-5" />, label: 'Videolar', path: '/videos' },
  ];
  
  const libraryItems = [
    { icon: <Heart className="h-5 w-5" />, label: 'Beğendiklerim', path: '/favorites' },
    { icon: <ListMusic className="h-5 w-5" />, label: 'Çalma Listem', path: '/playlist' },
    { icon: <User className="h-5 w-5" />, label: 'Profilim', path: '/profile' },
  ];
  
  const sidebarContent = (
    <>
      <div className="mb-8">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <span className="bg-primary text-primary-foreground p-1 rounded">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
            </svg>
          </span>
          Müzik Asistanım
        </h1>
      </div>
      
      <nav className="space-y-6">
        <div>
          <h2 className="text-muted-foreground uppercase text-xs font-bold tracking-wider mb-4">
            Menü
          </h2>
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.path}>
                <Link href={item.path}>
                  <a className={cn(
                    "flex items-center gap-3 p-2 rounded-md hover:bg-secondary transition-all",
                    currentPath === item.path && "bg-primary bg-opacity-20 text-primary hover:bg-opacity-30"
                  )}>
                    {item.icon}
                    {item.label}
                  </a>
                </Link>
              </li>
            ))}
          </ul>
        </div>
        
        <div>
          <h2 className="text-muted-foreground uppercase text-xs font-bold tracking-wider mb-4">
            Kütüphanem
          </h2>
          <ul className="space-y-2">
            {libraryItems.map((item) => (
              <li key={item.path}>
                <Link href={item.path}>
                  <a className={cn(
                    "flex items-center gap-3 p-2 rounded-md hover:bg-secondary transition-all",
                    currentPath === item.path && "bg-primary bg-opacity-20 text-primary hover:bg-opacity-30"
                  )}>
                    {item.icon}
                    {item.label}
                  </a>
                </Link>
              </li>
            ))}
          </ul>
        </div>
        
        <div className="mt-auto pt-6">
          <h2 className="text-muted-foreground uppercase text-xs font-bold tracking-wider mb-4">
            Ruh Halleri
          </h2>
          <MoodSelector />
        </div>
      </nav>
    </>
  );
  
  // For mobile: use Sheet component
  // For desktop: use fixed sidebar
  return (
    <>
      {/* Mobile Sidebar */}
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent side="left" className="bg-surface p-4 w-80">
          <SheetHeader className="text-left">
            <div className="flex justify-between items-center">
              <SheetTitle>Müzik Asistanım</SheetTitle>
              <SheetClose asChild>
                <Button variant="ghost" size="icon">
                  <X className="h-5 w-5" />
                </Button>
              </SheetClose>
            </div>
          </SheetHeader>
          <div className="mt-8">
            {sidebarContent}
          </div>
        </SheetContent>
      </Sheet>
      
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-surface p-4 overflow-y-auto">
        {sidebarContent}
      </aside>
    </>
  );
};

export default Sidebar;
