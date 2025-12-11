import { useState, useEffect, useCallback, useRef } from 'react';
import { CubeCard } from '@/components/CubeCard';
import { ControlPanel } from '@/components/ControlPanel';
import { StatsPanel } from '@/components/StatsPanel';
import { TopCubesPanel } from '@/components/TopCubesPanel';
import { BreedingAnimation } from '@/components/BreedingAnimation';
import { 
  CubeIndividual, 
  initializePopulation, 
  nextGeneration,
  resetStagnation 
} from '@/lib/geneticAlgorithm';
import { Dna, Github, PartyPopper } from 'lucide-react';

const Index = () => {
  const [population, setPopulation] = useState<CubeIndividual[]>([]);
  const [generation, setGeneration] = useState(0);
  const [mutationRate, setMutationRate] = useState(0.2);
  const [autoEvolve, setAutoEvolve] = useState(false);
  const [bestFitnessAllTime, setBestFitnessAllTime] = useState(0);
  const [isBreeding, setIsBreeding] = useState(false);
  const [breedingParents, setBreedingParents] = useState<CubeIndividual[]>([]);
  const [isSolved, setIsSolved] = useState(false);
  const autoEvolveRef = useRef(autoEvolve);
  
  // Keep ref in sync with state
  useEffect(() => {
    autoEvolveRef.current = autoEvolve;
  }, [autoEvolve]);

  const handleStart = useCallback(() => {
    resetStagnation();
    const initialPop = initializePopulation(16);
    setPopulation(initialPop);
    setGeneration(1);
    setIsSolved(false);
    const maxFitness = Math.max(...initialPop.map(p => p.fitness));
    setBestFitnessAllTime(maxFitness);
    // Do NOT auto-start - let user choose to step or auto-play
    setAutoEvolve(false);
  }, []);

  const handleNextGeneration = useCallback(() => {
    if (population.length === 0) return;
    
    // Check if already solved
    const currentBest = Math.max(...population.map(p => p.fitness));
    if (currentBest === 54) {
      setIsSolved(true);
      setAutoEvolve(false);
      return;
    }
    
    // Get top 2 parents for animation
    const sorted = [...population].sort((a, b) => b.fitness - a.fitness);
    setBreedingParents([sorted[0], sorted[1]]);
    setIsBreeding(true);
  }, [population]);
  
  const handleBreedingComplete = useCallback(() => {
    setIsBreeding(false);
    
    const newPop = nextGeneration(population, mutationRate);
    setPopulation(newPop);
    setGeneration(g => g + 1);
    
    const maxFitness = Math.max(...newPop.map(p => p.fitness));
    setBestFitnessAllTime(prev => Math.max(prev, maxFitness));
    
    // Check if solved
    if (maxFitness === 54) {
      setIsSolved(true);
      setAutoEvolve(false);
    }
  }, [population, mutationRate]);

  const handleReset = useCallback(() => {
    setPopulation([]);
    setGeneration(0);
    setAutoEvolve(false);
    setBestFitnessAllTime(0);
    setIsSolved(false);
    setIsBreeding(false);
  }, []);

  // Auto-evolve effect - speeds up after 50 generations
  useEffect(() => {
    if (!autoEvolve || generation === 0 || isBreeding || isSolved) return;

    // Speed up after 50 generations (300ms instead of 400ms)
    const speed = generation > 50 ? 300 : 400;
    
    const interval = setInterval(() => {
      if (autoEvolveRef.current && !isSolved) {
        handleNextGeneration();
      }
    }, speed);

    return () => clearInterval(interval);
  }, [autoEvolve, generation, isBreeding, isSolved, handleNextGeneration]);

  // Auto-dismiss solved overlay after 4 seconds
  useEffect(() => {
    if (isSolved) {
      const timer = setTimeout(() => {
        setIsSolved(false);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [isSolved]);

  // Sort population by fitness for display (to highlight top 4)
  const sortedPopulation = [...population].sort((a, b) => b.fitness - a.fitness);
  const topFourIndices = new Set(sortedPopulation.slice(0, 4).map(p => p.index));
  const topFour = sortedPopulation.slice(0, 4);

  return (
    <div className="min-h-screen bg-background">
      {/* Background effects */}
      <div className="fixed inset-0 gradient-radial pointer-events-none" />
      
      {/* Breeding Animation */}
      <BreedingAnimation 
        parents={breedingParents} 
        isBreeding={isBreeding} 
        onComplete={handleBreedingComplete}
      />
      
      {/* Solved Celebration */}
      {isSolved && (
        <div className="fixed inset-0 z-40 flex items-center justify-center pointer-events-none">
          <div className="bg-card/90 backdrop-blur-xl border border-primary/50 rounded-2xl p-6 text-center animate-scale-in glow-primary">
            <PartyPopper className="w-12 h-12 mx-auto text-yellow-400 mb-3" />
            <h2 className="text-xl font-bold text-foreground mb-1">Evolution Complete!</h2>
            <p className="text-sm text-muted-foreground">
              Solved in <span className="text-primary font-mono">{generation}</span> generations
            </p>
          </div>
        </div>
      )}
      
      <div className="relative z-10 container mx-auto px-4 py-4 max-w-7xl">
        {/* Compact Header */}
        <header className="flex items-center gap-3 mb-4 animate-fade-in">
          <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
            <Dna className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-foreground text-glow">
              Genetic Rubik's Cube Evolution Lab
            </h1>
            <p className="text-xs text-muted-foreground">
              Watch cubes evolve toward the solved state using genetic algorithms
            </p>
          </div>
          <a 
            href="https://github.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="ml-auto inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors"
          >
            <Github className="w-4 h-4" />
          </a>
        </header>

        {/* Top Bar: Controls, Stats, Elite Cubes */}
        <div className="grid grid-cols-[180px_200px_1fr] gap-3 mb-4">
          <ControlPanel
            onStart={handleStart}
            onNextGeneration={handleNextGeneration}
            onReset={handleReset}
            mutationRate={mutationRate}
            onMutationRateChange={setMutationRate}
            autoEvolve={autoEvolve}
            onAutoEvolveChange={setAutoEvolve}
            isRunning={generation > 0}
            generation={generation}
          />
          <StatsPanel
            generation={generation}
            population={population}
            bestFitnessAllTime={bestFitnessAllTime}
          />
          <TopCubesPanel topFour={topFour} />
        </div>

        {/* Population Grid */}
        <main>
          {population.length === 0 ? (
            <div className="flex items-center justify-center h-[300px] border border-dashed border-border/50 rounded-xl bg-card/20">
              <div className="text-center space-y-2">
                <div className="w-12 h-12 mx-auto rounded-lg bg-primary/10 flex items-center justify-center animate-pulse-glow">
                  <Dna className="w-6 h-6 text-primary" />
                </div>
                <p className="text-sm text-muted-foreground">
                  Click <span className="text-primary font-medium">Start</span> to begin
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-4 md:grid-cols-8 gap-2">
              {population.map((individual) => (
                <CubeCard
                  key={individual.index}
                  individual={individual}
                  isTopFour={topFourIndices.has(individual.index)}
                />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Index;
