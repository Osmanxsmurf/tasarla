import React from 'react';
import { useLocation, useRoute } from 'wouter';
import { Home, Library, Sparkles, User, Play } from 'lucide-react';
import { useContext } from 'react';
import { MusicPlayerContext } from './Layout';
import { AnimatePresence, motion } from 'framer-motion';

const MobileNavigation: React.FC = () => {
  const [, navigate] = useLocation();
  const [isHome] = useRoute("/");
  const [isLibrary] = useRoute("/library");
  const [isAssistant] = useRoute("/assistant");
  const [isProfile] = useRoute("/profile");
  
  const { currentSong, isPlaying, resumeSong } = useContext(MusicPlayerContext);
  
  // Only show on mobile devices
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-muted z-10 pb-safe">
      <div className="flex items-center justify-around">
        <button 
          className={`flex flex-col items-center py-2 px-4 ${isHome ? 'text-primary' : 'text-muted-foreground'}`}
          onClick={() => navigate("/")}
        >
          <Home className="h-5 w-5" />
          <span className="text-xs mt-1 font-medium">Discover</span>
        </button>
        
        <button 
          className={`flex flex-col items-center py-2 px-4 ${isLibrary ? 'text-primary' : 'text-muted-foreground'}`}
          onClick={() => navigate("/library")}
        >
          <Library className="h-5 w-5" />
          <span className="text-xs mt-1">Library</span>
        </button>
        
        <AnimatePresence>
          <motion.button 
            className="relative -mt-6 flex items-center justify-center bg-primary text-primary-foreground p-3 rounded-full shadow-lg"
            whileTap={{ scale: 0.9 }}
            onClick={() => {
              if (currentSong) {
                resumeSong();
              } else {
                navigate("/");
              }
            }}
          >
            <Play className="h-5 w-5" />
            {isPlaying && (
              <motion.span 
                className="absolute inset-0 rounded-full border-4 border-primary/30"
                animate={{ scale: [1, 1.4, 1] }}
                transition={{ 
                  duration: 2, 
                  ease: "easeInOut", 
                  repeat: Infinity,
                  repeatType: "loop" 
                }}
              />
            )}
          </motion.button>
        </AnimatePresence>
        
        <button 
          className={`flex flex-col items-center py-2 px-4 ${isAssistant ? 'text-primary' : 'text-muted-foreground'}`}
          onClick={() => navigate("/assistant")}
        >
          <Sparkles className="h-5 w-5" />
          <span className="text-xs mt-1">Assistant</span>
        </button>
        
        <button 
          className={`flex flex-col items-center py-2 px-4 ${isProfile ? 'text-primary' : 'text-muted-foreground'}`}
          onClick={() => navigate("/profile")}
        >
          <User className="h-5 w-5" />
          <span className="text-xs mt-1">Profile</span>
        </button>
      </div>
    </nav>
  );
};

export default MobileNavigation;
