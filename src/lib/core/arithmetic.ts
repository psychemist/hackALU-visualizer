import type { Bit, Bits } from './types'
import { createBits } from './bits'

/**
 * Inverts all bits in the array (bitwise NOT).
 */
export function invertBits(bits: Bits): Bits {
  return bits.map((b) => (b === 0 ? 1 : 0) as Bit)
}

/**
 * Computes the two's complement of a bit array.
 * Two's complement = bitwise NOT + 1.
 * Returns the inverted value and the final result after adding 1.
 */
export function computeTwosComplement(bits: Bits): {
  inverted: Bits
  result: Bits
  steps: { index: number; carryIn: Bit; carryOut: Bit; sumBit: Bit }[]
} {
  const width = bits.length
  const inverted = invertBits(bits)
  const result = createBits(width)
  const steps: { index: number; carryIn: Bit; carryOut: Bit; sumBit: Bit }[] = []

  let carry: Bit = 1 // Start with carry = 1 for adding 1

  for (let i = 0; i < width; i++) {
    const sum: number = inverted[i] + carry
    const sumBit: Bit = (sum % 2) as Bit
    const carryOut: Bit = sum >= 2 ? 1 : 0

    result[i] = sumBit
    steps.push({
      index: i,
      carryIn: carry,
      carryOut,
      sumBit,
    })

    carry = carryOut
  }

  return { inverted, result, steps }
}

/**
 * Single full adder: computes sum and carry for one bit position.
 * sum = a XOR b XOR carryIn
 * carryOut = (a AND b) OR (b AND carryIn) OR (a AND carryIn)
 */
export function fullAdder(a: Bit, b: Bit, carryIn: Bit): { sum: Bit; carry: Bit } {
  const sum: Bit = ((a ^ b ^ carryIn) & 1) as Bit
  const carry: Bit = ((a & b) | (b & carryIn) | (a & carryIn)) as Bit
  return { sum, carry }
}
