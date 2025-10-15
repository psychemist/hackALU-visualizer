/**
 * URL State Persistence
 * Encodes/decodes ALU state to/from URL hash for shareability
 */

import { compress, decompress } from 'lz-string';
import type { Bits, ControlBits } from '@/lib/core';
import { isValidBits, isValidControlBits, isValidWidth } from './validation';

/**
 * Serializable state for URL encoding
 */
export interface SerializableState {
  x: Bits;
  y: Bits;
  width: number;
  controlBits: ControlBits;
  signed?: boolean;
  inputMode?: 'pin' | 'numeric';
  numericBase?: 'decimal' | 'hex' | 'binary';
}

/**
 * Encode state to URL-safe compressed string
 */
export function encodeStateToURL(state: SerializableState): string {
  try {
    const json = JSON.stringify(state);
    const compressed = compress(json);
    return compressed;
  } catch (error) {
    console.error('Failed to encode state:', error);
    return '';
  }
}

/**
 * Decode state from URL hash
 */
export function decodeStateFromURL(encoded: string): SerializableState | null {
  try {
    const decompressed = decompress(encoded);
    if (!decompressed) {
      return null;
    }

    const parsed = JSON.parse(decompressed) as unknown;

    // Validate structure
    if (typeof parsed !== 'object' || parsed === null) {
      return null;
    }

    const state = parsed as Record<string, unknown>;

    // Validate required fields
    if (
      !isValidBits(state.x) ||
      !isValidBits(state.y) ||
      !isValidWidth(state.width as number) ||
      !isValidControlBits(state.controlBits)
    ) {
      return null;
    }

    // Type guards already validated these are correct types
    const xBits: Bits = state.x;
    const yBits: Bits = state.y;
    const width: number = state.width as number;
    const controlBits: ControlBits = state.controlBits;

    // Validate width matches
    if (xBits.length !== width || yBits.length !== width) {
      return null;
    }

    return {
      x: xBits,
      y: yBits,
      width,
      controlBits,
      signed: state.signed as boolean | undefined,
      inputMode: state.inputMode as 'pin' | 'numeric' | undefined,
      numericBase: state.numericBase as 'decimal' | 'hex' | 'binary' | undefined,
    };
  } catch (error) {
    console.error('Failed to decode state:', error);
    return null;
  }
}

/**
 * Update URL hash with current state
 */
export function updateURLHash(state: SerializableState): void {
  const encoded = encodeStateToURL(state);
  if (encoded) {
    window.location.hash = encoded;
  }
}

/**
 * Read state from current URL hash
 */
export function readURLHash(): SerializableState | null {
  const hash = window.location.hash.slice(1); // Remove #
  if (!hash) {
    return null;
  }

  return decodeStateFromURL(hash);
}

/**
 * Clear URL hash
 */
export function clearURLHash(): void {
  window.history.replaceState(null, '', window.location.pathname + window.location.search);
}

/**
 * Generate shareable URL
 */
export function generateShareableURL(state: SerializableState): string {
  const encoded = encodeStateToURL(state);
  const baseURL = window.location.origin + window.location.pathname;
  return `${baseURL}#${encoded}`;
}

/**
 * Sanitize state before encoding
 * Removes undefined/null values and ensures valid structure
 */
export function sanitizeState(state: Partial<SerializableState>): SerializableState | null {
  if (!state.x || !state.y || !state.width || !state.controlBits) {
    return null;
  }

  return {
    x: state.x,
    y: state.y,
    width: state.width,
    controlBits: state.controlBits,
    signed: state.signed,
    inputMode: state.inputMode,
    numericBase: state.numericBase,
  };
}
