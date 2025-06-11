import React from 'react';
import { Music, Smile, Compass } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { useMusic } from '@/contexts/music-context';

export function StatsCards() {
  const { userStats, listeningHistory } = useMusic();
  
  const thisWeekDiscoveries = 42; // This would be calculated from listening history
  const monthlyGrowth = "+23%"; // This would be calculated from previous periods

  return (
    <section className="mb-12">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="glassmorphism rounded-2xl p-6 border-white/10">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-2xl font-bold text-primary">
                {userStats.songsPlayed.toLocaleString()}
              </div>
              <div className="text-sm text-gray-400">
                Songs Played This Month
              </div>
            </div>
            <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
              <Music className="h-6 w-6 text-primary" />
            </div>
          </div>
          <div className="text-xs text-primary font-medium">
            {monthlyGrowth} from last month
          </div>
        </Card>
        
        <Card className="glassmorphism rounded-2xl p-6 border-white/10">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-2xl font-bold text-accent capitalize">
                {userStats.moodDetected}
              </div>
              <div className="text-sm text-gray-400">
                Current Mood Preference
              </div>
            </div>
            <div className="w-12 h-12 bg-accent/20 rounded-full flex items-center justify-center">
              <Smile className="h-6 w-6 text-accent" />
            </div>
          </div>
          <div className="text-xs text-accent font-medium">
            AI Analysis Based
          </div>
        </Card>
        
        <Card className="glassmorphism rounded-2xl p-6 border-white/10">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-2xl font-bold text-secondary">
                {thisWeekDiscoveries}
              </div>
              <div className="text-sm text-gray-400">
                New Artists Discovered
              </div>
            </div>
            <div className="w-12 h-12 bg-secondary/20 rounded-full flex items-center justify-center">
              <Compass className="h-6 w-6 text-secondary" />
            </div>
          </div>
          <div className="text-xs text-secondary font-medium">
            This week
          </div>
        </Card>
      </div>
    </section>
  );
}
