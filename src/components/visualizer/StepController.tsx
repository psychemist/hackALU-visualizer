/**
 * StepController Component
 * 
 * Controls for playing, pausing, and stepping through the ALU animation.
 * Includes play/pause button, step forward/back, and speed slider.
 */

import { useALUStore } from '@/store/aluStore';

export function StepController() {
  const isPlaying = useALUStore((state) => state.animation.isPlaying);
  const currentStep = useALUStore((state) => state.animation.currentStep);
  const speed = useALUStore((state) => state.animation.speed);
  const result = useALUStore((state) => state.result);
  
  const play = useALUStore((state) => state.play);
  const pause = useALUStore((state) => state.pause);
  const stepForward = useALUStore((state) => state.stepForward);
  const stepBackward = useALUStore((state) => state.stepBackward);
  const setSpeed = useALUStore((state) => state.setSpeed);
  const resetAnimation = useALUStore((state) => state.resetAnimation);

  const maxSteps = result?.steps.length ?? 0;
  const disabled = maxSteps === 0;

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <h3 className="mb-3 text-sm font-semibold text-gray-900 dark:text-white">
        Animation Controls
      </h3>

      {/* Step info */}
      <div className="mb-4 text-center">
        <div className="text-2xl font-bold text-gray-900 dark:text-white">
          {currentStep + 1} / {maxSteps}
        </div>
        <div className="text-xs text-gray-500 dark:text-gray-400">
          Current Step
        </div>
      </div>

      {/* Main controls */}
      <div className="mb-4 flex items-center justify-center gap-2">
        {/* Step backward */}
        <button
          type="button"
          onClick={stepBackward}
          disabled={disabled || currentStep === 0}
          className="rounded-md bg-gray-100 p-2 text-gray-700 hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
          aria-label="Step backward"
          title="Step backward"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Play/Pause */}
        <button
          type="button"
          onClick={isPlaying ? pause : play}
          disabled={disabled}
          className="rounded-md bg-blue-500 p-3 text-white hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
          aria-label={isPlaying ? 'Pause' : 'Play'}
          title={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? (
            <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
            </svg>
          ) : (
            <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
        </button>

        {/* Step forward */}
        <button
          type="button"
          onClick={stepForward}
          disabled={disabled || currentStep >= maxSteps - 1}
          className="rounded-md bg-gray-100 p-2 text-gray-700 hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
          aria-label="Step forward"
          title="Step forward"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* Reset */}
        <button
          type="button"
          onClick={resetAnimation}
          disabled={disabled}
          className="rounded-md bg-gray-100 p-2 text-gray-700 hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
          aria-label="Reset to start"
          title="Reset to start"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
      </div>

      {/* Speed control */}
      <div className="space-y-2">
        <label htmlFor="speed-slider" className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400">
          <span>Speed</span>
          <span>{String(1000 / speed)}x</span>
        </label>
        <input
          id="speed-slider"
          type="range"
          min="100"
          max="2000"
          step="100"
          value={speed}
          onChange={(e) => {
            setSpeed(Number(e.target.value));
          }}
          disabled={disabled}
          className="w-full accent-blue-500 disabled:opacity-50"
          aria-label="Animation speed"
        />
        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
          <span>Fast</span>
          <span>Slow</span>
        </div>
      </div>

      {/* Current step description */}
      {result?.steps[currentStep] && (
        <div className="mt-4 rounded-md bg-blue-50 p-3 dark:bg-blue-900/20">
          <p className="text-xs text-blue-800 dark:text-blue-300">
            {result.steps[currentStep]?.description}
          </p>
        </div>
      )}
    </div>
  );
}
