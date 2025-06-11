import React from 'react';

interface GenreData {
  name: string;
  percentage: number;
  color: string;
}

interface GenreDistributionProps {
  data: GenreData[];
}

const GenreDistribution = ({ data }: GenreDistributionProps) => {
  // Calculate cumulative percentages for positioning
  let cumulativePercentage = 0;
  const genres = data.map(genre => {
    const start = cumulativePercentage;
    cumulativePercentage += genre.percentage;
    return {
      ...genre,
      start,
      end: cumulativePercentage
    };
  });
  
  return (
    <div className="mb-6">
      <h4 className="text-sm font-medium text-muted-foreground mb-3">Tür Dağılımı</h4>
      <div className="relative h-8 bg-muted rounded-lg overflow-hidden">
        {genres.map((genre, index) => (
          <div 
            key={index}
            className="absolute top-0 h-full"
            style={{ 
              left: `${genre.start}%`, 
              width: `${genre.percentage}%`,
              backgroundColor: genre.color
            }}
            title={`${genre.name}: ${genre.percentage}%`}
          ></div>
        ))}
      </div>
      <div className="flex justify-between mt-2 text-xs text-muted-foreground flex-wrap">
        {genres.slice(0, 3).map((genre, index) => (
          <div key={index} className="flex items-center">
            <span 
              className="w-2 h-2 rounded-full mr-1"
              style={{ backgroundColor: genre.color }}
            ></span>
            {genre.name} ({genre.percentage}%)
          </div>
        ))}
      </div>
    </div>
  );
};

export default GenreDistribution;
