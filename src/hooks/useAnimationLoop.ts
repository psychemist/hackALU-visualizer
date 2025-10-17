/**
 * useAnimationLoop Hook
 * 
 * Custom hook for managing the animation loop using requestAnimationFrame.
 * Automatically steps through the animation when playing.
 */

import { useEffect, useRef } from 'react';
import { useALUStore } from '@/store/aluStore';

export function useAnimationLoop() {
  const isPlaying = useALUStore((state) => state.animation.isPlaying);
  const currentStep = useALUStore((state) => state.animation.currentStep);
  const speed = useALUStore((state) => state.animation.speed);
  const result = useALUStore((state) => state.result);
  
  const stepForward = useALUStore((state) => state.stepForward);
  const pause = useALUStore((state) => state.pause);

  const lastStepTime = useRef<number>(0);
  const animationFrameId = useRef<number | null>(null);

  useEffect(() => {
    if (!isPlaying || !result) {
      return;
    }

    const maxSteps = result.steps.length;

    const animate = (timestamp: number) => {
      // Initialize on first frame
      if (lastStepTime.current === 0) {
        lastStepTime.current = timestamp;
      }

      const elapsed = timestamp - lastStepTime.current;

      // Check if enough time has passed for the next step
      if (elapsed >= speed) {
        // Check if we've reached the end
        if (currentStep >= maxSteps - 1) {
          pause();
          return;
        }

        stepForward();
        lastStepTime.current = timestamp;
      }

      // Continue the animation loop
      animationFrameId.current = requestAnimationFrame(animate);
    };

    // Start the animation loop
    animationFrameId.current = requestAnimationFrame(animate);

    // Cleanup function
    return () => {
      if (animationFrameId.current !== null) {
        cancelAnimationFrame(animationFrameId.current);
        animationFrameId.current = null;
      }
      lastStepTime.current = 0;
    };
  }, [isPlaying, currentStep, speed, result, stepForward, pause]);
}
