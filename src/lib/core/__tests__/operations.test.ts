import { describe, it, expect } from 'vitest'
import {
  addStepwise,
  addFull,
  subViaTwosComplement,
} from '../operations'
import { computeTwosComplement } from '../arithmetic'
import { decimalToBits, bitsToDecimal } from '../bits'

describe('ALU Operations', () => {
  describe('addStepwise', () => {
    it('adds two unsigned numbers with step trace', () => {
      const a = decimalToBits(5, 4, false) // 0b0101
      const b = decimalToBits(3, 4, false) // 0b0011
      const steps = addStepwise(a, b, false)

      expect(steps).toHaveLength(4)
      const lastStep = steps[3]
      expect(lastStep).toBeDefined()
      expect(bitsToDecimal(lastStep.partialResult, false)).toBe(8) // 5 + 3 = 8
    })

    it('detects carry flag on overflow', () => {
      const a = decimalToBits(15, 4, false) // 0b1111
      const b = decimalToBits(1, 4, false) // 0b0001
      const steps = addStepwise(a, b, false)

      const lastStep = steps[3]
      expect(lastStep).toBeDefined()
      expect(lastStep.flags.carry).toBe(true) // Overflow: 15 + 1 = 16 (carry out)
      expect(bitsToDecimal(lastStep.partialResult, false)).toBe(0) // Wraps to 0
    })

    it('detects zero flag', () => {
      const a = decimalToBits(0, 4, false)
      const b = decimalToBits(0, 4, false)
      const steps = addStepwise(a, b, false)

      const lastStep = steps[3]
      expect(lastStep).toBeDefined()
      expect(lastStep.flags.zero).toBe(true)
    })

    it('detects overflow in signed addition', () => {
      const a = decimalToBits(7, 4, true) // Max positive in 4-bit
      const b = decimalToBits(1, 4, true)
      const steps = addStepwise(a, b, true)

      const lastStep = steps[3]
      expect(lastStep).toBeDefined()
      expect(lastStep.flags.overflow).toBe(true) // 7 + 1 overflows to -8
    })

    it('sets sign flag for negative result', () => {
      const a = decimalToBits(-5, 4, true)
      const b = decimalToBits(-2, 4, true)
      const steps = addStepwise(a, b, true)

      const lastStep = steps[3]
      expect(lastStep).toBeDefined()
      expect(lastStep.flags.sign).toBe(true) // Result is negative
    })

    it('throws on mismatched widths', () => {
      const a = decimalToBits(5, 4, false)
      const b = decimalToBits(3, 8, false)
      expect(() => addStepwise(a, b, false)).toThrow(RangeError)
    })
  })

  describe('addFull', () => {
    it('adds unsigned numbers correctly', () => {
      const a = decimalToBits(5, 4, false)
      const b = decimalToBits(3, 4, false)
      const result = addFull(a, b, false)

      expect(bitsToDecimal(result.result, false)).toBe(8)
      expect(result.flags.zero).toBe(false)
      expect(result.flags.carry).toBe(false)
    })

    it('adds signed numbers correctly', () => {
      const a = decimalToBits(3, 4, true)
      const b = decimalToBits(-5, 4, true)
      const result = addFull(a, b, true)

      expect(bitsToDecimal(result.result, true)).toBe(-2)
    })

    it('includes step trace in result', () => {
      const a = decimalToBits(5, 4, false)
      const b = decimalToBits(3, 4, false)
      const result = addFull(a, b, false)

      expect(result.steps).toHaveLength(4)
    })
  })

  describe('subViaTwosComplement', () => {
    it('subtracts unsigned numbers', () => {
      const a = decimalToBits(8, 4, false)
      const b = decimalToBits(3, 4, false)
      const result = subViaTwosComplement(a, b, false)

      expect(bitsToDecimal(result.result, false)).toBe(5) // 8 - 3 = 5
    })

    it('subtracts signed numbers', () => {
      const a = decimalToBits(3, 4, true)
      const b = decimalToBits(-5, 4, true)
      const result = subViaTwosComplement(a, b, true)

      expect(bitsToDecimal(result.result, true)).toBe(-8) // 3 - (-5) = 8, but overflows to -8
    })

    it('handles subtraction resulting in negative', () => {
      const a = decimalToBits(3, 4, true)
      const b = decimalToBits(5, 4, true)
      const result = subViaTwosComplement(a, b, true)

      expect(bitsToDecimal(result.result, true)).toBe(-2) // 3 - 5 = -2
    })
  })

  // Property-based tests
  describe('Addition properties', () => {
    it('is commutative: a + b = b + a', () => {
      for (let a = 0; a <= 15; a++) {
        for (let b = 0; b <= 15; b++) {
          const bitsA = decimalToBits(a, 4, false)
          const bitsB = decimalToBits(b, 4, false)

          const resultAB = addFull(bitsA, bitsB, false)
          const resultBA = addFull(bitsB, bitsA, false)

          expect(resultAB.result).toEqual(resultBA.result)
        }
      }
    })

    it('satisfies a - b = a + (-b)', () => {
      for (let a = -8; a <= 7; a++) {
        for (let b = -8; b <= 7; b++) {
          const bitsA = decimalToBits(a, 4, true)
          const bitsB = decimalToBits(b, 4, true)

          const subResult = subViaTwosComplement(bitsA, bitsB, true)
          const negB = computeTwosComplement(bitsB).result
          const addResult = addFull(bitsA, negB, true)

          expect(subResult.result).toEqual(addResult.result)
        }
      }
    })
  })

  // Exhaustive tests for small widths
  describe('Exhaustive 1-bit tests', () => {
    it('covers all 1-bit additions', () => {
      const cases = [
        { a: 0, b: 0, expected: 0 },
        { a: 0, b: 1, expected: 1 },
        { a: 1, b: 0, expected: 1 },
        { a: 1, b: 1, expected: 0 }, // Overflow
      ]

      for (const { a, b, expected } of cases) {
        const bitsA = decimalToBits(a, 1, false)
        const bitsB = decimalToBits(b, 1, false)
        const result = addFull(bitsA, bitsB, false)
        expect(bitsToDecimal(result.result, false)).toBe(expected)
      }
    })
  })

  describe('Exhaustive 2-bit tests', () => {
    it('covers all 2-bit unsigned additions', () => {
      for (let a = 0; a <= 3; a++) {
        for (let b = 0; b <= 3; b++) {
          const bitsA = decimalToBits(a, 2, false)
          const bitsB = decimalToBits(b, 2, false)
          const result = addFull(bitsA, bitsB, false)
          const expected = (a + b) % 4 // Wrap around
          expect(bitsToDecimal(result.result, false)).toBe(expected)
        }
      }
    })

    it('covers all 2-bit signed additions', () => {
      for (let a = -2; a <= 1; a++) {
        for (let b = -2; b <= 1; b++) {
          const bitsA = decimalToBits(a, 2, true)
          const bitsB = decimalToBits(b, 2, true)
          const result = addFull(bitsA, bitsB, true)
          let expected = a + b

          // Handle overflow/wrap
          if (expected > 1) expected = expected - 4
          if (expected < -2) expected = expected + 4

          expect(bitsToDecimal(result.result, true)).toBe(expected)
        }
      }
    })
  })

  describe('Exhaustive 3-bit tests', () => {
    it('covers all 3-bit unsigned additions', () => {
      for (let a = 0; a <= 7; a++) {
        for (let b = 0; b <= 7; b++) {
          const bitsA = decimalToBits(a, 3, false)
          const bitsB = decimalToBits(b, 3, false)
          const result = addFull(bitsA, bitsB, false)
          const expected = (a + b) % 8
          expect(bitsToDecimal(result.result, false)).toBe(expected)
        }
      }
    })
  })
})
