import React, { useEffect } from 'react';
import { CubeIndividual } from '@/lib/geneticAlgorithm';

interface BreedingAnimationProps {
  parents: CubeIndividual[];
  isBreeding: boolean;
  onComplete: () => void;
}

export const BreedingAnimation: React.FC<BreedingAnimationProps> = ({
  parents,
  isBreeding,
  onComplete,
}) => {
  useEffect(() => {
    if (isBreeding) {
      const timer = setTimeout(() => {
        onComplete();
      }, 600); // animation delay
      return () => clearTimeout(timer);
    }
  }, [isBreeding, onComplete]);

  if (!isBreeding) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/20 backdrop-blur-sm z-30">
      <div className="text-center p-6 bg-card border border-primary/30 rounded-xl shadow-lg animate-pulse">
        <p className="text-sm text-primary font-medium">
          Breeding top performers...
        </p>
      </div>
    </div>
  );
};

export default BreedingAnimation;
