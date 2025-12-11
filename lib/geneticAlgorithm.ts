// FULL genetic algorithm logic
// (same as your working version — cleaned + organized)

export const SOLVED_CUBE =
  'UUUUUUUUURRRRRRRRRFFFFFFFFFDDDDDDDDDLLLLLLLLLBBBBBBBBB';

export const FACE_COLORS = {
  U: 'cube-yellow',
  R: 'cube-red',
  F: 'cube-green',
  D: 'cube-white',
  L: 'cube-orange',
  B: 'cube-blue',
};

export interface CubeIndividual {
  cube: string;
  moves: string[];
  fitness: number;
  mutated: boolean;
  index: number;
}

export function computeFitness(cube: string): number {
  let matches = 0;
  for (let i = 0; i < 54; i++) {
    if (cube[i] === SOLVED_CUBE[i]) matches++;
  }
  return matches;
}

/* ========== RANDOM CUBE GENERATION (weighted distribution) ========== */

const COLORS = ['U', 'R', 'F', 'D', 'L', 'B'];

function generateRandomCubeWithTargetFitness(targetMatches: number): string {
  const indices = Array.from({ length: 54 }, (_, i) => i);
  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }

  const cube = SOLVED_CUBE.split('');

  for (let idx = 0; idx < targetMatches; idx++) {
    const pos = indices[idx];
    cube[pos] = SOLVED_CUBE[pos];
  }

  for (let idx = targetMatches; idx < 54; idx++) {
    const pos = indices[idx];
    const solvedColor = SOLVED_CUBE[pos];
    const choices = COLORS.filter((c) => c !== solvedColor);
    cube[pos] = choices[Math.floor(Math.random() * choices.length)];
  }

  return cube.join('');
}

function sampleTargetMatches(): number {
  const r = Math.random();
  if (r < 0.6) return 10 + Math.floor(Math.random() * 21);
  if (r < 0.9) return 31 + Math.floor(Math.random() * 15);
  return 46 + Math.floor(Math.random() * 8);
}

export function createRandomCube(index: number): CubeIndividual {
  const fitnessGoal = sampleTargetMatches();
  const cube = generateRandomCubeWithTargetFitness(fitnessGoal);
  return {
    cube,
    moves: [],
    fitness: computeFitness(cube),
    mutated: false,
    index,
  };
}

/* ========== CROSSOVER & GENERATION EVOLUTION ========== */

function crossover(p1: CubeIndividual, p2: CubeIndividual, index: number) {
  const cut = Math.floor(Math.random() * 54);
  let child = p1.cube.slice(0, cut) + p2.cube.slice(cut);

  if (Math.random() < 0.02) {
    const arr = child.split('');
    const i = Math.floor(Math.random() * 54);
    const j = Math.floor(Math.random() * 54);
    [arr[i], arr[j]] = [arr[j], arr[i]];
    child = arr.join('');
  }

  return {
    cube: child,
    moves: [],
    fitness: computeFitness(child),
    mutated: true,
    index,
  };
}

export function initializePopulation(size = 16) {
  return Array.from({ length: size }, (_, i) => createRandomCube(i + 1));
}

export function nextGeneration(pop: CubeIndividual[], mutationRate: number) {
  const sorted = [...pop].sort((a, b) => b.fitness - a.fitness);
  const [P1, P2, P3, P4] = sorted;

  const childA = crossover(P1, P4, 5);
  const childB = crossover(P2, P3, 6);

  const rand = Array.from({ length: 10 }, (_, i) =>
    createRandomCube(7 + i)
  );

  let next = [P1, P2, P3, P4, childA, childB, ...rand];

  next.sort((a, b) => b.fitness - a.fitness);
  next = next.slice(0, 16).map((ind, i) => ({
    ...ind,
    index: i + 1,
    mutated: i >= 4,
  }));

  return next;
}

export function resetStagnation() {
  return;
}

export function getScramble() {
  return SOLVED_CUBE;
}
