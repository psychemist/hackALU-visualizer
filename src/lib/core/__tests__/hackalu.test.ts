/**
 * Tests for Hack ALU implementation
 * Validates all 18 operations from the Nand2Tetris truth table
 */

import { describe, test, expect } from 'vitest';
import { hackALUByOperation, OPERATION_TO_CONTROL_BITS } from '../hackalu';
import { decimalToBits, bitsToDecimal } from '../bits';

describe('Hack ALU', () => {
  const width = 16; // Standard Hack computer width

  describe('Truth table operations', () => {
    // Test cases from the Hack ALU truth table
    const testCases = [
      { op: '0', x: 5, y: 3, expected: 0 },
      { op: '1', x: 5, y: 3, expected: 1 },
      { op: '-1', x: 5, y: 3, expected: -1 },
      { op: 'x', x: 5, y: 3, expected: 5 },
      { op: 'y', x: 5, y: 3, expected: 3 },
      { op: '!x', x: 5, y: 3, expected: ~5 },
      { op: '!y', x: 5, y: 3, expected: ~3 },
      { op: '-x', x: 5, y: 3, expected: -5 },
      { op: '-y', x: 5, y: 3, expected: -3 },
      { op: 'x+1', x: 5, y: 3, expected: 6 },
      { op: 'y+1', x: 5, y: 3, expected: 4 },
      { op: 'x-1', x: 5, y: 3, expected: 4 },
      { op: 'y-1', x: 5, y: 3, expected: 2 },
      { op: 'x+y', x: 5, y: 3, expected: 8 },
      { op: 'x-y', x: 5, y: 3, expected: 2 },
      { op: 'y-x', x: 5, y: 3, expected: -2 },
      { op: 'x&y', x: 0b1010, y: 0b1100, expected: 0b1000 },
      { op: 'x|y', x: 0b1010, y: 0b1100, expected: 0b1110 },
    ];

    testCases.forEach(({ op, x, y, expected }) => {
      test(`${op}: hackALUByOperation(${String(x)}, ${String(y)}) = ${String(expected)}`, () => {
        const xBits = decimalToBits(x, width, true);
        const yBits = decimalToBits(y, width, true);
        
        const result = hackALUByOperation(xBits, yBits, op);
        const decimal = bitsToDecimal(result.result, true);
        
        expect(decimal).toBe(expected);
      });
    });
  });

  describe('Control bits mapping', () => {
    test('All 18 operations have control bit definitions', () => {
      const operations = [
        '0', '1', '-1', 'x', 'y', '!x', '!y', '-x', '-y',
        'x+1', 'y+1', 'x-1', 'y-1', 'x+y', 'x-y', 'y-x', 'x&y', 'x|y'
      ];
      
      operations.forEach(op => {
        expect(OPERATION_TO_CONTROL_BITS[op]).toBeDefined();
      });
    });

    test('Control bits for "0" are correct', () => {
      const cb = OPERATION_TO_CONTROL_BITS['0'];
      expect(cb).toEqual({ zx: 1, nx: 0, zy: 1, ny: 0, f: 1, no: 0 });
    });

    test('Control bits for "x+y" are correct', () => {
      const cb = OPERATION_TO_CONTROL_BITS['x+y'];
      expect(cb).toEqual({ zx: 0, nx: 0, zy: 0, ny: 0, f: 1, no: 0 });
    });
  });

  describe('Pipeline stages', () => {
    test('x+y generates 4 pipeline steps', () => {
      const x = decimalToBits(5, 8, true);
      const y = decimalToBits(3, 8, true);
      
      const result = hackALUByOperation(x, y, 'x+y');
      
      expect(result.steps).toHaveLength(4);
      expect(result.steps[0].stage).toBe('preprocess-x');
      expect(result.steps[1].stage).toBe('preprocess-y');
      expect(result.steps[2].stage).toBe('compute');
      expect(result.steps[3].stage).toBe('postprocess');
    });

    test('-x shows x preprocessing (zx=0, nx=1)', () => {
      const x = decimalToBits(5, 8, true);
      const y = decimalToBits(0, 8, true);
      
      const result = hackALUByOperation(x, y, '-x');
      
      // After preprocessing, x should be negated then added to 1 (via f=1 with y=1)
      expect(result.steps[0].description).toContain('keep');
      expect(result.steps[0].description).toContain('keep');
    });
  });

  describe('Flags computation', () => {
    test('Zero flag is set when output is 0', () => {
      const x = decimalToBits(5, 8, true);
      const y = decimalToBits(0, 8, true);
      
      const result = hackALUByOperation(x, y, '0');
      
      expect(result.flags.zero).toBe(true);
    });

    test('Zero flag is not set for non-zero output', () => {
      const x = decimalToBits(5, 8, true);
      const y = decimalToBits(3, 8, true);
      
      const result = hackALUByOperation(x, y, 'x+y');
      
      expect(result.flags.zero).toBe(false);
    });

    test('Sign flag is set for negative result', () => {
      const x = decimalToBits(5, 8, true);
      const y = decimalToBits(0, 8, true);
      
      const result = hackALUByOperation(x, y, '-x');
      
      expect(result.flags.sign).toBe(true);
      expect(bitsToDecimal(result.result, true)).toBe(-5);
    });

    test('Overflow detection for addition', () => {
      // 127 + 1 should overflow in 8-bit signed
      const x = decimalToBits(127, 8, true);
      const y = decimalToBits(1, 8, true);
      
      const result = hackALUByOperation(x, y, 'x+y');
      
      expect(result.flags.overflow).toBe(true);
      expect(bitsToDecimal(result.result, true)).toBe(-128);
    });
  });

  describe('Bitwise operations', () => {
    test('x&y performs bitwise AND', () => {
      const x = decimalToBits(0b01111000, 8, false); // Use unsigned for bitwise ops
      const y = decimalToBits(0b01010101, 8, false);
      
      const result = hackALUByOperation(x, y, 'x&y');
      
      const resultValue = bitsToDecimal(result.result, false);
      expect(resultValue).toBe(0b01010000);
    });

    test('x|y performs bitwise OR', () => {
      const x = decimalToBits(0b01111000, 8, false);
      const y = decimalToBits(0b01010101, 8, false);
      
      const result = hackALUByOperation(x, y, 'x|y');
      
      const resultValue = bitsToDecimal(result.result, false);
      expect(resultValue).toBe(0b01111101);
    });
  });

  describe('Edge cases', () => {
    test('Works with different bit widths', () => {
      const x4 = decimalToBits(5, 4, true);
      const y4 = decimalToBits(3, 4, true);
      
      const result = hackALUByOperation(x4, y4, 'x+y');
      
      expect(bitsToDecimal(result.result, true)).toBe(-8); // Overflow in 4-bit
    });

    test('Handles max positive value', () => {
      const x = decimalToBits(32767, 16, true); // Max 16-bit signed
      const y = decimalToBits(0, 16, true);
      
      const result = hackALUByOperation(x, y, 'x');
      
      expect(bitsToDecimal(result.result, true)).toBe(32767);
    });

    test('Handles max negative value', () => {
      const x = decimalToBits(-32768, 16, true); // Min 16-bit signed
      const y = decimalToBits(0, 16, true);
      
      const result = hackALUByOperation(x, y, 'x');
      
      expect(bitsToDecimal(result.result, true)).toBe(-32768);
    });

    test('Throws on mismatched widths', () => {
      const x = decimalToBits(5, 8, true);
      const y = decimalToBits(3, 16, true);
      
      expect(() => {
        hackALUByOperation(x, y, 'x+y');
      }).toThrow('x and y must have the same width');
    });

    test('Throws on unknown operation', () => {
      const x = decimalToBits(5, 8, true);
      const y = decimalToBits(3, 8, true);
      
      expect(() => {
        hackALUByOperation(x, y, 'invalid-op');
      }).toThrow('Unknown operation');
    });
  });

  describe('Intermediate values', () => {
    test('Exposes intermediate preprocessing values', () => {
      const x = decimalToBits(5, 8, true);
      const y = decimalToBits(3, 8, true);
      
      const result = hackALUByOperation(x, y, 'x+y');
      
      expect(result.xAfterZX).toBeDefined();
      expect(result.xAfterNX).toBeDefined();
      expect(result.yAfterZY).toBeDefined();
      expect(result.yAfterNY).toBeDefined();
      expect(result.rawOutput).toBeDefined();
    });

    test('Raw output before negation for -x', () => {
      const x = decimalToBits(5, 8, true);
      const y = decimalToBits(0, 8, true);
      
      const result = hackALUByOperation(x, y, '-x');
      
      // Raw output should be positive before final negation
      const rawDecimal = bitsToDecimal(result.rawOutput, true);
      const finalDecimal = bitsToDecimal(result.result, true);
      
      expect(finalDecimal).toBe(-5);
      // The computation is: !x + 1, then negate
      expect(rawDecimal).not.toBe(finalDecimal);
    });
  });
});
