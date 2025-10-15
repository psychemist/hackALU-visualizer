/**
 * NumericInput Component
 * Allows input in decimal, hexadecimal, or binary format with validation
 */

import { useState, useEffect, useCallback } from 'react';
import type { Bits } from '@/lib/core';
import { decimalToBits, bitsToDecimal, hexToBits, bitsToHex, binaryToBits, bitsToBinary } from '@/lib/core';
import { validateValue, getValueRange, sanitizeHexString, sanitizeBinaryString } from '@/lib/validation';

export type NumericBase = 'decimal' | 'hex' | 'binary';

interface NumericInputProps {
  label: string;
  value: Bits;
  width: number;
  signed: boolean;
  base: NumericBase;
  onChange: (bits: Bits) => void;
  onBaseChange?: (base: NumericBase) => void;
  className?: string;
  id?: string;
}

export function NumericInput({
  label,
  value,
  width,
  signed,
  base,
  onChange,
  onBaseChange,
  className = '',
  id,
}: NumericInputProps) {
  const [inputValue, setInputValue] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Convert bits to display value
  const bitsToDisplay = useCallback((bits: Bits, displayBase: NumericBase): string => {
    switch (displayBase) {
      case 'decimal':
        return String(bitsToDecimal(bits, signed));
      case 'hex':
        return bitsToHex(bits);
      case 'binary':
        return bitsToBinary(bits);
    }
  }, [signed]);

  // Update input when external value changes
  useEffect(() => {
    setInputValue(bitsToDisplay(value, base));
    setError(null);
  }, [value, base, bitsToDisplay]);

  const handleInputChange = (newValue: string) => {
    setInputValue(newValue);
    setError(null);

    if (!newValue.trim()) {
      setError('Value cannot be empty');
      return;
    }

    try {
      let bits: Bits;

      switch (base) {
        case 'decimal': {
          const decimal = parseInt(newValue, 10);
          if (isNaN(decimal)) {
            setError('Invalid decimal number');
            return;
          }
          validateValue(decimal, width, signed);
          bits = decimalToBits(decimal, width, signed);
          break;
        }
        case 'hex': {
          const sanitized = sanitizeHexString(newValue);
          bits = hexToBits(sanitized, width);
          break;
        }
        case 'binary': {
          const sanitized = sanitizeBinaryString(newValue);
          bits = binaryToBits(sanitized, width);
          break;
        }
      }

      onChange(bits);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Invalid input');
      }
    }
  };

  const { min, max } = getValueRange(width, signed);

  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
        {label}
      </label>
      
      <div className="flex items-center space-x-2">
        <input
          type="text"
          id={id}
          value={inputValue}
          onChange={(e) => {
            handleInputChange(e.target.value);
          }}
          className={`block w-full rounded-md border ${
            error
              ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
              : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600'
          } bg-white px-3 py-2 font-mono text-sm shadow-sm focus:outline-none focus:ring-1 dark:bg-gray-700 dark:text-white`}
          placeholder={base === 'decimal' ? `${String(min)} to ${String(max)}` : ''}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? `${String(id)}-error` : `${String(id)}-help`}
        />

        {onBaseChange && (
          <select
            value={base}
            onChange={(e) => {
              onBaseChange(e.target.value as NumericBase);
            }}
            className="rounded-md border border-gray-300 bg-white px-2 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            aria-label={`Base for ${label}`}
          >
            <option value="decimal">Dec</option>
            <option value="hex">Hex</option>
            <option value="binary">Bin</option>
          </select>
        )}
      </div>

      {error ? (
        <p id={`${String(id)}-error`} className="mt-1 text-xs text-red-600 dark:text-red-400" role="alert">
          {error}
        </p>
      ) : (
        <p id={`${String(id)}-help`} className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          {base === 'decimal' ? `Range: ${String(min)} to ${String(max)}` : `${String(width)} bits`}
        </p>
      )}
    </div>
  );
}
