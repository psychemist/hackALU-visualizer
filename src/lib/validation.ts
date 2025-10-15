/**
 * Validation utilities for ALU inputs
 */

import type { Bits, ControlBits } from '@/lib/core';

export const MIN_BIT_WIDTH = 4;
export const MAX_BIT_WIDTH = 64;

/**
 * Validate bit width is within acceptable range
 */
export function isValidWidth(width: number): boolean {
  return Number.isInteger(width) && width >= MIN_BIT_WIDTH && width <= MAX_BIT_WIDTH;
}

/**
 * Validate width or throw error
 */
export function validateWidth(width: number): void {
  if (!isValidWidth(width)) {
    throw new RangeError(
      `Bit width must be an integer between ${String(MIN_BIT_WIDTH)} and ${String(MAX_BIT_WIDTH)}`
    );
  }
}

/**
 * Get min/max values for a given width
 */
export function getValueRange(width: number, signed: boolean): { min: number; max: number } {
  if (!isValidWidth(width)) {
    throw new RangeError('Invalid bit width');
  }

  if (signed) {
    return {
      min: -(2 ** (width - 1)),
      max: 2 ** (width - 1) - 1,
    };
  } else {
    return {
      min: 0,
      max: 2 ** width - 1,
    };
  }
}

/**
 * Validate a decimal value is in range for given width
 */
export function isValidValue(value: number, width: number, signed: boolean): boolean {
  if (!Number.isInteger(value)) {
    return false;
  }

  const { min, max } = getValueRange(width, signed);
  return value >= min && value <= max;
}

/**
 * Validate value or throw error
 */
export function validateValue(value: number, width: number, signed: boolean): void {
  if (!Number.isInteger(value)) {
    throw new TypeError('Value must be an integer');
  }

  const { min, max } = getValueRange(width, signed);
  if (value < min || value > max) {
    throw new RangeError(
      `${signed ? 'Signed' : 'Unsigned'} ${String(width)}-bit value must be in range [${String(min)}, ${String(max)}]`
    );
  }
}

/**
 * Validate control bits structure
 */
export function isValidControlBits(bits: unknown): bits is ControlBits {
  if (typeof bits !== 'object' || bits === null) {
    return false;
  }

  const cb = bits as Record<string, unknown>;
  const requiredKeys: (keyof ControlBits)[] = ['zx', 'nx', 'zy', 'ny', 'f', 'no'];

  return requiredKeys.every(
    (key) => cb[key] !== undefined && (cb[key] === 0 || cb[key] === 1)
  );
}

/**
 * Validate bits array
 */
export function isValidBits(bits: unknown, expectedWidth?: number): bits is Bits {
  if (!Array.isArray(bits)) {
    return false;
  }

  if (expectedWidth !== undefined && bits.length !== expectedWidth) {
    return false;
  }

  return bits.every((bit) => bit === 0 || bit === 1);
}

/**
 * Sanitize and validate hex string
 */
export function sanitizeHexString(hex: string): string {
  // Remove 0x prefix if present
  let cleaned = hex.trim().toLowerCase();
  if (cleaned.startsWith('0x')) {
    cleaned = cleaned.slice(2);
  }

  // Validate only hex characters
  if (!/^[0-9a-f]+$/.test(cleaned)) {
    throw new Error('Invalid hexadecimal string');
  }

  return cleaned;
}

/**
 * Sanitize and validate binary string
 */
export function sanitizeBinaryString(binary: string): string {
  const cleaned = binary.trim();

  // Validate only binary characters
  if (!/^[01]+$/.test(cleaned)) {
    throw new Error('Invalid binary string');
  }

  return cleaned;
}

/**
 * Validate operation name
 */
export function isValidOperation(op: string): boolean {
  const validOps = [
    '0', '1', '-1', 'x', 'y', '!x', '!y', '-x', '-y',
    'x+1', 'y+1', 'x-1', 'y-1', 'x+y', 'x-y', 'y-x', 'x&y', 'x|y'
  ];
  return validOps.includes(op);
}

/**
 * Get all valid operation names
 */
export function getValidOperations(): string[] {
  return [
    '0', '1', '-1', 'x', 'y', '!x', '!y', '-x', '-y',
    'x+1', 'y+1', 'x-1', 'y-1', 'x+y', 'x-y', 'y-x', 'x&y', 'x|y'
  ];
}
