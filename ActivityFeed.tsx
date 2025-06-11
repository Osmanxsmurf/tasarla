import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Link } from 'wouter';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { HeartIcon, MessageSquareIcon, RepeatIcon, ShareIcon } from 'lucide-react';
import { DEFAULT_COVER_URL } from '@/lib/constants';

interface ActivityEvent {
  id: string;
  type: 'like' | 'listen' | 'share' | 'playlist' | 'review' | 'follow';
  user: {
    id: string;
    name: string;
    imageUrl?: string;
  };
  timestamp: Date;
  content: {
    text?: string;
    song?: {
      id: string;
      title: string;
      artist: string;
      imageUrl?: string;
    };
    playlist?: {
      id: string;
      name: string;
      songCount: number;
      imageUrl?: string;
    };
    followedUser?: {
      id: string;
      name: string;
      imageUrl?: string;
    };
  };
  likes: number;
  comments: number;
  isLiked: boolean;
}

interface ActivityFeedProps {
  className?: string;
  limit?: number;
}

export function ActivityFeed({ className, limit = 10 }: ActivityFeedProps) {
  const [events, setEvents] = useState<ActivityEvent[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Beğeni işlevselliği
  const toggleLike = (eventId: string) => {
    setEvents(prevEvents => 
      prevEvents.map(event => {
        if (event.id === eventId) {
          const isLiked = !event.isLiked;
          return {
            ...event,
            isLiked,
            likes: isLiked ? event.likes + 1 : event.likes - 1
          };
        }
        return event;
      })
    );
  };
  
  // Etkinlik verileri yükle - simüle edilmiş
  useEffect(() => {
    const fetchActivity = async () => {
      setLoading(true);
      
      try {
        // API'den veri yükleme simülasyonu
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Simüle edilmiş etkinlik verileri
        const simulatedEvents: ActivityEvent[] = [
          {
            id: '1',
            type: 'listen',
            user: {
              id: 'user1',
              name: 'Ahmet Yılmaz',
              imageUrl: 'https://randomuser.me/api/portraits/men/32.jpg'
            },
            timestamp: new Date(Date.now() - 25 * 60 * 1000),
            content: {
              song: {
                id: 'song1',
                title: 'Lose Yourself',
                artist: 'Eminem',
                imageUrl: 'https://lastfm.freetls.fastly.net/i/u/174s/8de9c5064e33ef6e95c6163e9f3c23c3.jpg'
              }
            },
            likes: 15,
            comments: 3,
            isLiked: false
          },
          {
            id: '2',
            type: 'playlist',
            user: {
              id: 'user2',
              name: 'Zeynep Kaya',
              imageUrl: 'https://randomuser.me/api/portraits/women/44.jpg'
            },
            timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
            content: {
              text: 'Hafta sonu için mükemmel bir çalma listesi hazırladım!',
              playlist: {
                id: 'playlist1',
                name: 'Weekend Vibes',
                songCount: 23,
                imageUrl: 'https://lastfm.freetls.fastly.net/i/u/174s/6015946df4ce4ea5c6f2e3f73cef51f2.jpg'
              }
            },
            likes: 34,
            comments: 7,
            isLiked: true
          },
          {
            id: '3',
            type: 'review',
            user: {
              id: 'user3',
              name: 'Ozan Demir',
              imageUrl: 'https://randomuser.me/api/portraits/men/46.jpg'
            },
            timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
            content: {
              text: 'Bu albüm gerçekten harika olmuş. Özellikle 3. ve 7. parçalar favorilerim.',
              song: {
                id: 'song2',
                title: 'Circles',
                artist: 'Post Malone',
                imageUrl: 'https://lastfm.freetls.fastly.net/i/u/174s/25c49c0452da42b6c0b5953cc10b95d0.jpg'
              }
            },
            likes: 42,
            comments: 11,
            isLiked: false
          },
          {
            id: '4',
            type: 'like',
            user: {
              id: 'user4',
              name: 'Gizem Tekin',
              imageUrl: 'https://randomuser.me/api/portraits/women/29.jpg'
            },
            timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000),
            content: {
              song: {
                id: 'song3',
                title: 'Gypsy Woman',
                artist: 'Crystal Waters',
                imageUrl: 'https://lastfm.freetls.fastly.net/i/u/174s/ad0ae6e1b4bd85a385c8e54408b5f4f8.jpg'
              }
            },
            likes: 8,
            comments: 0,
            isLiked: false
          },
          {
            id: '5',
            type: 'follow',
            user: {
              id: 'user5',
              name: 'Kerem Aydın',
              imageUrl: 'https://randomuser.me/api/portraits/men/22.jpg'
            },
            timestamp: new Date(Date.now() - 10 * 60 * 60 * 1000),
            content: {
              followedUser: {
                id: 'user1',
                name: 'Ahmet Yılmaz',
                imageUrl: 'https://randomuser.me/api/portraits/men/32.jpg'
              }
            },
            likes: 3,
            comments: 1,
            isLiked: false
          },
          {
            id: '6',
            type: 'share',
            user: {
              id: 'user6',
              name: 'Deniz Güneş',
              imageUrl: 'https://randomuser.me/api/portraits/women/17.jpg'
            },
            timestamp: new Date(Date.now() - 16 * 60 * 60 * 1000),
            content: {
              text: 'Bu şarkıyı dinlemelisiniz, inanılmaz!',
              song: {
                id: 'song4',
                title: 'Starboy',
                artist: 'The Weeknd',
                imageUrl: 'https://lastfm.freetls.fastly.net/i/u/174s/e33b0a809208f022a2093a1d2b6752e9.jpg'
              }
            },
            likes: 27,
            comments: 5,
            isLiked: true
          }
        ];
        
        setEvents(simulatedEvents.slice(0, limit));
      } catch (error) {
        console.error('Etkinlik akışı alınırken hata:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchActivity();
  }, [limit]);
  
  // Tarih biçimlendirmesi
  const formatTime = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffMins < 60) {
      return `${diffMins} dakika önce`;
    } else if (diffHours < 24) {
      return `${diffHours} saat önce`;
    } else {
      return `${diffDays} gün önce`;
    }
  };
  
  // Etkinlik içeriği oluşturma
  const renderEventContent = (event: ActivityEvent) => {
    switch (event.type) {
      case 'listen':
        return (
          <div className="flex items-center">
            <p className="text-muted-foreground">
              <span className="font-medium text-foreground">{event.user.name}</span>{' '}
              şu şarkıyı dinledi:
            </p>
          </div>
        );
      case 'like':
        return (
          <div className="flex items-center">
            <p className="text-muted-foreground">
              <span className="font-medium text-foreground">{event.user.name}</span>{' '}
              şu şarkıyı beğendi:
            </p>
          </div>
        );
      case 'share':
        return (
          <div className="flex items-center">
            <p className="text-muted-foreground">
              <span className="font-medium text-foreground">{event.user.name}</span>{' '}
              şu şarkıyı paylaştı:
            </p>
          </div>
        );
      case 'playlist':
        return (
          <div className="flex items-center">
            <p className="text-muted-foreground">
              <span className="font-medium text-foreground">{event.user.name}</span>{' '}
              yeni bir çalma listesi oluşturdu:
            </p>
          </div>
        );
      case 'review':
        return (
          <div className="flex items-center">
            <p className="text-muted-foreground">
              <span className="font-medium text-foreground">{event.user.name}</span>{' '}
              şu şarkıyı değerlendirdi:
            </p>
          </div>
        );
      case 'follow':
        return (
          <div className="flex items-center">
            <p className="text-muted-foreground">
              <span className="font-medium text-foreground">{event.user.name}</span>{' '}
              <span className="font-medium text-foreground">{event.content.followedUser?.name}</span>{' '}
              kişisini takip etmeye başladı.
            </p>
          </div>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <Card className={cn("", className)}>
        <CardHeader>
          <CardTitle>Etkinlik Akışı</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array(3).fill(0).map((_, i) => (
              <div key={i} className="flex gap-3 animate-pulse">
                <div className="w-10 h-10 rounded-full bg-muted"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-muted rounded w-1/3"></div>
                  <div className="h-3 bg-muted rounded w-1/2"></div>
                  <div className="h-20 bg-muted rounded w-full"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className={cn("", className)}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Etkinlik Akışı</span>
          <Badge variant="outline">Yeni</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {events.map(event => (
            <div key={event.id} className="space-y-3">
              <div className="flex items-start gap-3">
                <Avatar>
                  <AvatarImage src={event.user.imageUrl} />
                  <AvatarFallback>{event.user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  {renderEventContent(event)}
                  
                  {/* Etkinliğin metni */}
                  {event.content.text && (
                    <p className="text-sm my-2">{event.content.text}</p>
                  )}
                  
                  {/* Şarkı veya çalma listesi içeriği */}
                  {(event.content.song || event.content.playlist) && (
                    <div className="mt-2 p-3 bg-muted/50 rounded-md flex items-center gap-3">
                      <div className="w-12 h-12 rounded-md overflow-hidden">
                        {event.content.song?.imageUrl ? (
                          <img 
                            src={event.content.song.imageUrl} 
                            alt={event.content.song.title}
                            className="w-full h-full object-cover" 
                          />
                        ) : event.content.playlist?.imageUrl ? (
                          <img 
                            src={event.content.playlist.imageUrl} 
                            alt={event.content.playlist.name}
                            className="w-full h-full object-cover" 
                          />
                        ) : (
                          <div className="w-full h-full bg-muted flex items-center justify-center">
                            <span className="text-xs">Resim yok</span>
                          </div>
                        )}
                      </div>
                      <div>
                        <Link 
                          href={event.content.song ? 
                            `/music?id=${event.content.song.id}&name=${event.content.song.title}&artist=${event.content.song.artist}` : 
                            `/playlist/${event.content.playlist?.id}`
                          }
                          className="font-medium hover:underline"
                        >
                          {event.content.song?.title || event.content.playlist?.name}
                        </Link>
                        <p className="text-sm text-muted-foreground">
                          {event.content.song?.artist || (
                            event.content.playlist && `${event.content.playlist.songCount} şarkı`
                          )}
                        </p>
                      </div>
                    </div>
                  )}
                  
                  {/* Etkileşim butonları */}
                  <div className="flex items-center gap-4 mt-3">
                    <button 
                      className={cn(
                        "inline-flex items-center gap-1 text-xs",
                        event.isLiked ? "text-primary" : "text-muted-foreground hover:text-foreground"
                      )}
                      onClick={() => toggleLike(event.id)}
                    >
                      <HeartIcon className="w-4 h-4" fill={event.isLiked ? "currentColor" : "none"} />
                      <span>{event.likes}</span>
                    </button>
                    
                    <button className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground">
                      <MessageSquareIcon className="w-4 h-4" />
                      <span>{event.comments}</span>
                    </button>
                    
                    <button className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground">
                      <RepeatIcon className="w-4 h-4" />
                      <span>Tekrar Paylaş</span>
                    </button>
                    
                    <button className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground ml-auto">
                      <ShareIcon className="w-4 h-4" />
                      <span>Paylaş</span>
                    </button>
                  </div>
                </div>
              </div>
              
              <p className="text-xs text-muted-foreground ml-12">
                {formatTime(event.timestamp)}
              </p>
            </div>
          ))}
        </div>
        
        <Button variant="outline" className="w-full mt-4">
          Daha Fazla Göster
        </Button>
      </CardContent>
    </Card>
  );
}