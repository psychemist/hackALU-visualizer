/**
 * BitToggle Component
 * 
 * Individual bit toggle switch with keyboard support and accessibility.
 * Displays a single bit that can be toggled between 0 and 1.
 * Supports keyboard interaction (Space/Enter) and focus management.
 */

import { type KeyboardEvent } from 'react';

export interface BitToggleProps {
  /** Current bit value (0 or 1) */
  value: 0 | 1;
  /** Callback when bit is toggled */
  onChange: (value: 0 | 1) => void;
  /** Bit index for labeling (optional) */
  index?: number;
  /** Whether the toggle is disabled */
  disabled?: boolean;
  /** Additional CSS classes */
  className?: string;
  /** Accessible label for screen readers */
  ariaLabel?: string;
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
}

const SIZE_CLASSES = {
  sm: 'h-6 w-6 text-xs',
  md: 'h-8 w-8 text-sm',
  lg: 'h-10 w-10 text-base',
};

export function BitToggle({
  value,
  onChange,
  index,
  disabled = false,
  className = '',
  ariaLabel,
  size = 'md',
}: BitToggleProps) {
  const handleClick = () => {
    if (!disabled) {
      onChange(value === 0 ? 1 : 0);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (disabled) return;

    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      onChange(value === 0 ? 1 : 0);
    }
  };

  const label = ariaLabel ?? (index !== undefined ? `Bit ${String(index)}` : 'Bit toggle');

  return (
    <div
      role="switch"
      aria-checked={value === 1}
      aria-label={label}
      tabIndex={disabled ? -1 : 0}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      className={`
        ${SIZE_CLASSES[size]}
        flex cursor-pointer select-none items-center justify-center rounded-md font-mono font-semibold
        transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
        dark:focus:ring-offset-gray-900
        ${
          disabled
            ? 'cursor-not-allowed opacity-50'
            : 'hover:scale-105 active:scale-95'
        }
        ${
          value === 1
            ? 'bg-green-500 text-white shadow-md shadow-green-500/50 dark:bg-green-600'
            : 'bg-gray-200 text-gray-700 shadow-sm dark:bg-gray-700 dark:text-gray-300'
        }
        ${className}
      `}
    >
      {value}
    </div>
  );
}
