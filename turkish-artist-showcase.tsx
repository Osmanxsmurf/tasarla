import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Music, Play, Info } from "lucide-react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface TurkishArtistProps {
  id: string;
  name: string;
  image: string;
  description: string;
  topSongs: {
    id: string;
    title: string;
    thumbnail?: string;
  }[];
  onPlaySong: (songId: string, title: string, artist: string, thumbnail?: string) => void;
  className?: string;
}

export function TurkishArtistShowcase({
  id,
  name,
  image,
  description,
  topSongs,
  onPlaySong,
  className
}: TurkishArtistProps) {
  return (
    <Card 
      className={cn(
        "overflow-hidden border-dark-100 bg-dark-200/50 backdrop-blur-sm hover:shadow-md transition-all duration-300",
        className
      )}
    >
      <CardContent className="p-0">
        <div className="relative">
          {/* Artist image with gradient overlay */}
          <div className="relative h-40 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-t from-dark-300 via-transparent to-transparent z-10" />
            <div className="absolute inset-0 bg-gradient-to-b from-primary/30 to-transparent mix-blend-overlay" />
            <img 
              src={image} 
              alt={name}
              className="w-full h-full object-cover" 
            />
            <div className="absolute bottom-0 left-0 p-4 z-10">
              <h3 className="text-xl font-bold text-white drop-shadow-md">{name}</h3>
            </div>
          </div>
          
          {/* Content section */}
          <div className="p-4">
            <p className="text-light-300 text-sm line-clamp-2 mb-4">{description}</p>
            
            {/* Top songs */}
            <h4 className="text-sm font-medium mb-2 flex items-center">
              <Music className="h-4 w-4 mr-1" />
              <span>Popüler Şarkılar</span>
            </h4>
            
            <div className="space-y-2 mb-4">
              {topSongs.slice(0, 3).map((song, index) => (
                <motion.div
                  key={song.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: index * 0.1 }}
                  className="flex items-center justify-between p-2 rounded hover:bg-dark-100 group"
                >
                  <div className="flex items-center overflow-hidden">
                    <div className="mr-2 w-8 h-8 flex-shrink-0 rounded overflow-hidden bg-dark-100">
                      {song.thumbnail ? (
                        <img 
                          src={song.thumbnail} 
                          alt={song.title} 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-primary/20">
                          <Music className="h-4 w-4 text-primary" />
                        </div>
                      )}
                    </div>
                    <span className="truncate text-sm">{song.title}</span>
                  </div>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => onPlaySong(song.id, song.title, name, song.thumbnail)}
                  >
                    <Play className="h-4 w-4" />
                  </Button>
                </motion.div>
              ))}
            </div>
            
            {/* Actions */}
            <div className="flex justify-end gap-2">
              <Link href={`/search?query=${encodeURIComponent(name)}&type=artist`}>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs flex items-center gap-1 border-dark-100 hover:border-primary hover:text-primary"
                >
                  <Info className="h-3 w-3" />
                  <span>Sanatçı Hakkında</span>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Türk sanatçıları için örnek veriler (telsifsiz ve ücretsiz bilgiler)
export const turkishArtists = [
  {
    id: "tarkan",
    name: "Tarkan",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/Tarkan_2.jpg/800px-Tarkan_2.jpg",
    description: "Türk pop müziğinin uluslararası alanda en tanınan temsilcisidir. 'Şımarık' şarkısıyla dünya çapında tanındı.",
    topSongs: [
      { id: "kukuzu", title: "Kuzu Kuzu" },
      { id: "dudu", title: "Dudu" },
      { id: "simarik", title: "Şımarık" }
    ]
  },
  {
    id: "sezen-aksu",
    name: "Sezen Aksu",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/64/Sezen_Aksu.jpg/800px-Sezen_Aksu.jpg",
    description: "Türk pop müziğinin 'Minik Serçe' olarak bilinen efsanevi ismidir. Modern Türk pop müziğinin kurucusu ve en etkili figürü olarak kabul edilir.",
    topSongs: [
      { id: "firuze", title: "Firuze" },
      { id: "gulumse", title: "Gülümse" },
      { id: "ikinci-bahar", title: "İkinci Bahar" }
    ]
  },
  {
    id: "baris-manco",
    name: "Barış Manço",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/13/Baris_Manco.JPG/800px-Baris_Manco.JPG",
    description: "Türk rock müziğinin ve Anadolu Rock akımının öncü isimlerinden biridir. '7'den 77'ye' programıyla nesiller arası bir köprü kurmuştur.",
    topSongs: [
      { id: "gulpembe", title: "Gülpembe" },
      { id: "daglar-daglar", title: "Dağlar Dağlar" },
      { id: "sari-cizmeli", title: "Sarı Çizmeli Mehmet Ağa" }
    ]
  },
  {
    id: "muslum-gurses",
    name: "Müslüm Gürses",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c4/M%C3%BCsl%C3%BCm_G%C3%BCrses.jpg/800px-M%C3%BCsl%C3%BCm_G%C3%BCrses.jpg",
    description: "Türk arabesk müziğinin efsanevi ismi, 'Müslüm Baba' olarak bilinen şarkıcı ve oyuncudur. Kendine özgü yorumu, derin ve dokunaklı sesiyle tanınırdı.",
    topSongs: [
      { id: "nilufer", title: "Nilüfer" },
      { id: "sevda-yuklu", title: "Sevda Yüklü Kervanlar" },
      { id: "affet", title: "Affet" }
    ]
  }
];

// Sanatçı verisini ID'ye göre getiren yardımcı fonksiyon
export function getArtistById(id: string) {
  return turkishArtists.find(artist => artist.id === id);
}

// Tüm sanatçıları getiren yardımcı fonksiyon
export function getAllArtists() {
  return turkishArtists;
}