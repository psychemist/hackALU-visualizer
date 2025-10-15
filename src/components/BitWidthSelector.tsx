/**
 * BitWidthSelector Component
 * 
 * Selector for choosing bit width (4, 8, or 16 bits).
 * Validates that current values don't overflow when width changes.
 * Shows warning if values need adjustment.
 */

import { useMemo } from 'react';
import { getValueRange } from '@/lib/validation';

export interface BitWidthSelectorProps {
  /** Current bit width */
  value: number;
  /** Callback when bit width is changed */
  onChange: (width: number) => void;
  /** Current x value (for validation) */
  currentXValue?: number;
  /** Current y value (for validation) */
  currentYValue?: number;
  /** Whether the selector is disabled */
  disabled?: boolean;
  /** Additional CSS classes */
  className?: string;
}

const AVAILABLE_WIDTHS = [4, 8, 16] as const;

export function BitWidthSelector({
  value,
  onChange,
  currentXValue,
  currentYValue,
  disabled = false,
  className = '',
}: BitWidthSelectorProps) {
  // Check if current values will fit in the selected width
  const warning = useMemo(() => {
    if (currentXValue === undefined && currentYValue === undefined) {
      return null;
    }

    const { min, max } = getValueRange(value, true);

    const xOutOfRange = currentXValue !== undefined && (currentXValue < min || currentXValue > max);
    const yOutOfRange = currentYValue !== undefined && (currentYValue < min || currentYValue > max);

    if (xOutOfRange && yOutOfRange) {
      return 'Both x and y values will be clamped to fit the new width';
    }
    if (xOutOfRange) {
      return 'x value will be clamped to fit the new width';
    }
    if (yOutOfRange) {
      return 'y value will be clamped to fit the new width';
    }

    return null;
  }, [value, currentXValue, currentYValue]);

  return (
    <div className={className}>
      <label
        htmlFor="bit-width-selector"
        className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
      >
        Bit Width
      </label>

      <div className="flex gap-2" role="radiogroup" aria-labelledby="bit-width-label">
        {AVAILABLE_WIDTHS.map((width) => {
          const isSelected = value === width;
          const { min, max } = getValueRange(width, true);

          return (
            <button
              key={width}
              type="button"
              role="radio"
              aria-checked={isSelected}
              onClick={() => {
                onChange(width);
              }}
              disabled={disabled}
              className={`
                flex-1 rounded-md border px-3 py-2 text-sm font-medium transition-colors
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                disabled:cursor-not-allowed disabled:opacity-50
                dark:focus:ring-offset-gray-900
                ${
                  isSelected
                    ? 'border-blue-500 bg-blue-50 text-blue-700 dark:border-blue-400 dark:bg-blue-900/50 dark:text-blue-300'
                    : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                }
              `}
            >
              <div className="font-semibold">{width} bits</div>
              <div className="mt-0.5 text-xs opacity-75">
                {String(min)} to {String(max)}
              </div>
            </button>
          );
        })}
      </div>

      {warning && (
        <div
          className="mt-2 flex items-start gap-2 rounded-md bg-yellow-50 p-2 dark:bg-yellow-900/20"
          role="alert"
        >
          <svg
            className="mt-0.5 h-4 w-4 flex-shrink-0 text-yellow-600 dark:text-yellow-500"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          <p className="text-xs text-yellow-700 dark:text-yellow-400">{warning}</p>
        </div>
      )}

      <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
        Choose the number of bits for x, y, and output
      </p>
    </div>
  );
}
