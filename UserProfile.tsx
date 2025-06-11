import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ActivityFeed } from './ActivityFeed';
import { UsersIcon, MusicIcon, ListIcon, CalendarIcon, ClockIcon } from 'lucide-react';

interface UserProfileProps {
  className?: string;
  userId?: string;
}

export function UserProfile({ className, userId = 'user1' }: UserProfileProps) {
  const [isFollowing, setIsFollowing] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    id: 'user1',
    name: 'Ahmet Yılmaz',
    username: 'ahmetyilmaz',
    bio: 'Müzik tutkunuyum. Rock, elektronik ve klasik müzik dinlerim. Boş zamanlarımda gitar çalıyorum ve yeni müzik keşfetmeyi seviyorum.',
    location: 'İstanbul, Türkiye',
    website: 'muziktutkunu.com',
    followersCount: 248,
    followingCount: 132,
    playlistCount: 17,
    favoritesCount: 352,
    joinDate: new Date('2021-03-15'),
    imageUrl: 'https://randomuser.me/api/portraits/men/32.jpg',
    coverImageUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=1470&auto=format&fit=crop',
    favoriteGenres: ['Rock', 'Electronic', 'Classical'],
    favoriteArtists: ['Daft Punk', 'Pink Floyd', 'Beethoven', 'Metallica'],
    listenTime: {
      total: 45289, // dakika
      weekly: 620, // dakika
      songs: 5843
    }
  });
  
  // Takip et/Takibi bırak
  const toggleFollow = () => {
    setIsFollowing(!isFollowing);
    
    // Takipçi sayısını güncelle
    setProfileData(prev => ({
      ...prev,
      followersCount: isFollowing ? prev.followersCount - 1 : prev.followersCount + 1
    }));
  };
  
  // Dakikayı saat ve dakika olarak biçimlendir
  const formatListenTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours} saat ${mins} dakika`;
  };
  
  // Tarihi biçimlendir
  const formatDate = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('tr-TR', options);
  };
  
  return (
    <div className={cn("", className)}>
      {/* Kapak fotoğrafı */}
      <div className="h-48 md:h-64 w-full relative rounded-xl overflow-hidden mb-16">
        <img 
          src={profileData.coverImageUrl} 
          alt="Kapak fotoğrafı"
          className="w-full h-full object-cover" 
        />
        
        {/* Profil resmi */}
        <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2">
          <Avatar className="w-24 h-24 border-4 border-background shadow-md">
            <AvatarImage src={profileData.imageUrl} />
            <AvatarFallback>{profileData.name.substring(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
        </div>
      </div>
      
      {/* Profil bilgileri */}
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold">{profileData.name}</h1>
        <p className="text-muted-foreground">@{profileData.username}</p>
        
        <div className="flex items-center justify-center gap-4 mt-3">
          <div className="text-center">
            <p className="font-bold">{profileData.followersCount}</p>
            <p className="text-xs text-muted-foreground">Takipçi</p>
          </div>
          <div className="text-center">
            <p className="font-bold">{profileData.followingCount}</p>
            <p className="text-xs text-muted-foreground">Takip Edilen</p>
          </div>
          <div className="text-center">
            <p className="font-bold">{profileData.playlistCount}</p>
            <p className="text-xs text-muted-foreground">Çalma Listesi</p>
          </div>
          <div className="text-center">
            <p className="font-bold">{profileData.favoritesCount}</p>
            <p className="text-xs text-muted-foreground">Favori</p>
          </div>
        </div>
        
        <div className="flex items-center justify-center gap-2 mt-4">
          <Button 
            variant={isFollowing ? "outline" : "default"}
            onClick={toggleFollow}
          >
            {isFollowing ? 'Takibi Bırak' : 'Takip Et'}
          </Button>
          <Button variant="outline">Mesaj</Button>
        </div>
      </div>
      
      {/* Profil içeriği */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Sol taraf - Kullanıcı bilgileri */}
        <div className="md:col-span-1 space-y-6">
          {/* Hakkında */}
          <Card>
            <CardHeader>
              <CardTitle>Hakkında</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm mb-4">{profileData.bio}</p>
              
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <UsersIcon className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Üyelik:</span>
                  <span>{formatDate(profileData.joinDate)}</span>
                </div>
                
                <div className="flex items-center gap-2 text-sm">
                  <MusicIcon className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Dinlenen Şarkı:</span>
                  <span>{profileData.listenTime.songs.toLocaleString()}</span>
                </div>
                
                <div className="flex items-center gap-2 text-sm">
                  <ClockIcon className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Toplam Dinleme:</span>
                  <span>{formatListenTime(profileData.listenTime.total)}</span>
                </div>
                
                <div className="flex items-center gap-2 text-sm">
                  <CalendarIcon className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Haftalık Dinleme:</span>
                  <span>{formatListenTime(profileData.listenTime.weekly)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Favori Türler */}
          <Card>
            <CardHeader>
              <CardTitle>Favori Türler</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {profileData.favoriteGenres.map((genre, index) => (
                  <div 
                    key={index}
                    className="px-3 py-1 bg-muted rounded-full text-sm"
                  >
                    {genre}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          {/* Favori Sanatçılar */}
          <Card>
            <CardHeader>
              <CardTitle>Favori Sanatçılar</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                {profileData.favoriteArtists.map((artist, index) => (
                  <div 
                    key={index}
                    className="p-2 bg-muted rounded-md text-sm text-center"
                  >
                    {artist}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Sağ taraf - Etkinlikler ve çalma listeleri */}
        <div className="md:col-span-2">
          <Tabs defaultValue="activity" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="activity">Etkinlikler</TabsTrigger>
              <TabsTrigger value="playlists">Çalma Listeleri</TabsTrigger>
              <TabsTrigger value="favorites">Favoriler</TabsTrigger>
            </TabsList>
            
            <TabsContent value="activity">
              <ActivityFeed />
            </TabsContent>
            
            <TabsContent value="playlists">
              <Card>
                <CardHeader>
                  <CardTitle>Çalma Listeleri</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {[1, 2, 3, 4, 5, 6].map((item) => (
                      <div key={item} className="space-y-2">
                        <div className="aspect-square bg-muted rounded-md overflow-hidden">
                          <img 
                            src={`https://picsum.photos/seed/${item + 10}/300/300`}
                            alt="Çalma listesi kapağı" 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <h3 className="font-medium truncate">Playlist {item}</h3>
                        <p className="text-xs text-muted-foreground">{Math.floor(Math.random() * 50) + 5} şarkı</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="favorites">
              <Card>
                <CardHeader>
                  <CardTitle>Favori Şarkılar</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[1, 2, 3, 4, 5].map((item) => (
                      <div key={item} className="flex items-center gap-3 p-2 hover:bg-muted rounded-md transition-colors">
                        <div className="w-12 h-12 bg-muted rounded overflow-hidden">
                          <img 
                            src={`https://picsum.photos/seed/${item + 20}/300/300`}
                            alt="Şarkı kapağı" 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium truncate">Favorite Song {item}</h3>
                          <p className="text-sm text-muted-foreground truncate">Artist {item}</p>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {Math.floor(Math.random() * 5) + 1}:{Math.floor(Math.random() * 60).toString().padStart(2, '0')}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}