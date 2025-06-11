import React, { useState, useEffect } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { Search, Moon, Sun } from 'lucide-react';
import { debounce } from '@/lib/utils';
import { useLastFmSearch } from '@/hooks/useLastFm';
import { useMusic } from '@/contexts/MusicContext';
import { LastFmTrack } from '@/types/lastfm';

const SearchHeader = () => {
  const { theme, toggleTheme } = useTheme();
  const { playTrack } = useMusic();
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [showResults, setShowResults] = useState(false);
  
  // Create debounced search function
  const debouncedSearch = React.useMemo(
    () => debounce((query: string) => {
      setDebouncedQuery(query);
    }, 500),
    []
  );
  
  // Fetch search results
  const { data: searchResults, isLoading } = useLastFmSearch(
    debouncedQuery,
    'track',
    debouncedQuery.length > 2
  );
  
  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    debouncedSearch(query);
    
    if (query.length > 0) {
      setShowResults(true);
    } else {
      setShowResults(false);
    }
  };
  
  // Handle track selection
  const handleTrackSelect = (track: LastFmTrack) => {
    playTrack(track);
    setShowResults(false);
  };
  
  // Close results when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setShowResults(false);
    };
    
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);
  
  return (
    <header className="px-4 py-3 bg-card/80 sticky top-0 backdrop-blur-md z-10">
      <div className="flex items-center justify-between md:justify-end gap-4">
        {/* Mobile Logo (visible on small screens) */}
        <div className="flex md:hidden items-center">
          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center mr-2">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-white">
              <path d="M9 18V5l12-2v13"></path>
              <circle cx="6" cy="18" r="3"></circle>
              <circle cx="18" cy="16" r="3"></circle>
            </svg>
          </div>
          <h1 className="text-lg font-bold">Müzik Asistanım</h1>
        </div>

        {/* Search Bar */}
        <div className="relative flex-1 max-w-md" onClick={(e) => e.stopPropagation()}>
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="w-4 h-4 text-muted-foreground" />
          </div>
          <input 
            type="search" 
            placeholder="Sanatçı, albüm veya parça ara..." 
            className="w-full pl-10 pr-4 py-2 rounded-full bg-secondary border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" 
            value={searchQuery}
            onChange={handleSearchChange}
          />
          
          {/* Search Results */}
          {showResults && debouncedQuery.length > 2 && (
            <div className="absolute mt-2 w-full bg-card rounded-md shadow-lg border border-border max-h-80 overflow-y-auto z-50">
              {isLoading ? (
                <div className="p-4 text-center text-muted-foreground">Aranıyor...</div>
              ) : (
                <>
                  {searchResults?.results?.trackmatches?.track && searchResults.results.trackmatches.track.length > 0 ? (
                    <div className="p-2">
                      {searchResults.results.trackmatches.track.map((track, index) => (
                        <div 
                          key={`${track.name}-${track.artist.name}-${index}`}
                          className="p-2 hover:bg-secondary rounded-md cursor-pointer"
                          onClick={() => handleTrackSelect(track)}
                        >
                          <div className="flex items-center">
                            <div className="w-8 h-8 bg-muted rounded flex-shrink-0"></div>
                            <div className="ml-2">
                              <p className="text-sm font-medium truncate">{track.name}</p>
                              <p className="text-xs text-muted-foreground truncate">{track.artist.name}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-4 text-center text-muted-foreground">
                      {debouncedQuery.length > 0 ? 'Sonuç bulunamadı' : 'Arama yapmak için yazın'}
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>

        {/* Theme Toggle Button */}
        <button 
          className="p-2 rounded-full hover:bg-secondary"
          onClick={toggleTheme}
        >
          {theme === 'dark' ? (
            <Moon className="w-5 h-5" />
          ) : (
            <Sun className="w-5 h-5" />
          )}
        </button>
      </div>
    </header>
  );
};

export default SearchHeader;
