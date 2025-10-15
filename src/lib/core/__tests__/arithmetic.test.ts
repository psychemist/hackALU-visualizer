import { describe, it, expect } from 'vitest'
import {
  invertBits,
  computeTwosComplement,
  fullAdder,
} from '../arithmetic'
import { decimalToBits, bitsToDecimal } from '../bits'

describe('Arithmetic operations', () => {
  describe('invertBits', () => {
    it('inverts all bits (bitwise NOT)', () => {
      expect(invertBits([0, 0, 0, 0])).toEqual([1, 1, 1, 1])
      expect(invertBits([1, 1, 1, 1])).toEqual([0, 0, 0, 0])
      expect(invertBits([1, 0, 1, 0])).toEqual([0, 1, 0, 1])
    })
  })

  describe('computeTwosComplement', () => {
    it('computes two\'s complement correctly', () => {
      // 5 (0b0101) -> -5 (0b1011)
      const bits5 = decimalToBits(5, 4, false)
      const result = computeTwosComplement(bits5)

      expect(result.inverted).toEqual([0, 1, 0, 1]) // ~0b0101 = 0b1010
      expect(result.result).toEqual([1, 1, 0, 1]) // 0b1010 + 1 = 0b1011
      expect(bitsToDecimal(result.result, true)).toBe(-5)
    })

    it('handles zero correctly', () => {
      const bits0 = decimalToBits(0, 4, false)
      const result = computeTwosComplement(bits0)

      expect(result.inverted).toEqual([1, 1, 1, 1])
      expect(result.result).toEqual([0, 0, 0, 0]) // ~0 + 1 = 0 (with overflow)
    })

    it('handles maximum negative value', () => {
      // -8 in 4-bit two's complement is 0b1000
      const bits8 = decimalToBits(8, 4, false) // 0b1000
      const result = computeTwosComplement(bits8)

      expect(result.result).toEqual([0, 0, 0, 1]) // 0b1000 (stays -8)
      expect(bitsToDecimal(result.result, true)).toBe(-8)
    })

    it('generates correct step trace', () => {
      const bits = decimalToBits(5, 4, false) // 0b0101
      const result = computeTwosComplement(bits)

      expect(result.steps).toHaveLength(4)
      expect(result.steps[0]).toMatchObject({
        index: 0,
        carryIn: 1,
        sumBit: 1,
      })
    })

    it('handles identity: ~~x = x for two\'s complement', () => {
      for (let val = -8; val <= 7; val++) {
        const bits = decimalToBits(val, 4, true)
        const neg = computeTwosComplement(bits).result
        const pos = computeTwosComplement(neg).result
        expect(bitsToDecimal(pos, true)).toBe(val)
      }
    })
  })

  describe('fullAdder', () => {
    it('computes sum and carry for all input combinations', () => {
      expect(fullAdder(0, 0, 0)).toEqual({ sum: 0, carry: 0 })
      expect(fullAdder(0, 0, 1)).toEqual({ sum: 1, carry: 0 })
      expect(fullAdder(0, 1, 0)).toEqual({ sum: 1, carry: 0 })
      expect(fullAdder(0, 1, 1)).toEqual({ sum: 0, carry: 1 })
      expect(fullAdder(1, 0, 0)).toEqual({ sum: 1, carry: 0 })
      expect(fullAdder(1, 0, 1)).toEqual({ sum: 0, carry: 1 })
      expect(fullAdder(1, 1, 0)).toEqual({ sum: 0, carry: 1 })
      expect(fullAdder(1, 1, 1)).toEqual({ sum: 1, carry: 1 })
    })
  })
})
