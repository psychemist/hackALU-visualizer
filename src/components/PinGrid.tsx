/**
 * PinGrid Component
 * 
 * Grid of BitToggle components for displaying and editing multi-bit values.
 * Displays bits in LSB-first order (right-to-left) with bit index labels.
 * Supports keyboard navigation and provides visual grouping.
 */

import { BitToggle } from './BitToggle';

export interface PinGridProps {
  /** Label for the pin grid */
  label: string;
  /** Current bit array value (LSB-first) */
  value: (0 | 1)[];
  /** Callback when a bit is toggled */
  onChange: (index: number, newValue: 0 | 1) => void;
  /** Whether the grid is disabled */
  disabled?: boolean;
  /** Show bit index labels */
  showLabels?: boolean;
  /** Size of individual bit toggles */
  size?: 'sm' | 'md' | 'lg';
  /** Additional CSS classes */
  className?: string;
}

export function PinGrid({
  label,
  value,
  onChange,
  disabled = false,
  showLabels = true,
  size = 'md',
  className = '',
}: PinGridProps) {
  const width = value.length;

  return (
    <div className={className}>
      {/* Label */}
      <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
        {label}
      </label>

      {/* Bit Grid - Display RTL (LSB on right) */}
      <div className="flex flex-col gap-2">
        {showLabels && (
          <div className="flex flex-row-reverse justify-start gap-1">
            {value.map((_, index) => (
              <div
                key={index}
                className={`
                  flex items-center justify-center font-mono text-xs text-gray-500 dark:text-gray-400
                  ${size === 'sm' ? 'h-4 w-6' : size === 'md' ? 'h-5 w-8' : 'h-6 w-10'}
                `}
              >
                {index}
              </div>
            ))}
          </div>
        )}

        <div className="flex flex-row-reverse justify-start gap-1" role="group" aria-label={label}>
          {value.map((bit, index) => (
            <BitToggle
              key={index}
              value={bit}
              onChange={(newValue) => {
                onChange(index, newValue);
              }}
              index={index}
              disabled={disabled}
              size={size}
              ariaLabel={`${label} bit ${String(index)}`}
            />
          ))}
        </div>
      </div>

      {/* Helper Text */}
      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
        {width} bits • LSB (bit 0) on right
      </p>
    </div>
  );
}
