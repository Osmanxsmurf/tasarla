import { useQuery } from "@tanstack/react-query";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Users, User, Music, Heart, ListMusic } from "lucide-react";
import type { SocialActivity } from "@/types/music";

interface SocialSectionProps {
  userId: number;
}

export function SocialSection({ userId }: SocialSectionProps) {
  const { data: activities, isLoading, error } = useQuery({
    queryKey: ["/api/user", userId, "social-activities"],
    enabled: !!userId,
  });

  if (isLoading) {
    return <SocialSkeleton />;
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-400">Sosyal aktiviteler yüklenirken hata oluştu</p>
        <p className="text-sm text-gray-500 mt-2">Lütfen daha sonra tekrar deneyin</p>
      </div>
    );
  }

  // Mock social activities data
  const mockActivities = [
    {
      id: 1,
      username: "Mehmet",
      activityType: "listening" as const,
      songTitle: "Duman - Her Şeyi Yak",
      createdAt: new Date(Date.now() - 2 * 60 * 1000), // 2 minutes ago
      avatarColor: "from-blue-500 to-purple-500"
    },
    {
      id: 2,
      username: "Ayşe",
      activityType: "playlist_created" as const,
      playlistName: "Yaz Akşamları 🌅",
      createdAt: new Date(Date.now() - 60 * 60 * 1000), // 1 hour ago
      avatarColor: "from-green-500 to-blue-500"
    },
    {
      id: 3,
      username: "Can",
      activityType: "song_liked" as const,
      songTitle: "Teoman - Paramparça",
      createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
      avatarColor: "from-purple-500 to-pink-500"
    },
    {
      id: 4,
      username: "Zeynep",
      activityType: "listening" as const,
      songTitle: "Şebnem Ferah - Sil Baştan",
      createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
      avatarColor: "from-yellow-500 to-red-500"
    },
    {
      id: 5,
      username: "Emre",
      activityType: "playlist_created" as const,
      playlistName: "Coding Vibes 💻",
      createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000), // 8 hours ago
      avatarColor: "from-cyan-500 to-blue-500"
    }
  ];

  return (
    <section>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold flex items-center space-x-3">
          <Users className="text-blue-500 w-6 h-6" />
          <span>Arkadaşlarınızın Aktivitesi</span>
        </h2>
        <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
          Tümünü Gör
        </Button>
      </div>
      
      {mockActivities.length === 0 ? (
        <div className="text-center py-8">
          <Users className="w-12 h-12 text-gray-500 mx-auto mb-4" />
          <p className="text-gray-400">Henüz arkadaş aktivitesi yok</p>
          <p className="text-sm text-gray-500 mt-2">Arkadaş ekleyin ve müzik aktivitelerini takip edin</p>
        </div>
      ) : (
        <div className="space-y-4">
          {mockActivities.map((activity) => (
            <SocialActivityItem key={activity.id} activity={activity} />
          ))}
        </div>
      )}
    </section>
  );
}

interface SocialActivityItemProps {
  activity: {
    id: number;
    username: string;
    activityType: "listening" | "playlist_created" | "song_liked";
    songTitle?: string;
    playlistName?: string;
    createdAt: Date;
    avatarColor: string;
  };
}

function SocialActivityItem({ activity }: SocialActivityItemProps) {
  const getActivityText = () => {
    switch (activity.activityType) {
      case "listening":
        return (
          <>
            <span className="font-semibold">{activity.username}</span>
            <span className="text-gray-400"> şu anda dinliyor:</span>
          </>
        );
      case "playlist_created":
        return (
          <>
            <span className="font-semibold">{activity.username}</span>
            <span className="text-gray-400"> bir çalma listesi oluşturdu:</span>
          </>
        );
      case "song_liked":
        return (
          <>
            <span className="font-semibold">{activity.username}</span>
            <span className="text-gray-400"> bir şarkıyı beğendi:</span>
          </>
        );
      default:
        return null;
    }
  };

  const getActivityIcon = () => {
    switch (activity.activityType) {
      case "listening":
        return <Music className="w-4 h-4" />;
      case "playlist_created":
        return <ListMusic className="w-4 h-4" />;
      case "song_liked":
        return <Heart className="w-4 h-4" />;
      default:
        return <User className="w-4 h-4" />;
    }
  };

  const getTimeAgo = (date: Date): string => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) {
      return "az önce";
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} dk önce`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} saat önce`;
    } else {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days} gün önce`;
    }
  };

  return (
    <div className="flex items-center space-x-4 p-4 rounded-lg hover:bg-white/5 transition-colors">
      <Avatar className="w-10 h-10">
        <AvatarFallback className={`bg-gradient-to-r ${activity.avatarColor} text-white`}>
          {getActivityIcon()}
        </AvatarFallback>
      </Avatar>
      
      <div className="flex-1 min-w-0">
        <p className="text-sm">
          {getActivityText()}
        </p>
        <p className="text-sm text-gray-300 truncate">
          {activity.songTitle || activity.playlistName}
        </p>
      </div>
      
      <span className="text-xs text-gray-500 whitespace-nowrap">
        {getTimeAgo(activity.createdAt)}
      </span>
    </div>
  );
}

function SocialSkeleton() {
  return (
    <section>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Skeleton className="w-6 h-6 rounded" />
          <Skeleton className="w-56 h-8 rounded" />
        </div>
        <Skeleton className="w-24 h-6 rounded" />
      </div>
      
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center space-x-4 p-4">
            <Skeleton className="w-10 h-10 rounded-full" />
            <div className="flex-1">
              <Skeleton className="w-3/4 h-4 mb-2 rounded" />
              <Skeleton className="w-1/2 h-3 rounded" />
            </div>
            <Skeleton className="w-16 h-4 rounded" />
          </div>
        ))}
      </div>
    </section>
  );
}
