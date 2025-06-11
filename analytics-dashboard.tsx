import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { 
  Headphones, 
  Music, 
  Heart, 
  TrendingUp,
  Clock,
  BarChart3
} from "lucide-react";
import type { UserStats } from "@/types/music";

interface AnalyticsDashboardProps {
  userId: number;
}

export function AnalyticsDashboard({ userId }: AnalyticsDashboardProps) {
  const { data: userStats, isLoading, error } = useQuery({
    queryKey: ["/api/user", userId, "stats"],
    enabled: !!userId,
  });

  if (isLoading) {
    return <AnalyticsSkeleton />;
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-400">İstatistikler yüklenirken hata oluştu</p>
        <p className="text-sm text-gray-500 mt-2">Lütfen daha sonra tekrar deneyin</p>
      </div>
    );
  }

  // Mock data for demonstration
  const mockStats: UserStats = userStats || {
    totalHours: 24.8,
    songsDiscovered: 847,
    favoriteGenre: "Pop"
  };

  const analyticsCards = [
    {
      icon: Headphones,
      title: "Saat dinleme",
      value: mockStats.totalHours.toString(),
      subtitle: "Bu Hafta",
      change: "+12% geçen haftaya göre",
      changeType: "positive",
      gradient: "from-purple-500/20 to-purple-500/10",
      borderColor: "border-purple-500/20",
      iconColor: "text-purple-400"
    },
    {
      icon: Music,
      title: "Keşfedilen şarkı",
      value: mockStats.songsDiscovered.toString(),
      subtitle: "Toplam",
      change: "+24 bu hafta",
      changeType: "positive",
      gradient: "from-blue-500/20 to-blue-500/10",
      borderColor: "border-blue-500/20",
      iconColor: "text-blue-400"
    },
    {
      icon: Heart,
      title: mockStats.favoriteGenre,
      value: "Favori tür",
      subtitle: "En Sevilen",
      change: "%34 oranında",
      changeType: "info",
      gradient: "from-cyan-500/20 to-cyan-500/10",
      borderColor: "border-cyan-500/20",
      iconColor: "text-cyan-400"
    }
  ];

  return (
    <section className="mb-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold flex items-center space-x-3">
          <BarChart3 className="text-cyan-400 w-6 h-6" />
          <span>Dinleme Analizi</span>
        </h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {analyticsCards.map((card, index) => (
          <AnalyticsCard key={index} {...card} />
        ))}
      </div>

      {/* Additional insights */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <ListeningPatterns />
        <TopGenres />
      </div>
    </section>
  );
}

interface AnalyticsCardProps {
  icon: React.ComponentType<any>;
  title: string;
  value: string;
  subtitle: string;
  change: string;
  changeType: "positive" | "negative" | "info";
  gradient: string;
  borderColor: string;
  iconColor: string;
}

function AnalyticsCard({ 
  icon: Icon, 
  title, 
  value, 
  subtitle, 
  change, 
  changeType, 
  gradient, 
  borderColor, 
  iconColor 
}: AnalyticsCardProps) {
  const getChangeColor = () => {
    switch (changeType) {
      case "positive":
        return "text-green-400";
      case "negative":
        return "text-red-400";
      case "info":
        return "text-blue-400";
      default:
        return "text-gray-400";
    }
  };

  return (
    <Card className={`bg-gradient-to-br ${gradient} border ${borderColor}`}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <Icon className={`${iconColor} w-6 h-6`} />
          <Badge variant="secondary" className={`${iconColor} bg-current/20 text-current`}>
            {subtitle}
          </Badge>
        </div>
        <div className="text-3xl font-bold mb-1">{value}</div>
        <div className="text-sm text-gray-400 mb-2">{title}</div>
        <div className={`text-xs ${getChangeColor()}`}>{change}</div>
      </CardContent>
    </Card>
  );
}

function ListeningPatterns() {
  const timeSlots = [
    { time: "06:00-09:00", activity: 15, label: "Sabah" },
    { time: "09:00-12:00", activity: 25, label: "Öğleden Önce" },
    { time: "12:00-15:00", activity: 35, label: "Öğlen" },
    { time: "15:00-18:00", activity: 65, label: "İkindi" },
    { time: "18:00-21:00", activity: 85, label: "Akşam" },
    { time: "21:00-00:00", activity: 45, label: "Gece" },
  ];

  return (
    <Card className="bg-gray-800/50">
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
          <Clock className="w-5 h-5 text-blue-400" />
          <span>Dinleme Saatleri</span>
        </h3>
        <div className="space-y-3">
          {timeSlots.map((slot) => (
            <div key={slot.time} className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex justify-between text-sm mb-1">
                  <span>{slot.label}</span>
                  <span className="text-gray-400">{slot.time}</span>
                </div>
                <div className="w-full bg-gray-600 rounded-full h-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${slot.activity}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function TopGenres() {
  const genres = [
    { name: "Pop", percentage: 34, color: "bg-purple-500" },
    { name: "Rock", percentage: 28, color: "bg-red-500" },
    { name: "Elektronik", percentage: 22, color: "bg-blue-500" },
    { name: "Jazz", percentage: 10, color: "bg-yellow-500" },
    { name: "Klasik", percentage: 6, color: "bg-green-500" },
  ];

  return (
    <Card className="bg-gray-800/50">
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
          <Music className="w-5 h-5 text-green-400" />
          <span>En Çok Dinlenen Türler</span>
        </h3>
        <div className="space-y-3">
          {genres.map((genre) => (
            <div key={genre.name} className="flex items-center justify-between">
              <div className="flex items-center space-x-3 flex-1">
                <div className={`w-3 h-3 rounded-full ${genre.color}`} />
                <span className="text-sm">{genre.name}</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-20 bg-gray-600 rounded-full h-2">
                  <div 
                    className={`${genre.color} h-2 rounded-full transition-all duration-300`}
                    style={{ width: `${genre.percentage}%` }}
                  />
                </div>
                <span className="text-xs text-gray-400 w-8 text-right">
                  {genre.percentage}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function AnalyticsSkeleton() {
  return (
    <section className="mb-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Skeleton className="w-6 h-6 rounded" />
          <Skeleton className="w-48 h-8 rounded" />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="bg-gray-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <Skeleton className="w-6 h-6 rounded" />
                <Skeleton className="w-16 h-5 rounded" />
              </div>
              <Skeleton className="w-16 h-8 mb-2 rounded" />
              <Skeleton className="w-24 h-4 mb-2 rounded" />
              <Skeleton className="w-20 h-3 rounded" />
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        {[...Array(2)].map((_, i) => (
          <Card key={i} className="bg-gray-800">
            <CardContent className="p-6">
              <Skeleton className="w-32 h-6 mb-4 rounded" />
              <div className="space-y-3">
                {[...Array(4)].map((_, j) => (
                  <div key={j} className="flex items-center justify-between">
                    <Skeleton className="w-20 h-4 rounded" />
                    <Skeleton className="w-32 h-2 rounded" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
