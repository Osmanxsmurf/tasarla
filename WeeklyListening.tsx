import React from 'react';

interface DayData {
  day: string;
  shortDay: string;
  percentage: number;
}

interface WeeklyListeningProps {
  data: DayData[];
}

const WeeklyListening = ({ data }: WeeklyListeningProps) => {
  return (
    <div>
      <h4 className="text-sm font-medium text-muted-foreground mb-3">Haftalık Dinleme</h4>
      <div className="grid grid-cols-7 gap-1 h-28">
        {data.map((item, index) => (
          <div key={index} className="flex flex-col items-center">
            <div className="flex-1 w-full flex items-end">
              <div 
                className="bg-primary/50 hover:bg-primary/70 transition-colors w-full rounded-t-sm" 
                style={{ height: `${item.percentage}%` }}
                title={`${item.day}: ${item.percentage}%`}
              ></div>
            </div>
            <span className="text-xs text-muted-foreground mt-1">{item.shortDay}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeeklyListening;
