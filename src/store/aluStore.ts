/**
 * ALU Visualizer State Store
 * Manages global application state using Zustand
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Bits, ControlBits, HackALUResult } from '@/lib/core';
import { createBits, hackALU } from '@/lib/core';

/**
 * Animation state for step-by-step visualization
 */
export interface AnimationState {
  isPlaying: boolean;
  currentStep: number;
  speed: number; // ms per step
}

/**
 * Main ALU state
 */
export interface ALUState {
  // Inputs
  x: Bits;
  y: Bits;
  width: number;
  controlBits: ControlBits;
  
  // Computed results
  result: HackALUResult | null;
  
  // UI state
  animation: AnimationState;
  inputMode: 'pin' | 'numeric';
  numericBase: 'decimal' | 'hex' | 'binary';
  signed: boolean;
  
  // Actions
  setX: (x: Bits) => void;
  setY: (y: Bits) => void;
  setWidth: (width: number) => void;
  setControlBit: (bit: keyof ControlBits, value: 0 | 1) => void;
  setControlBits: (bits: ControlBits) => void;
  setOperation: (op: string) => void;
  setSigned: (signed: boolean) => void;
  setInputMode: (mode: 'pin' | 'numeric') => void;
  setNumericBase: (base: 'decimal' | 'hex' | 'binary') => void;
  
  // Animation controls
  play: () => void;
  pause: () => void;
  stepForward: () => void;
  stepBackward: () => void;
  setSpeed: (speed: number) => void;
  resetAnimation: () => void;
  
  // Utility actions
  compute: () => void;
  reset: () => void;
  randomize: () => void;
}

const DEFAULT_WIDTH = 16;
const DEFAULT_CONTROL_BITS: ControlBits = {
  zx: 0,
  nx: 0,
  zy: 0,
  ny: 0,
  f: 1,
  no: 0,
}; // x+y by default

export const useALUStore = create<ALUState>()(
  persist(
    (set, get) => ({
      // Initial state
      x: createBits(DEFAULT_WIDTH),
      y: createBits(DEFAULT_WIDTH),
      width: DEFAULT_WIDTH,
      controlBits: DEFAULT_CONTROL_BITS,
      result: null,
      animation: {
        isPlaying: false,
        currentStep: 0,
        speed: 500,
      },
      inputMode: 'numeric',
      numericBase: 'decimal',
      signed: true,

      // Input setters
      setX: (x) => {
        set({ x });
        get().compute();
      },

      setY: (y) => {
        set({ y });
        get().compute();
      },

      setWidth: (width) => {
        const newX = createBits(width);
        const newY = createBits(width);
        set({ width, x: newX, y: newY });
        get().compute();
      },

      setControlBit: (bit, value) => {
        const newControlBits = { ...get().controlBits, [bit]: value };
        set({ controlBits: newControlBits });
        get().compute();
      },

      setControlBits: (bits) => {
        set({ controlBits: bits });
        get().compute();
      },

      setOperation: (op) => {
        // Map operation name to control bits
        const operationMap: Record<string, ControlBits> = {
          '0': { zx: 1, nx: 0, zy: 1, ny: 0, f: 1, no: 0 },
          '1': { zx: 1, nx: 1, zy: 1, ny: 1, f: 1, no: 1 },
          '-1': { zx: 1, nx: 1, zy: 1, ny: 0, f: 1, no: 0 },
          'x': { zx: 0, nx: 0, zy: 1, ny: 1, f: 0, no: 0 },
          'y': { zx: 1, nx: 1, zy: 0, ny: 0, f: 0, no: 0 },
          '!x': { zx: 0, nx: 0, zy: 1, ny: 1, f: 0, no: 1 },
          '!y': { zx: 1, nx: 1, zy: 0, ny: 0, f: 0, no: 1 },
          '-x': { zx: 0, nx: 0, zy: 1, ny: 1, f: 1, no: 1 },
          '-y': { zx: 1, nx: 1, zy: 0, ny: 0, f: 1, no: 1 },
          'x+1': { zx: 0, nx: 1, zy: 1, ny: 1, f: 1, no: 1 },
          'y+1': { zx: 1, nx: 1, zy: 0, ny: 1, f: 1, no: 1 },
          'x-1': { zx: 0, nx: 0, zy: 1, ny: 1, f: 1, no: 0 },
          'y-1': { zx: 1, nx: 1, zy: 0, ny: 0, f: 1, no: 0 },
          'x+y': { zx: 0, nx: 0, zy: 0, ny: 0, f: 1, no: 0 },
          'x-y': { zx: 0, nx: 1, zy: 0, ny: 0, f: 1, no: 1 },
          'y-x': { zx: 0, nx: 0, zy: 0, ny: 1, f: 1, no: 1 },
          'x&y': { zx: 0, nx: 0, zy: 0, ny: 0, f: 0, no: 0 },
          'x|y': { zx: 0, nx: 1, zy: 0, ny: 1, f: 0, no: 1 },
        };

        const controlBits = operationMap[op] as ControlBits | undefined;
        if (controlBits !== undefined) {
          set({ controlBits });
          get().compute();
        }
      },

      setSigned: (signed) => set({ signed }),

      setInputMode: (mode) => set({ inputMode: mode }),

      setNumericBase: (base) => set({ numericBase: base }),

      // Animation controls
      play: () => set((state) => ({ animation: { ...state.animation, isPlaying: true } })),

      pause: () => set((state) => ({ animation: { ...state.animation, isPlaying: false } })),

      stepForward: () =>
        set((state) => {
          const maxSteps = state.result?.steps.length ?? 0;
          const nextStep = Math.min(state.animation.currentStep + 1, maxSteps - 1);
          return {
            animation: { ...state.animation, currentStep: nextStep, isPlaying: false },
          };
        }),

      stepBackward: () =>
        set((state) => ({
          animation: {
            ...state.animation,
            currentStep: Math.max(state.animation.currentStep - 1, 0),
            isPlaying: false,
          },
        })),

      setSpeed: (speed) =>
        set((state) => ({ animation: { ...state.animation, speed } })),

      resetAnimation: () =>
        set((state) => ({
          animation: { ...state.animation, currentStep: 0, isPlaying: false },
        })),

      // Computation
      compute: () => {
        const { x, y, controlBits } = get();
        try {
          const result = hackALU(x, y, controlBits);
          set({ result });
        } catch (error) {
          console.error('ALU computation error:', error);
          set({ result: null });
        }
      },

      // Utility actions
      reset: () => {
        const width = get().width;
        set({
          x: createBits(width),
          y: createBits(width),
          controlBits: DEFAULT_CONTROL_BITS,
          result: null,
          animation: {
            isPlaying: false,
            currentStep: 0,
            speed: 500,
          },
        });
        get().compute();
      },

      randomize: () => {
        const { width } = get();
        const randomBits = (w: number): Bits =>
          Array.from({ length: w }, () => (Math.random() > 0.5 ? 1 : 0));

        set({
          x: randomBits(width),
          y: randomBits(width),
        });
        get().compute();
      },
    }),
    {
      name: 'alu-visualizer-storage',
      partialize: (state) => ({
        // Only persist essential state
        x: state.x,
        y: state.y,
        width: state.width,
        controlBits: state.controlBits,
        signed: state.signed,
        inputMode: state.inputMode,
        numericBase: state.numericBase,
        animation: {
          speed: state.animation.speed,
          currentStep: 0,
          isPlaying: false,
        },
      }),
    }
  )
);
