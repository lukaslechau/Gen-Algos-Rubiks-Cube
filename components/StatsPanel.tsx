import React from 'react';
import { CubeIndividual } from '@/lib/geneticAlgorithm';

interface StatsPanelProps {
  generation: number;
  population: CubeIndividual[];
  bestFitnessAllTime: number;
}

export const StatsPanel: React.FC<StatsPanelProps> = ({
  generation,
  population,
  bestFitnessAllTime,
}) => {

  const avgFitness =
    population.length > 0
      ? (
          population.reduce((sum, p) => sum + p.fitness, 0) /
          population.length
        ).toFixed(1)
      : 0;

  const bestCurrent = Math.max(...population.map((p) => p.fitness), 0);

  return (
    <div className="p-3 rounded-lg bg-card border border-border shadow-sm text-xs space-y-2">
      <div className="flex justify-between">
        <span className="text-muted-foreground">Generation:</span>
        <span className="font-mono">{generation}</span>
      </div>

      <div className="flex justify-between">
        <span className="text-muted-foreground">Best (current):</span>
        <span className="font-mono">{bestCurrent}/54</span>
      </div>

      <div className="flex justify-between">
        <span className="text-muted-foreground">Best (all-time):</span>
        <span className="font-mono">{bestFitnessAllTime}/54</span>
      </div>

      <div className="flex justify-between">
        <span className="text-muted-foreground">Avg fitness:</span>
        <span className="font-mono">{avgFitness}</span>
      </div>
    </div>
  );
};

export default StatsPanel;
