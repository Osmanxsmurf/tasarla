import React, { useState, useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useMusic } from '@/contexts/music-context';
import type { Song } from '@/types/music';

interface SearchBarProps {
  onSearchResults?: (results: Song[]) => void;
  placeholder?: string;
}

export function SearchBar({ onSearchResults, placeholder = "Search for songs, artists, albums..." }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Song[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const { searchSongs, playSong } = useMusic();
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      setShowResults(false);
      return;
    }

    const searchTimeout = setTimeout(async () => {
      setIsLoading(true);
      try {
        const searchResults = await searchSongs(query);
        setResults(searchResults);
        setShowResults(true);
        onSearchResults?.(searchResults);
      } catch (error) {
        console.error('Search failed:', error);
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => clearTimeout(searchTimeout);
  }, [query, searchSongs, onSearchResults]);

  const handleClear = () => {
    setQuery('');
    setResults([]);
    setShowResults(false);
  };

  const handleSongSelect = (song: Song) => {
    playSong(song, results);
    setShowResults(false);
    setQuery('');
  };

  return (
    <div ref={searchRef} className="relative w-full max-w-md">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-10 pr-10 bg-dark-100 border-gray-700 rounded-full focus:ring-2 focus:ring-primary focus:border-transparent"
        />
        {query && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClear}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
          >
            <X className="h-3 w-3" />
          </Button>
        )}
      </div>

      {showResults && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-dark-100 border border-gray-700 rounded-lg shadow-xl z-50 max-h-80 overflow-y-auto">
          {isLoading ? (
            <div className="p-4 text-center text-gray-400">
              <div className="animate-spin inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full"></div>
              <span className="ml-2">Searching...</span>
            </div>
          ) : results.length > 0 ? (
            <div className="py-2">
              {results.slice(0, 8).map((song) => (
                <button
                  key={song.id}
                  onClick={() => handleSongSelect(song)}
                  className="w-full px-4 py-3 flex items-center space-x-3 hover:bg-gray-800 transition-colors text-left"
                >
                  <img
                    src={song.thumbnail}
                    alt={song.title}
                    className="w-10 h-10 rounded-lg object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm truncate text-white">
                      {song.title}
                    </div>
                    <div className="text-xs text-gray-400 truncate">
                      {song.artist}
                    </div>
                  </div>
                  <div className="text-xs text-gray-500">
                    {Math.floor(song.duration / 60)}:{(song.duration % 60).toString().padStart(2, '0')}
                  </div>
                </button>
              ))}
              {results.length > 8 && (
                <div className="px-4 py-2 text-xs text-gray-400 text-center border-t border-gray-700">
                  +{results.length - 8} more results
                </div>
              )}
            </div>
          ) : query.length >= 2 && !isLoading ? (
            <div className="p-4 text-center text-gray-400">
              No results found for "{query}"
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
