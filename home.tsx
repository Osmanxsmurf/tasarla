import React, { useState, useEffect } from "react";
import { useLocation, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { GenreCard, genreImages, defaultGenreImage } from "@/components/genre-card";
import { SearchItem } from "@/components/search-item";
import { RecommendationItem } from "@/components/recommendation-item";
import { TurkishArtistShowcase, turkishArtists } from "@/components/turkish-artist-showcase";
import { MoodMusicGuide } from "@/components/mood-music-guide";
import { MusicNews } from "@/components/music-news";
import { MakamExplorer } from "@/components/makam-explorer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Bot, Music } from "lucide-react";
import { usePlayerContext } from "@/context/player-context";
import { useAuth } from "@/context/auth-context";
import { getTopGenres } from "@/lib/lastfm";
import { searchYouTube, formatYouTubeResults } from "@/lib/youtube";
import { cn } from "@/lib/utils";

export default function Home() {
  const [_, navigate] = useLocation();
  const { playTrack } = usePlayerContext();
  const { isAuthenticated } = useAuth();
  const [popularGenres, setPopularGenres] = useState<string[]>([
    "Elektronik", "Hip-Hop", "Rock", "Jazz", "Klasik", "Pop", "Halk Müziği", "Arabesk"
  ]);
  
  // Fetch top genres from Last.fm if authenticated
  const { data: topGenresData } = useQuery({
    queryKey: ["/api/lastfm/topgenres"],
    enabled: isAuthenticated,
  });
  
  // Fetch recent play history if authenticated
  const { data: recentPlays } = useQuery({
    queryKey: ["/api/history"],
    enabled: isAuthenticated,
  });
  
  // Get popular tracks from YouTube
  const { data: popularTracks, isLoading: isLoadingPopular } = useQuery({
    queryKey: ["/api/youtube/search?query=popular+music+2023&type=video"],
    enabled: isAuthenticated,
    select: (data) => formatYouTubeResults(data),
  });
  
  // Update genres when data is available
  useEffect(() => {
    if (topGenresData?.toptags?.tag) {
      const genres = topGenresData.toptags.tag
        .slice(0, 6)
        .map((tag: any) => tag.name);
      setPopularGenres(genres);
    }
  }, [topGenresData]);
  
  // Handle genre click
  const handleGenreClick = (genre: string) => {
    navigate(`/search?query=${encodeURIComponent(genre)}&type=genre`);
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
  
  return (
    <div className="px-4 py-6 md:px-8 md:py-8">
      {/* Hero Section */}
      <section className="mb-10">
        <div className="mb-6">
          <h1 className="text-3xl md:text-4xl font-heading font-bold mb-2">MusicAI'ya Hoş Geldiniz</h1>
          <p className="text-light-300">Yapay zeka yardımıyla müzik keşfedin. Arama yapın, müzik dinleyin ve kişiselleştirilmiş öneriler alın.</p>
        </div>
        
        {!isAuthenticated && (
          <div className="bg-dark-200/50 rounded-lg p-6 mb-6">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-heading font-semibold mb-2">Başlamak için hesap oluşturun</h2>
                <p className="text-light-300">Favorilerinizi kaydedin, kişiselleştirilmiş öneriler alın ve yapay zeka asistanımızla sohbet edin.</p>
              </div>
              <Button 
                onClick={() => window.dispatchEvent(new CustomEvent("open-auth-modal"))}
                className="bg-primary hover:bg-primary/90"
              >
                Şimdi Kaydol
              </Button>
            </div>
          </div>
        )}
      </section>
      
      {/* Genres Section */}
      <section className="mb-10">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-heading font-bold">Popüler Türler</h2>
          <Button 
            variant="link" 
            onClick={() => navigate("/search")}
            className="text-light-300 hover:text-light-100 text-sm flex items-center"
          >
            Tümünü Gör
            <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {popularGenres.map((genre, index) => (
            <GenreCard
              key={index}
              name={genre}
              image={genreImages[genre as keyof typeof genreImages] || defaultGenreImage}
              onClick={() => handleGenreClick(genre)}
            />
          ))}
        </div>
      </section>
      
      {/* Recently Played Section - Only show if authenticated and has history */}
      {isAuthenticated && recentPlays && recentPlays.length > 0 && (
        <section className="mb-10">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-heading font-bold">Recently Played</h2>
            <Button 
              variant="link" 
              onClick={() => navigate("/recent")}
              className="text-light-300 hover:text-light-100 text-sm flex items-center"
            >
              View All
              <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {recentPlays.slice(0, 5).map((track: any) => (
              <SearchItem
                key={track.id}
                id={track.trackId}
                title={track.title}
                artist={track.artist}
                thumbnail={track.albumArt}
                type="track"
                onClick={() => handlePlayTrack({
                  id: track.trackId,
                  title: track.title,
                  artist: track.artist,
                  thumbnail: track.albumArt,
                  source: track.source
                })}
              />
            ))}
          </div>
        </section>
      )}
      
      {/* Popular Now Section */}
      <section className="mb-10">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-heading font-bold">Şu Anda Popüler</h2>
        </div>
        
        {isLoadingPopular ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="bg-dark-100 p-4 rounded-lg animate-pulse">
                <div className="aspect-square bg-dark-200 rounded-md mb-3"></div>
                <div className="h-4 bg-dark-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-dark-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {(popularTracks || []).slice(0, 5).map((track: any) => (
              <SearchItem
                key={track.id}
                id={track.id}
                title={track.title}
                artist={track.artist}
                thumbnail={track.thumbnail}
                type="track"
                onClick={() => handlePlayTrack(track)}
              />
            ))}
          </div>
        )}
      </section>
      
      {/* AI Recommendations Section */}
      <section className={cn(
        "mb-10",
        !isAuthenticated && "opacity-75 pointer-events-none"
      )}>
        <div className="bg-gradient-to-r from-secondary/20 to-dark-200 rounded-xl p-6">
          <div className="flex items-center mb-4">
            <Bot className="text-2xl text-secondary mr-3" size={24} />
            <h3 className="text-lg font-heading font-bold">Yapay Zeka Müzik Önerileri</h3>
          </div>
          
          {!isAuthenticated ? (
            <div>
              <p className="text-light-300 mb-4">Dinleme geçmişinize göre kişiselleştirilmiş yapay zeka önerileri almak için giriş yapın.</p>
              <Button 
                onClick={() => window.dispatchEvent(new CustomEvent("open-auth-modal"))}
                className="bg-secondary hover:bg-secondary/90"
              >
                Öneriler İçin Giriş Yap
              </Button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2">
                  <p className="text-light-300 mb-4">Dinleme alışkanlıklarınıza göre şu parçaları sevebilirsiniz:</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    {(popularTracks || []).slice(6, 9).map((track: any) => (
                      <RecommendationItem
                        key={track.id}
                        id={track.id}
                        title={track.title}
                        artist={track.artist}
                        thumbnail={track.thumbnail}
                        onClick={() => handlePlayTrack(track)}
                      />
                    ))}
                  </div>
                  
                  <div className="mt-4 flex justify-end">
                    <Link href="/ai-chat">
                      <Button 
                        className="text-secondary hover:text-secondary/80 bg-transparent flex items-center"
                        variant="ghost"
                      >
                        <span>Daha fazla öneri iste</span>
                        <ArrowRight className="ml-1 h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </div>
                
                <div className="md:col-span-1">
                  <MoodMusicGuide />
                </div>
              </div>
            </>
          )}
        </div>
      </section>
      {/* Turkish Artists Showcase */}
      <section className="my-12 py-6 bg-gradient-to-r from-dark-300/50 to-transparent rounded-lg">
        <div className="flex justify-between items-center mb-6 px-4">
          <div>
            <h2 className="text-xl font-bold text-white mb-1">Türk Sanatçıları</h2>
            <p className="text-sm text-gray-400">Türk müziğinin efsanevi isimleri</p>
          </div>
          <Link href="/search?type=artist&query=turkce">
            <Button variant="outline" size="sm" className="gap-1">
              <span>Tümünü Gör</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 px-4">
          {turkishArtists.map((artist) => (
            <TurkishArtistShowcase
              key={artist.id}
              id={artist.id}
              name={artist.name}
              image={artist.image}
              description={artist.description}
              topSongs={artist.topSongs}
              onPlaySong={(songId, title, artist, thumbnail) => {
                playTrack({
                  id: songId,
                  title: title,
                  artist: artist,
                  thumbnail: thumbnail,
                  source: "youtube"
                });
              }}
            />
          ))}
        </div>
      </section>
      
      {/* Music News Section */}
      <section className="my-12">
        <MusicNews className="px-4" />
      </section>
      
      {/* Turkish Music Culture Section */}
      <section className="my-16 px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <MakamExplorer />
          </div>
          <div className="lg:col-span-1">
            <Card className="border-dark-100 bg-dark-200/50 h-full">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Music className="h-5 w-5 text-primary" />
                  <span>Türk Müziği Kültürü</span>
                </CardTitle>
                <CardDescription>
                  Zengin ve köklü müzik geleneğimizi keşfedin
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-300 mb-4">
                  Türk müziği, yüzyıllar boyunca gelişen ve Orta Asya'dan Anadolu'ya uzanan büyük bir coğrafyanın kültürel mirasını yansıtan zengin bir müzik geleneğidir. Makamlar, usuller ve çeşitli çalgılar ile karakterize edilen bu müzik, farklı bölgelere ve topluluklara göre çeşitlilik gösterir.
                </p>
                <div className="space-y-4">
                  <div className="bg-dark-100/40 rounded-lg p-3">
                    <h4 className="text-sm font-medium mb-1">Türk Halk Müziği</h4>
                    <p className="text-xs text-gray-400">
                      Anadolu'nun farklı bölgelerinde gelişen, yerel özellikler taşıyan, halkın yaşamını, duygularını ve kültürel değerlerini yansıtan müzik türü.
                    </p>
                  </div>
                  <div className="bg-dark-100/40 rounded-lg p-3">
                    <h4 className="text-sm font-medium mb-1">Klasik Türk Müziği</h4>
                    <p className="text-xs text-gray-400">
                      Osmanlı saray müziği geleneğinden gelen, makamsal yapıda, özel usuller kullanılarak bestelenmiş, belirli kurallara bağlı olarak icra edilen müzik türü.
                    </p>
                  </div>
                  <div className="bg-dark-100/40 rounded-lg p-3">
                    <h4 className="text-sm font-medium mb-1">Türk Tasavvuf Müziği</h4>
                    <p className="text-xs text-gray-400">
                      İslami tasavvuf geleneği içinde gelişen, dini ve mistik temaları işleyen, tekke ve zaviyelerde icra edilen müzik türü.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
