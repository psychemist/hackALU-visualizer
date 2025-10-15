import { describe, it, expect } from 'vitest'
import {
  createBits,
  decimalToBits,
  bitsToDecimal,
  bitsToHex,
  bitsToBinary,
  hexToBits,
  binaryToBits,
  resizeBits,
} from '../bits'

describe('Bit utilities', () => {
  describe('createBits', () => {
    it('creates zero-filled bit array of specified width', () => {
      expect(createBits(4)).toEqual([0, 0, 0, 0])
      expect(createBits(8)).toEqual([0, 0, 0, 0, 0, 0, 0, 0])
    })

    it('throws for invalid widths', () => {
      expect(() => createBits(0)).toThrow(RangeError)
      expect(() => createBits(65)).toThrow(RangeError)
      expect(() => createBits(-1)).toThrow(RangeError)
    })
  })

  describe('decimalToBits and bitsToDecimal', () => {
    it('converts unsigned decimal to bits (LSB-first)', () => {
      expect(decimalToBits(0, 4, false)).toEqual([0, 0, 0, 0])
      expect(decimalToBits(5, 4, false)).toEqual([1, 0, 1, 0]) // 0b0101
      expect(decimalToBits(15, 4, false)).toEqual([1, 1, 1, 1]) // 0b1111
      expect(decimalToBits(10, 4, false)).toEqual([0, 1, 0, 1]) // 0b1010
    })

    it('converts signed decimal to bits using two\'s complement', () => {
      expect(decimalToBits(0, 4, true)).toEqual([0, 0, 0, 0])
      expect(decimalToBits(7, 4, true)).toEqual([1, 1, 1, 0]) // 0b0111
      expect(decimalToBits(-1, 4, true)).toEqual([1, 1, 1, 1]) // 0b1111
      expect(decimalToBits(-8, 4, true)).toEqual([0, 0, 0, 1]) // 0b1000
      expect(decimalToBits(-5, 4, true)).toEqual([1, 1, 0, 1]) // 0b1011
    })

    it('converts bits back to unsigned decimal', () => {
      expect(bitsToDecimal([1, 0, 1, 0], false)).toBe(5)
      expect(bitsToDecimal([1, 1, 1, 1], false)).toBe(15)
      expect(bitsToDecimal([0, 0, 0, 0], false)).toBe(0)
    })

    it('converts bits back to signed decimal', () => {
      expect(bitsToDecimal([1, 1, 1, 0], true)).toBe(7)
      expect(bitsToDecimal([1, 1, 1, 1], true)).toBe(-1)
      expect(bitsToDecimal([0, 0, 0, 1], true)).toBe(-8)
      expect(bitsToDecimal([1, 1, 0, 1], true)).toBe(-5)
    })

    it('roundtrips unsigned values', () => {
      for (let val = 0; val <= 15; val++) {
        const bits = decimalToBits(val, 4, false)
        expect(bitsToDecimal(bits, false)).toBe(val)
      }
    })

    it('roundtrips signed values', () => {
      for (let val = -8; val <= 7; val++) {
        const bits = decimalToBits(val, 4, true)
        expect(bitsToDecimal(bits, true)).toBe(val)
      }
    })

    it('throws on out-of-range unsigned values', () => {
      expect(() => decimalToBits(-1, 4, false)).toThrow(RangeError)
      expect(() => decimalToBits(16, 4, false)).toThrow(RangeError)
    })

    it('throws on out-of-range signed values', () => {
      expect(() => decimalToBits(-9, 4, true)).toThrow(RangeError)
      expect(() => decimalToBits(8, 4, true)).toThrow(RangeError)
    })

    it('throws on non-integer values', () => {
      expect(() => decimalToBits(3.14, 4, false)).toThrow(TypeError)
    })
  })

  describe('bitsToHex', () => {
    it('converts bits to hexadecimal string', () => {
      expect(bitsToHex([0, 0, 0, 0])).toBe('0x0')
      expect(bitsToHex([1, 0, 1, 0])).toBe('0x5')
      expect(bitsToHex([1, 1, 1, 1])).toBe('0xF')
      expect(bitsToHex([1, 1, 1, 1, 1, 1, 1, 1])).toBe('0xFF')
    })
  })

  describe('bitsToBinary', () => {
    it('converts bits to binary string (MSB-first)', () => {
      expect(bitsToBinary([0, 0, 0, 0])).toBe('0b0000')
      expect(bitsToBinary([1, 0, 1, 0])).toBe('0b0101')
      expect(bitsToBinary([1, 1, 1, 1])).toBe('0b1111')
    })
  })

  describe('hexToBits', () => {
    it('parses hexadecimal strings', () => {
      expect(hexToBits('0x0', 4)).toEqual([0, 0, 0, 0])
      expect(hexToBits('0x5', 4)).toEqual([1, 0, 1, 0])
      expect(hexToBits('0xF', 4)).toEqual([1, 1, 1, 1])
      expect(hexToBits('0xFF', 8)).toEqual([1, 1, 1, 1, 1, 1, 1, 1])
      expect(hexToBits('FF', 8)).toEqual([1, 1, 1, 1, 1, 1, 1, 1]) // Without 0x prefix
    })

    it('throws on invalid hex strings', () => {
      expect(() => hexToBits('0xZZZ', 4)).toThrow(TypeError)
    })
  })

  describe('binaryToBits', () => {
    it('parses binary strings', () => {
      expect(binaryToBits('0b0000', 4)).toEqual([0, 0, 0, 0])
      expect(binaryToBits('0b0101', 4)).toEqual([1, 0, 1, 0])
      expect(binaryToBits('0b1111', 4)).toEqual([1, 1, 1, 1])
      expect(binaryToBits('1010', 4)).toEqual([0, 1, 0, 1]) // Without 0b prefix
    })

    it('throws on invalid binary strings', () => {
      expect(() => binaryToBits('0b1012', 4)).toThrow(TypeError)
    })
  })

  describe('resizeBits', () => {
    it('truncates bits when shrinking', () => {
      expect(resizeBits([1, 0, 1, 0, 1, 1, 1, 1], 4, false)).toEqual([1, 0, 1, 0])
    })

    it('zero-extends unsigned values when growing', () => {
      expect(resizeBits([1, 0, 1, 0], 8, false)).toEqual([
        1, 0, 1, 0, 0, 0, 0, 0,
      ])
    })

    it('sign-extends signed positive values', () => {
      expect(resizeBits([1, 1, 1, 0], 8, true)).toEqual([
        // 0b0111 = 7, MSB=0
        1, 1, 1, 0, 0, 0, 0, 0,
      ])
    })

    it('sign-extends signed negative values', () => {
      expect(resizeBits([1, 1, 1, 1], 8, true)).toEqual([
        // 0b1111 = -1, MSB=1
        1, 1, 1, 1, 1, 1, 1, 1,
      ])
    })
  })
})
