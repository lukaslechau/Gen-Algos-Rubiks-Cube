import React from 'react';
import { CubeIndividual } from '@/lib/geneticAlgorithm';

interface CubeCardProps {
  individual: CubeIndividual;
  isTopFour: boolean;
}

const colorMap: Record<string, string> = {
  U: 'bg-yellow-400',
  R: 'bg-red-500',
  F: 'bg-green-500',
  D: 'bg-white',
  L: 'bg-orange-500',
  B: 'bg-blue-600',
};

export const CubeCard: React.FC<CubeCardProps> = ({ individual, isTopFour }) => {
  const { cube, fitness, index } = individual;

  return (
    <div
      className={`p-2 rounded-lg border 
      ${isTopFour ? 'border-primary shadow-lg shadow-primary/40' : 'border-border'}
      bg-card backdrop-blur-sm transition-all`}
    >
      {/* Fitness + Index */}
      <div className="text-xs mb-1 flex justify-between text-muted-foreground">
        <span>#{index}</span>
        <span className="font-mono">{fitness}/54</span>
      </div>

      {/* Cube Net (simple 3x3 of Up face only for a clean UI) */}
      <div className="grid grid-cols-3 gap-[2px] mx-auto">
        {cube.slice(0, 9).split('').map((sticker, i) => (
          <div
            key={i}
            className={`w-4 h-4 rounded-sm border border-black/10 ${colorMap[sticker]}`}
          />
        ))}
      </div>
    </div>
  );
};

export default CubeCard;
