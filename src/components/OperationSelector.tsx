/**
 * OperationSelector Component
 * 
 * Dropdown selector for 18 predefined Hack ALU operations.
 * Automatically sets the appropriate control bits when an operation is selected.
 * Shows operation description and formula.
 */

import type { ALUOperation } from '@/lib/core';

export interface OperationSelectorProps {
  /** Currently selected operation */
  value: ALUOperation | null;
  /** Callback when operation is selected */
  onChange: (operation: ALUOperation) => void;
  /** Whether the selector is disabled */
  disabled?: boolean;
  /** Additional CSS classes */
  className?: string;
}

const OPERATIONS: { value: ALUOperation; label: string; description: string }[] = [
  { value: '0', label: '0', description: 'Output constant 0' },
  { value: '1', label: '1', description: 'Output constant 1' },
  { value: '-1', label: '-1', description: 'Output constant -1' },
  { value: 'x', label: 'x', description: 'Pass through x input' },
  { value: 'y', label: 'y', description: 'Pass through y input' },
  { value: '!x', label: '!x', description: 'Bitwise NOT of x' },
  { value: '!y', label: '!y', description: 'Bitwise NOT of y' },
  { value: '-x', label: '-x', description: 'Negate x (two\'s complement)' },
  { value: '-y', label: '-y', description: 'Negate y (two\'s complement)' },
  { value: 'x+1', label: 'x+1', description: 'Increment x by 1' },
  { value: 'y+1', label: 'y+1', description: 'Increment y by 1' },
  { value: 'x-1', label: 'x-1', description: 'Decrement x by 1' },
  { value: 'y-1', label: 'y-1', description: 'Decrement y by 1' },
  { value: 'x+y', label: 'x+y', description: 'Add x and y' },
  { value: 'x-y', label: 'x-y', description: 'Subtract y from x' },
  { value: 'y-x', label: 'y-x', description: 'Subtract x from y' },
  { value: 'x&y', label: 'x&y', description: 'Bitwise AND of x and y' },
  { value: 'x|y', label: 'x|y', description: 'Bitwise OR of x and y' },
];

export function OperationSelector({
  value,
  onChange,
  disabled = false,
  className = '',
}: OperationSelectorProps) {
  const selectedOp = value !== null ? OPERATIONS.find((op) => op.value === value) : null;

  return (
    <div className={className}>
      <label
        htmlFor="operation-selector"
        className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
      >
        Operation
      </label>

      <select
        id="operation-selector"
        value={value ?? ''}
        onChange={(e) => {
          onChange(e.target.value as ALUOperation);
        }}
        disabled={disabled}
        className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
        aria-describedby="operation-description"
      >
        <option value="">Select operation...</option>
        {OPERATIONS.map((op) => (
          <option key={op.value} value={op.value}>
            {op.label}
          </option>
        ))}
      </select>

      {selectedOp && (
        <p
          id="operation-description"
          className="mt-2 text-xs text-gray-600 dark:text-gray-400"
        >
          {selectedOp.description}
        </p>
      )}

      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
        Select an operation to auto-configure control bits
      </p>
    </div>
  );
}
