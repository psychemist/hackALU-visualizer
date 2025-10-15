import type { Bit, Bits } from './types'

/**
 * Validates that value is a valid bit (0 or 1).
 */
export function isBit(value: unknown): value is Bit {
  return value === 0 || value === 1
}

/**
 * Validates that array contains only valid bits.
 */
export function areBits(values: unknown[]): values is Bits {
  return values.every(isBit)
}

/**
 * Creates a bit array of specified width filled with zeros (LSB-first).
 */
export function createBits(width: number): Bits {
  if (width < 1 || width > 64) {
    throw new RangeError('Width must be between 1 and 64')
  }
  return Array.from({ length: width }, () => 0 as Bit)
}

/**
 * Converts a decimal number to bit array (LSB-first).
 * For signed numbers, uses two's complement representation.
 */
export function decimalToBits(value: number, width: number, signed: boolean): Bits {
  if (!Number.isInteger(value)) {
    throw new TypeError('Value must be an integer')
  }

  const bits = createBits(width)
  const maxUnsigned = 2 ** width - 1
  const minSigned = -(2 ** (width - 1))
  const maxSigned = 2 ** (width - 1) - 1

  if (signed) {
    if (value < minSigned || value > maxSigned) {
      throw new RangeError(
        `Signed ${String(width)}-bit value must be in range [${String(minSigned)}, ${String(maxSigned)}]`,
      )
    }
  } else {
    if (value < 0 || value > maxUnsigned) {
      throw new RangeError(
        `Unsigned ${String(width)}-bit value must be in range [0, ${String(maxUnsigned)}]`,
      )
    }
  }

  // Convert negative values using two's complement
  let num = signed && value < 0 ? 2 ** width + value : value

  for (let i = 0; i < width; i++) {
    bits[i] = (num & 1) as Bit
    num >>= 1
  }

  return bits
}

/**
 * Converts bit array (LSB-first) to decimal number.
 * Interprets as two's complement if signed flag is true.
 */
export function bitsToDecimal(bits: Bits, signed: boolean): number {
  const width = bits.length
  let value = 0

  for (let i = 0; i < width; i++) {
    if (bits[i] === 1) {
      value += 2 ** i
    }
  }

  // Handle two's complement for signed interpretation
  if (signed && bits[width - 1] === 1) {
    value -= 2 ** width
  }

  return value
}

/**
 * Converts bit array to hexadecimal string (MSB-first display).
 */
export function bitsToHex(bits: Bits): string {
  const width = bits.length
  const hexDigits = Math.ceil(width / 4)
  let value = 0

  for (let i = 0; i < width; i++) {
    if (bits[i] === 1) {
      value += 2 ** i
    }
  }

  return '0x' + value.toString(16).toUpperCase().padStart(hexDigits, '0')
}

/**
 * Converts bit array to binary string (MSB-first display).
 */
export function bitsToBinary(bits: Bits): string {
  return '0b' + [...bits].reverse().join('')
}

/**
 * Parses hexadecimal string to bit array (LSB-first).
 */
export function hexToBits(hex: string, width: number): Bits {
  const cleaned = hex.replace(/^0x/i, '')
  const value = parseInt(cleaned, 16)

  if (Number.isNaN(value)) {
    throw new TypeError('Invalid hexadecimal string')
  }

  return decimalToBits(value, width, false)
}

/**
 * Parses binary string to bit array (LSB-first).
 */
export function binaryToBits(binary: string, width: number): Bits {
  const cleaned = binary.replace(/^0b/i, '')

  // Validate binary string contains only 0s and 1s
  if (!/^[01]+$/.test(cleaned)) {
    throw new TypeError('Invalid binary string')
  }

  const value = parseInt(cleaned, 2)

  if (Number.isNaN(value)) {
    throw new TypeError('Invalid binary string')
  }

  return decimalToBits(value, width, false)
}

/**
 * Clones a bit array.
 */
export function cloneBits(bits: Bits): Bits {
  return [...bits] as Bits
}

/**
 * Pads or trims bit array to specified width (LSB-first).
 * Sign-extends if signed flag is true and MSB is 1.
 */
export function resizeBits(bits: Bits, newWidth: number, signed: boolean): Bits {
  const currentWidth = bits.length
  const result = createBits(newWidth)

  if (newWidth <= currentWidth) {
    // Truncate
    for (let i = 0; i < newWidth; i++) {
      result[i] = bits[i]
    }
  } else {
    // Extend
    const fillBit: Bit = signed && bits[currentWidth - 1] === 1 ? 1 : 0
    for (let i = 0; i < currentWidth; i++) {
      result[i] = bits[i]
    }
    for (let i = currentWidth; i < newWidth; i++) {
      result[i] = fillBit
    }
  }

  return result
}
