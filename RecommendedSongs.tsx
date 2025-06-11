import React, { useState, useEffect } from 'react';
import { useMusic } from '@/contexts/MusicContext';
import { fetchSongsByMood, Song } from '@/lib/data';
import { AVAILABLE_MOODS } from '@/lib/constants';
import { cn } from '@/lib/utils';
import AlbumCard from './AlbumCard';

interface RecommendedSongsProps {
  initialMood?: string;
  className?: string;
}

export function RecommendedSongs({ initialMood, className }: RecommendedSongsProps) {
  const [selectedMood, setSelectedMood] = useState(initialMood || AVAILABLE_MOODS[0]);
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);
  const { currentTrack } = useMusic();

  useEffect(() => {
    async function loadSongs() {
      setLoading(true);
      try {
        const moodSongs = await fetchSongsByMood(selectedMood);
        setSongs(moodSongs.slice(0, 5));
      } catch (error) {
        console.error('Şarkılar yüklenirken hata oluştu:', error);
      } finally {
        setLoading(false);
      }
    }

    loadSongs();
  }, [selectedMood]);

  // Mevcut çalınan şarkıya göre önerileri yenileyin
  useEffect(() => {
    if (currentTrack) {
      // Kullanıcının dinlediği müziğe göre yeni bir ruh hali belirleyin
      const trackMoods = currentTrack.toptags?.tag
        ?.map((tag: any) => tag.name.toLowerCase())
        .filter((tag: string) => AVAILABLE_MOODS.includes(tag));
      
      if (trackMoods && trackMoods.length > 0) {
        setSelectedMood(trackMoods[0]);
      }
    }
  }, [currentTrack]);

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Senin İçin Öneriler</h2>
        <div className="flex items-center space-x-2">
          {AVAILABLE_MOODS.slice(0, 5).map(mood => (
            <button
              key={mood}
              onClick={() => setSelectedMood(mood)}
              className={cn(
                "px-3 py-1 text-sm rounded-full transition-colors",
                selectedMood === mood
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              )}
            >
              {mood.charAt(0).toUpperCase() + mood.slice(1)}
            </button>
          ))}
        </div>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {loading ? (
          // Yükleme durumunda yükleme animasyonu gösteriliyor
          Array(5).fill(0).map((_, index) => (
            <div key={index} className="bg-card rounded-lg p-3 animate-pulse h-64">
              <div className="aspect-square bg-muted rounded-md mb-3"></div>
              <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-muted rounded w-1/2"></div>
            </div>
          ))
        ) : songs.length > 0 ? (
          // Şarkılar yüklendiyse şarkı kartları gösteriliyor
          songs.map((song) => (
            <AlbumCard
              key={song.id}
              album={{
                name: song.title,
                artist: song.artist,
                url: `https://www.last.fm/music/${encodeURIComponent(song.artist)}/${encodeURIComponent(song.title)}`,
                image: [
                  { "#text": song.imageUrl || "", size: "small" },
                  { "#text": song.imageUrl || "", size: "medium" },
                  { "#text": song.imageUrl || "", size: "large" },
                  { "#text": song.imageUrl || "", size: "extralarge" }
                ],
                tracks: { track: [{ 
                  name: song.title, 
                  artist: { name: song.artist, url: `https://www.last.fm/music/${encodeURIComponent(song.artist)}` }
                }] }
              }}
            />
          ))
        ) : (
          // Şarkı bulunamadıysa mesaj gösteriliyor
          <div className="col-span-full text-center py-10">
            <p className="text-muted-foreground">Bu ruh haline uygun şarkı bulunamadı.</p>
          </div>
        )}
      </div>
    </div>
  );
}