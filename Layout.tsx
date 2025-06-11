import React, { createContext, useState, useEffect } from 'react';
import { useLocation, Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Switch } from '@/components/ui/switch';
import { MusicPlayerWithYouTube } from '@/components/MusicPlayerWithYouTube';
import { AIAssistant } from '@/components/AIAssistant';
import { 
  Music, 
  Search, 
  Sun, 
  Moon, 
  User, 
  Library, 
  Home, 
  Bot, 
  LogOut,
  Menu,
  X,
  Heart,
  History,
  Clock,
  PlusCircle
} from 'lucide-react';
import { Song } from '@shared/schema';
import { useAudio } from '@/hooks/use-audio';
import { useOffline } from '@/hooks/use-offline';
import { useToast } from '@/hooks/use-toast';
import { LOCAL_STORAGE_KEYS } from '@/lib/constants';
import { getStoredData, setStoredData } from '@/lib/localStorage';
import { cn } from '@/lib/utils';
import { Drawer } from 'vaul';
import { useMobile } from '@/hooks/use-mobile';
import { registerServiceWorker } from '@/lib/service-worker';
import { APP_NAME } from '@/lib/constants';
import { motion, AnimatePresence } from 'framer-motion';

// Context for the music player
interface MusicPlayerContextType {
  currentSong: Song | null;
  playSong: (song: Song) => void;
  playerState: 'playing' | 'paused' | 'loading' | 'error' | 'ended';
}

export const MusicPlayerContext = createContext<MusicPlayerContextType>({
  currentSong: null,
  playSong: () => {},
  playerState: 'paused'
});

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { toast } = useToast();
  const [location] = useLocation();
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [offlineMode, setOfflineMode] = useState(false);
  const [dataSaver, setDataSaver] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAIAssistantOpen, setIsAIAssistantOpen] = useState(false);
  const isMobile = useMobile();
  
  // Music player state
  const { 
    currentSong, 
    playerState, 
    playSong, 
    togglePlayPause 
  } = useAudio();
  
  // Offline mode handling
  const { 
    isOffline: isNetworkOffline, 
    offlineMode: offlineModePreference,
    toggleOfflineMode,
    prefetchOfflineData
  } = useOffline();
  
  // Service worker registration
  useEffect(() => {
    const setupServiceWorker = async () => {
      const result = await registerServiceWorker();
      if (!result.success) {
        console.warn('Service worker registration failed:', result.error);
      }
    };
    
    setupServiceWorker();
  }, []);
  
  // Load user preferences
  useEffect(() => {
    // Load theme preference
    getStoredData<'light' | 'dark'>(LOCAL_STORAGE_KEYS.THEME, 'dark').then(savedTheme => {
      setTheme(savedTheme);
      document.documentElement.classList.toggle('dark', savedTheme === 'dark');
    });
    
    // Load offline mode preference
    getStoredData<boolean>(LOCAL_STORAGE_KEYS.OFFLINE_MODE, false).then(setOfflineMode);
    
    // Load data saver preference (default to true)
    getStoredData<boolean>('dataSaver', true).then(setDataSaver);
  }, []);
  
  // Watch for network status changes
  useEffect(() => {
    if (isNetworkOffline) {
      toast({
        title: "Çevrimdışı Mod",
        description: "İnternet bağlantınız kesildi. Çevrimdışı içerikler kullanılabilir.",
        duration: 5000,
      });
    }
  }, [isNetworkOffline, toast]);
  
  // Toggle theme
  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
    setStoredData(LOCAL_STORAGE_KEYS.THEME, newTheme);
  };
  
  // Toggle offline mode
  const handleToggleOfflineMode = async () => {
    const newMode = !offlineMode;
    setOfflineMode(newMode);
    await setStoredData(LOCAL_STORAGE_KEYS.OFFLINE_MODE, newMode);
    
    if (newMode) {
      // Prefetch data for offline use
      toast({
        title: "Çevrimdışı Mod Aktif",
        description: "Veriler indiriliyor, lütfen bekleyin...",
      });
      
      const success = await prefetchOfflineData();
      
      if (success) {
        toast({
          title: "Çevrimdışı Kullanıma Hazır",
          description: "Gerekli veriler başarıyla indirildi.",
        });
      } else {
        toast({
          title: "Uyarı",
          description: "Bazı veriler indirilemedi. Çevrimdışı modda sınırlı içerik kullanılabilir.",
          variant: "destructive",
        });
      }
    }
    
    toggleOfflineMode();
  };
  
  // Toggle data saver
  const handleToggleDataSaver = async () => {
    const newMode = !dataSaver;
    setDataSaver(newMode);
    await setStoredData('dataSaver', newMode);
    
    toast({
      title: newMode ? "Veri Tasarrufu Aktif" : "Veri Tasarrufu Devre Dışı",
      description: newMode 
        ? "Daha düşük kalitede ses ve görüntü kullanılacak." 
        : "Yüksek kalitede içerik kullanılacak.",
    });
  };
  
  // Close menu when location changes (mobile)
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);
  
  // Sidebar items
  const sidebarItems = [
    { name: 'Keşfet', icon: <Home size={18} />, path: '/' },
    { name: 'Kitaplık', icon: <Library size={18} />, path: '/library' },
    { name: 'AI Asistan', icon: <Bot size={18} />, path: '/assistant' },
    { name: 'Profil', icon: <User size={18} />, path: '/profile' }
  ];
  
  // Mobile sidebar with drawer
  const MobileSidebar = () => (
    <Drawer.Root open={isMenuOpen} onOpenChange={setIsMenuOpen}>
      <Drawer.Trigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu />
        </Button>
      </Drawer.Trigger>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/40 z-50" />
        <Drawer.Content className="fixed bottom-0 left-0 right-0 max-h-[90vh] z-50 rounded-t-[10px] bg-background flex flex-col">
          <div className="p-4 overflow-y-auto flex-1">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Music className="h-5 w-5 text-primary" />
                {APP_NAME}
              </h2>
              <Drawer.Close asChild>
                <Button variant="ghost" size="icon">
                  <X />
                </Button>
              </Drawer.Close>
            </div>
            
            <div className="space-y-1 mb-6">
              {sidebarItems.map((item) => (
                <Button
                  key={item.path}
                  variant={location === item.path ? "default" : "ghost"}
                  className="w-full justify-start"
                  asChild
                >
                  <Link href={item.path}>
                    {item.icon}
                    <span className="ml-2">{item.name}</span>
                  </Link>
                </Button>
              ))}
            </div>
            
            <div className="space-y-1 mb-6">
              <h3 className="text-xs uppercase font-medium text-muted-foreground tracking-wider px-4 mb-1">
                Kitaplık
              </h3>
              <Button variant="ghost" className="w-full justify-start" asChild>
                <Link href="/library/liked">
                  <Heart size={18} />
                  <span className="ml-2">Beğendiklerim</span>
                </Link>
              </Button>
              <Button variant="ghost" className="w-full justify-start" asChild>
                <Link href="/library/recent">
                  <History size={18} />
                  <span className="ml-2">Son Çalınanlar</span>
                </Link>
              </Button>
              <Button variant="ghost" className="w-full justify-start" asChild>
                <Link href="/library/playlists">
                  <PlusCircle size={18} />
                  <span className="ml-2">Yeni Çalma Listesi</span>
                </Link>
              </Button>
            </div>
            
            <div className="border-t pt-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Çevrimdışı Mod</span>
                <Switch 
                  checked={offlineMode}
                  onCheckedChange={handleToggleOfflineMode}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm">Veri Tasarrufu</span>
                <Switch 
                  checked={dataSaver}
                  onCheckedChange={handleToggleDataSaver}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm">Karanlık Tema</span>
                <Switch 
                  checked={theme === 'dark'}
                  onCheckedChange={toggleTheme}
                />
              </div>
            </div>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
  
  return (
    <MusicPlayerContext.Provider value={{ currentSong, playSong, playerState }}>
      <div className="h-full flex flex-col bg-background text-foreground">
        {/* Header */}
        <header className="bg-card shadow-sm z-10 sticky top-0">
          <div className="container mx-auto px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MobileSidebar />
              
              <Link href="/" className="flex items-center gap-2">
                <Music className="text-primary h-5 w-5" />
                <h1 className="text-xl font-bold hidden sm:block">{APP_NAME}</h1>
              </Link>
            </div>
            
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" aria-label="Arama">
                <Search size={18} />
              </Button>
              
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={toggleTheme} 
                aria-label="Tema Değiştir"
              >
                {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
              </Button>
              
              <Button 
                variant="ghost" 
                size="icon" 
                className="relative"
                aria-label="Profil"
                asChild
              >
                <Link href="/profile">
                  <User size={18} />
                  <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500"></span>
                </Link>
              </Button>
            </div>
          </div>
        </header>
        
        {/* Main content */}
        <main className="flex-1 overflow-hidden flex flex-col md:flex-row">
          {/* Desktop sidebar (hidden on mobile) */}
          <div className="hidden md:flex md:w-64 bg-card border-r border-muted flex-col">
            <div className="p-4">
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="Müzik ara..." 
                  className="w-full p-2 pl-8 pr-4 rounded-lg bg-muted border-transparent focus:border-primary focus:ring-1 focus:ring-primary text-sm"
                />
                <Search className="absolute top-2.5 left-2 text-muted-foreground h-4 w-4" />
              </div>
            </div>
            
            <ScrollArea className="flex-1 py-2">
              <div className="px-3 mb-2">
                <h3 className="text-xs uppercase font-medium text-muted-foreground tracking-wider">Menü</h3>
              </div>
              
              <div className="space-y-1 px-2 mb-6">
                {sidebarItems.map((item) => (
                  <Button
                    key={item.path}
                    variant={location === item.path ? "default" : "ghost"}
                    className="w-full justify-start"
                    asChild
                  >
                    <Link href={item.path}>
                      {item.icon}
                      <span className="ml-2">{item.name}</span>
                    </Link>
                  </Button>
                ))}
              </div>
              
              <div className="px-3 mb-2">
                <h3 className="text-xs uppercase font-medium text-muted-foreground tracking-wider">Kitaplık</h3>
              </div>
              
              <div className="space-y-1 px-2">
                <Button variant="ghost" className="w-full justify-start" asChild>
                  <Link href="/library/liked">
                    <Heart size={18} />
                    <span className="ml-2">Beğendiklerim</span>
                  </Link>
                </Button>
                <Button variant="ghost" className="w-full justify-start" asChild>
                  <Link href="/library/recent">
                    <History size={18} />
                    <span className="ml-2">Son Çalınanlar</span>
                  </Link>
                </Button>
                <Button variant="ghost" className="w-full justify-start" asChild>
                  <Link href="/library/playlists">
                    <Clock size={18} />
                    <span className="ml-2">Çalma Listeleri</span>
                  </Link>
                </Button>
              </div>
            </ScrollArea>
            
            <div className="p-4 border-t border-muted">
              <div className="text-sm space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs">Çevrimdışı Mod</span>
                  <Switch 
                    checked={offlineMode}
                    onCheckedChange={handleToggleOfflineMode}
                  />
                </div>
                
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs">Veri Tasarrufu</span>
                  <Switch 
                    checked={dataSaver}
                    onCheckedChange={handleToggleDataSaver}
                  />
                </div>
              </div>
            </div>
          </div>
          
          {/* Content Area */}
          <div className="flex-1 overflow-x-hidden overflow-y-auto">
            {children}
          </div>
        </main>
        
        {/* Mobile Navigation (bottom) */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-muted z-10 pb-safe">
          <div className="flex items-center justify-around">
            {sidebarItems.map((item) => (
              <Link 
                key={item.path}
                href={item.path}
                className={cn(
                  "flex flex-col items-center py-2 px-4",
                  location === item.path 
                    ? "text-primary" 
                    : "text-muted-foreground"
                )}
              >
                {item.icon}
                <span className="text-xs mt-1 font-medium">{item.name}</span>
              </Link>
            ))}
          </div>
        </nav>
        
        {/* Fixed bottom player UI */}
        <div className={cn(
          "fixed left-0 right-0 z-20 transition-transform duration-300",
          isMobile ? "bottom-14" : "bottom-0",
          !currentSong && "translate-y-full"
        )}>
          <MusicPlayerWithYouTube />
        </div>
        
        {/* AI Assistant (as fixed overlay for mobile) */}
        <AnimatePresence>
          {isAIAssistantOpen && isMobile && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 z-50 p-4 pt-16"
            >
              <div className="relative h-full">
                <AIAssistant />
                <Button 
                  className="absolute top-2 right-2"
                  size="icon"
                  variant="ghost"
                  onClick={() => setIsAIAssistantOpen(false)}
                >
                  <X />
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Fixed AI assistant button on mobile */}
        {isMobile && !isAIAssistantOpen && location !== '/assistant' && (
          <div className="fixed right-4 bottom-24 z-20">
            <Button 
              size="icon" 
              className="h-12 w-12 rounded-full shadow-lg"
              onClick={() => setIsAIAssistantOpen(true)}
            >
              <Sparkles className="h-5 w-5" />
            </Button>
          </div>
        )}
      </div>
    </MusicPlayerContext.Provider>
  );
};
