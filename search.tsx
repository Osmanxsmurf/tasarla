import React, { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { GenreCard, genreImages, defaultGenreImage, getGenreImage } from "@/components/genre-card";
import { SearchItem } from "@/components/search-item";
import { RecommendationItem } from "@/components/recommendation-item";
import { queryClient } from "@/lib/queryClient";
import { usePlayerContext } from "@/context/player-context";
import { searchYouTube, formatYouTubeResults } from "@/lib/youtube";
import { getSimilarArtists, formatLastFmArtists } from "@/lib/lastfm";
import { SearchX, Search as SearchIcon, Music, User, Album } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Search() {
  const [location] = useLocation();
  const { playTrack } = usePlayerContext();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchType, setSearchType] = useState<"song" | "artist" | "album">("song");
  const [performedSearch, setPerformedSearch] = useState(false);
  
  // Parse URL query parameters
  useEffect(() => {
    const params = new URLSearchParams(location.split("?")[1]);
    const queryParam = params.get("query");
    const typeParam = params.get("type");
    
    if (queryParam) {
      setSearchQuery(queryParam);
      // Trigger search if query param exists
      setPerformedSearch(true);
    }
    
    if (typeParam) {
      if (typeParam === "artist") setSearchType("artist");
      else if (typeParam === "album") setSearchType("album");
      else if (typeParam === "genre") setSearchType("song");
    }
  }, [location]);
  
  // Fetch popular genres
  const { data: topGenresData } = useQuery({
    queryKey: ["/api/lastfm/topgenres"],
  });
  
  // Fetch recent searches
  const { data: recentSearches } = useQuery({
    queryKey: ["/api/searches"],
  });
  
  // Fetch search results when query changes
  const { data: searchResults, isLoading: isSearching } = useQuery({
    queryKey: ["/api/youtube/search", searchQuery, searchType],
    enabled: performedSearch && searchQuery.length > 0,
    select: (data) => formatYouTubeResults(data),
  });
  
  // Add search to history
  const addSearchMutation = useMutation({
    mutationFn: async (searchData: { query: string, type: string }) => {
      const res = await fetch("/api/searches", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(searchData),
        credentials: "include",
      });
      
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to save search");
      }
      
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/searches"] });
    },
  });
  
  // Handle search
  const handleSearch = () => {
    if (!searchQuery.trim()) return;
    
    setPerformedSearch(true);
    
    // Add search to history
    addSearchMutation.mutate({
      query: searchQuery,
      type: searchType,
    });
    
    // Update URL with search params without triggering a navigation
    const url = `/search?query=${encodeURIComponent(searchQuery)}&type=${searchType}`;
    window.history.pushState(null, '', url);
  };
  
  // Handle Enter key press
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };
  
  // Handle genre click
  const handleGenreClick = (genre: string) => {
    setSearchQuery(genre);
    setSearchType("song");
    setPerformedSearch(true);
    
    // Add search to history
    addSearchMutation.mutate({
      query: genre,
      type: "genre",
    });
    
    // Update URL with search params without triggering a navigation
    const url = `/search?query=${encodeURIComponent(genre)}&type=genre`;
    window.history.pushState(null, '', url);
  };
  
  // Handle track play
  const handlePlayTrack = (track: any) => {
    playTrack({
      id: track.id,
      title: track.title,
      artist: track.artist,
      thumbnail: track.thumbnail,
      source: track.source
    });
  };
  
  // Handle recent search click
  const handleRecentSearchClick = (search: any) => {
    setSearchQuery(search.query);
    if (search.type === "artist") setSearchType("artist");
    else if (search.type === "album") setSearchType("album");
    else setSearchType("song");
    
    setPerformedSearch(true);
    
    // Update URL with search params without triggering a navigation
    const url = `/search?query=${encodeURIComponent(search.query)}&type=${search.type}`;
    window.history.pushState(null, '', url);
  };
  
  // Extract top genres
  const topGenres = topGenresData?.toptags?.tag
    ?.slice(0, 6)
    .map((tag: any) => tag.name) || [
      "Electronic", "Hip-Hop", "Rock", "Jazz", "Classical", "Pop"
    ];
  
  return (
    <div className="px-4 py-6 md:px-8 md:py-8">
      {/* Search Section */}
      <section className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center mb-8">
          <div className="relative flex-1 mb-4 md:mb-0 md:mr-4">
            <SearchIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 text-light-300" size={20} />
            <Input
              type="text"
              placeholder="Search for songs, artists, or albums"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyPress}
              className="w-full bg-dark-100 border-dark-100 rounded-full py-6 pl-12 pr-4 text-light-100"
            />
          </div>
          <div className="flex space-x-2">
            <Button 
              onClick={() => setSearchType("song")}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium transition-colors",
                searchType === "song" 
                  ? "bg-primary text-white" 
                  : "bg-dark-100 hover:bg-dark-100/80 text-light-300"
              )}
            >
              Songs
            </Button>
            <Button 
              onClick={() => setSearchType("artist")}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium transition-colors",
                searchType === "artist" 
                  ? "bg-primary text-white" 
                  : "bg-dark-100 hover:bg-dark-100/80 text-light-300"
              )}
            >
              Artists
            </Button>
            <Button 
              onClick={() => setSearchType("album")}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium transition-colors",
                searchType === "album" 
                  ? "bg-primary text-white" 
                  : "bg-dark-100 hover:bg-dark-100/80 text-light-300"
              )}
            >
              Albums
            </Button>
          </div>
          <Button
            onClick={handleSearch}
            className="mt-4 md:mt-0 md:ml-2 bg-primary hover:bg-primary/90"
          >
            Search
          </Button>
        </div>
      </section>
      
      {performedSearch ? (
        // Search Results Section
        <section className="mb-10">
          <h2 className="text-xl font-heading font-bold mb-4">
            {searchQuery ? `Results for "${searchQuery}"` : "Search Results"}
          </h2>
          
          {isSearching ? (
            // Loading state
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {[...Array(10)].map((_, i) => (
                <div key={i} className="bg-dark-100 p-4 rounded-lg animate-pulse">
                  <div className="aspect-square bg-dark-200 rounded-md mb-3"></div>
                  <div className="h-4 bg-dark-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-dark-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : searchResults && searchResults.length > 0 ? (
            // Results grid
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {searchResults.map((result: any) => (
                <SearchItem
                  key={result.id}
                  id={result.id}
                  title={result.title}
                  artist={result.artist}
                  thumbnail={result.thumbnail}
                  type={searchType}
                  onClick={() => handlePlayTrack(result)}
                />
              ))}
            </div>
          ) : (
            // No results
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <SearchX className="h-16 w-16 text-light-300 mb-4" />
              <h3 className="text-xl font-medium mb-2">No results found</h3>
              <p className="text-light-300 max-w-md">
                We couldn't find any {searchType}s matching "{searchQuery}". 
                Try a different search term or category.
              </p>
            </div>
          )}
        </section>
      ) : (
        <>
          {/* Genre Navigation */}
          <section className="mb-10">
            <h2 className="text-xl font-heading font-bold mb-4">Browse Genres</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {topGenres.map((genre, index) => (
                <GenreCard
                  key={index}
                  name={genre}
                  image={getGenreImage(genre)}
                  onClick={() => handleGenreClick(genre)}
                />
              ))}
            </div>
          </section>
          
          {/* Recent Searches */}
          {recentSearches && recentSearches.length > 0 && (
            <section className="mb-10">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-heading font-bold">Recent Searches</h2>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {recentSearches.map((search: any) => (
                  <div 
                    key={search.id} 
                    className="bg-dark-100 p-4 rounded-lg hover:bg-dark-100/80 transition-colors cursor-pointer"
                    onClick={() => handleRecentSearchClick(search)}
                  >
                    <div className="aspect-square bg-dark-200 rounded-md flex items-center justify-center mb-3">
                      {search.type === "artist" ? (
                        <User className="text-3xl text-light-300" />
                      ) : search.type === "album" ? (
                        <Album className="text-3xl text-light-300" />
                      ) : (
                        <Music className="text-3xl text-light-300" />
                      )}
                    </div>
                    <h3 className="font-medium text-light-100 truncate">{search.query}</h3>
                    <p className="text-sm text-light-300 truncate">
                      {search.type === "artist" ? "Artist" : 
                       search.type === "album" ? "Album" : 
                       search.type === "genre" ? "Genre" : "Song"}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
}
