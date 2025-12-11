import React from 'react';
import { CubeIndividual } from '@/lib/geneticAlgorithm';
import CubeCard from './CubeCard';

interface TopCubesPanelProps {
  topFour: CubeIndividual[];
}

export const TopCubesPanel: React.FC<TopCubesPanelProps> = ({ topFour }) => {
  return (
    <div className="p-3 rounded-lg bg-card border border-border shadow-sm">
      <h3 className="text-xs font-semibold mb-2 text-muted-foreground">
        Top 4 Cubes
      </h3>
      <div className="grid grid-cols-4 gap-1">
        {topFour.map((cube) => (
          <CubeCard key={cube.index} individual={cube} isTopFour={true} />
        ))}
      </div>
    </div>
  );
};

export default TopCubesPanel;
