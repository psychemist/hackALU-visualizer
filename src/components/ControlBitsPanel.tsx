/**
 * ControlBitsPanel Component
 * 
 * Panel with 6 toggle switches for Hack ALU control bits (zx, nx, zy, ny, f, no).
 * Each toggle has a description explaining its function in the ALU pipeline.
 */

import { BitToggle } from './BitToggle';
import type { ControlBits } from '@/lib/core';

export interface ControlBitsPanelProps {
  /** Current control bits state */
  value: ControlBits;
  /** Callback when a control bit is toggled */
  onChange: (bit: keyof ControlBits, value: 0 | 1) => void;
  /** Whether the panel is disabled */
  disabled?: boolean;
  /** Additional CSS classes */
  className?: string;
}

const CONTROL_BIT_INFO: Record<keyof ControlBits, { label: string; description: string }> = {
  zx: {
    label: 'zx',
    description: 'Zero the x input (set all bits to 0)',
  },
  nx: {
    label: 'nx',
    description: 'Negate the x input (bitwise NOT)',
  },
  zy: {
    label: 'zy',
    description: 'Zero the y input (set all bits to 0)',
  },
  ny: {
    label: 'ny',
    description: 'Negate the y input (bitwise NOT)',
  },
  f: {
    label: 'f',
    description: 'Function: 1 = Add (x + y), 0 = And (x & y)',
  },
  no: {
    label: 'no',
    description: 'Negate the output (bitwise NOT)',
  },
};

const CONTROL_BIT_ORDER: (keyof ControlBits)[] = ['zx', 'nx', 'zy', 'ny', 'f', 'no'];

export function ControlBitsPanel({
  value,
  onChange,
  disabled = false,
  className = '',
}: ControlBitsPanelProps) {
  return (
    <div className={className}>
      <h3 className="mb-3 text-sm font-semibold text-gray-900 dark:text-white">Control Bits</h3>

      <div className="space-y-3">
        {CONTROL_BIT_ORDER.map((bit) => {
          const info = CONTROL_BIT_INFO[bit];
          return (
            <div
              key={bit}
              className="flex items-start gap-3 rounded-lg border border-gray-200 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-800/50"
            >
              <BitToggle
                value={value[bit]}
                onChange={(newValue) => {
                  onChange(bit, newValue);
                }}
                disabled={disabled}
                size="md"
                ariaLabel={`Control bit ${info.label}`}
              />

              <div className="flex-1">
                <div className="font-mono text-sm font-semibold text-gray-900 dark:text-white">
                  {info.label}
                </div>
                <div className="mt-0.5 text-xs text-gray-600 dark:text-gray-400">
                  {info.description}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">
        Toggle control bits to configure the ALU operation
      </p>
    </div>
  );
}
