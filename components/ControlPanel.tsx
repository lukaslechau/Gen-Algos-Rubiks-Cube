import React from 'react';

interface ControlPanelProps {
  onStart: () => void;
  onNextGeneration: () => void;
  onReset: () => void;
  mutationRate: number;
  onMutationRateChange: (value: number) => void;
  autoEvolve: boolean;
  onAutoEvolveChange: (value: boolean) => void;
  isRunning: boolean;
  generation: number;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
  onStart,
  onNextGeneration,
  onReset,
  mutationRate,
  onMutationRateChange,
  autoEvolve,
  onAutoEvolveChange,
  isRunning,
  generation,
}) => {
  return (
    <div className="p-3 rounded-lg bg-card border border-border shadow-sm space-y-3">
      <button
        onClick={onStart}
        className="w-full py-1.5 rounded bg-primary text-white text-sm hover:bg-primary/90"
      >
        Start
      </button>

      <button
        onClick={onNextGeneration}
        disabled={!isRunning}
        className="w-full py-1.5 rounded bg-secondary text-xs text-white disabled:opacity-40"
      >
        Next Generation
      </button>

      <button
        onClick={onReset}
        className="w-full py-1.5 rounded bg-destructive/80 text-white text-xs hover:bg-destructive"
      >
        Reset
      </button>

      {/* Mutation Rate Slider */}
      <div>
        <label className="block text-xs mb-1 text-muted-foreground">Mutation Rate</label>
        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={mutationRate}
          onChange={(e) => onMutationRateChange(parseFloat(e.target.value))}
          className="w-full"
        />
        <div className="text-[10px] text-right mt-1 text-muted-foreground">
          {(mutationRate * 100).toFixed(0)}%
        </div>
      </div>

      {/* Auto Evolve */}
      <div className="flex items-center justify-between text-xs">
        <span className="text-muted-foreground">Auto-Evolve</span>
        <input
          type="checkbox"
          checked={autoEvolve}
          onChange={(e) => onAutoEvolveChange(e.target.checked)}
        />
      </div>

      {generation > 0 && (
        <p className="text-[10px] text-muted-foreground text-center">
          Gen: <b>{generation}</b>
        </p>
      )}
    </div>
  );
};

export default ControlPanel;
