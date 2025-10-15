/**
 * Hack ALU Implementation
 * 
 * Implements the 6-control-bit ALU from Nand2Tetris with step-by-step visualization.
 * Pipeline: preprocess x → preprocess y → compute (add/and) → postprocess output
 */

import type { Bit, Bits, ControlBits, HackALUResult, HackALUStepState, Flags } from './types';
import { createBits } from './bits';
import { invertBits, fullAdder } from './arithmetic';

/**
 * Mapping from operation names to control bit patterns
 */
export const OPERATION_TO_CONTROL_BITS: Record<string, ControlBits> = {
  '0':    { zx: 1, nx: 0, zy: 1, ny: 0, f: 1, no: 0 },
  '1':    { zx: 1, nx: 1, zy: 1, ny: 1, f: 1, no: 1 },
  '-1':   { zx: 1, nx: 1, zy: 1, ny: 0, f: 1, no: 0 },
  'x':    { zx: 0, nx: 0, zy: 1, ny: 1, f: 0, no: 0 },
  'y':    { zx: 1, nx: 1, zy: 0, ny: 0, f: 0, no: 0 },
  '!x':   { zx: 0, nx: 0, zy: 1, ny: 1, f: 0, no: 1 },
  '!y':   { zx: 1, nx: 1, zy: 0, ny: 0, f: 0, no: 1 },
  '-x':   { zx: 0, nx: 0, zy: 1, ny: 1, f: 1, no: 1 },
  '-y':   { zx: 1, nx: 1, zy: 0, ny: 0, f: 1, no: 1 },
  'x+1':  { zx: 0, nx: 1, zy: 1, ny: 1, f: 1, no: 1 },
  'y+1':  { zx: 1, nx: 1, zy: 0, ny: 1, f: 1, no: 1 },
  'x-1':  { zx: 0, nx: 0, zy: 1, ny: 1, f: 1, no: 0 },
  'y-1':  { zx: 1, nx: 1, zy: 0, ny: 0, f: 1, no: 0 },
  'x+y':  { zx: 0, nx: 0, zy: 0, ny: 0, f: 1, no: 0 },
  'x-y':  { zx: 0, nx: 1, zy: 0, ny: 0, f: 1, no: 1 },
  'y-x':  { zx: 0, nx: 0, zy: 0, ny: 1, f: 1, no: 1 },
  'x&y':  { zx: 0, nx: 0, zy: 0, ny: 0, f: 0, no: 0 },
  'x|y':  { zx: 0, nx: 1, zy: 0, ny: 1, f: 0, no: 1 },
};

/**
 * Process x input: apply zx (zero) and nx (negate)
 */
function preprocessX(x: Bits, zx: Bit, nx: Bit): { result: Bits; afterZX: Bits; afterNX: Bits } {
  const afterZX = zx === 1 ? createBits(x.length) : [...x];
  const afterNX = nx === 1 ? invertBits(afterZX) : afterZX;
  return { result: afterNX, afterZX, afterNX };
}

/**
 * Process y input: apply zy (zero) and ny (negate)
 */
function preprocessY(y: Bits, zy: Bit, ny: Bit): { result: Bits; afterZY: Bits; afterNY: Bits } {
  const afterZY = zy === 1 ? createBits(y.length) : [...y];
  const afterNY = ny === 1 ? invertBits(afterZY) : afterZY;
  return { result: afterNY, afterZY, afterNY };
}

/**
 * Compute function: add or bitwise AND
 */
function compute(xProcessed: Bits, yProcessed: Bits, f: Bit): Bits {
  if (f === 1) {
    // Addition via ripple carry
    const result: Bit[] = [];
    let carry: Bit = 0;
    
    for (let i = 0; i < xProcessed.length; i++) {
      const adderResult = fullAdder(xProcessed[i], yProcessed[i], carry);
      result.push(adderResult.sum);
      carry = adderResult.carry;
    }
    
    return result;
  } else {
    // Bitwise AND
    return xProcessed.map((xBit, i) => (xBit && yProcessed[i] ? 1 : 0) as Bit);
  }
}

/**
 * Postprocess output: apply no (negate)
 */
function postprocess(rawResult: Bits, no: Bit): Bits {
  return no === 1 ? invertBits(rawResult) : rawResult;
}

/**
 * Compute flags from final result
 */
function computeFlags(result: Bits, xProcessed: Bits, yProcessed: Bits, f: Bit): Flags {
  const zero = result.every((bit) => bit === 0);
  const sign = result[result.length - 1] === 1;
  
  // Overflow only meaningful for addition in signed arithmetic
  let overflow = false;
  if (f === 1) {
    const xSign = xProcessed[xProcessed.length - 1];
    const ySign = yProcessed[yProcessed.length - 1];
    const resultSign = result[result.length - 1];
    // Overflow if same-sign inputs produce opposite-sign result
    overflow = xSign === ySign && xSign !== resultSign;
  }
  
  // Carry from MSB (only for addition)
  let carry = false;
  if (f === 1) {
    let carryBit: Bit = 0;
    for (let i = 0; i < result.length; i++) {
      const adderResult = fullAdder(xProcessed[i], yProcessed[i], carryBit);
      carryBit = adderResult.carry;
    }
    carry = carryBit === 1;
  }
  
  return { zero, sign, overflow, carry };
}

/**
 * Main Hack ALU function with step-by-step trace
 */
export function hackALU(x: Bits, y: Bits, controlBits: ControlBits): HackALUResult {
  if (x.length !== y.length) {
    throw new Error('x and y must have the same width');
  }
  
  const steps: HackALUStepState[] = [];
  
  // Step 1: Preprocess x
  const { result: xProcessed, afterZX, afterNX } = preprocessX(x, controlBits.zx, controlBits.nx);
  steps.push({
    stage: 'preprocess-x',
    description: `Preprocess x: ${controlBits.zx ? 'zero' : 'keep'} x, then ${controlBits.nx ? 'negate' : 'keep'}`,
    xProcessed,
  });
  
  // Step 2: Preprocess y
  const { result: yProcessed, afterZY, afterNY } = preprocessY(y, controlBits.zy, controlBits.ny);
  steps.push({
    stage: 'preprocess-y',
    description: `Preprocess y: ${controlBits.zy ? 'zero' : 'keep'} y, then ${controlBits.ny ? 'negate' : 'keep'}`,
    yProcessed,
  });
  
  // Step 3: Compute
  const rawResult = compute(xProcessed, yProcessed, controlBits.f);
  steps.push({
    stage: 'compute',
    description: `Compute: ${controlBits.f ? 'add' : 'and'} processed inputs`,
    xProcessed,
    yProcessed,
    rawResult,
  });
  
  // Step 4: Postprocess
  const finalResult = postprocess(rawResult, controlBits.no);
  steps.push({
    stage: 'postprocess',
    description: `Postprocess: ${controlBits.no ? 'negate' : 'keep'} output`,
    rawResult,
    finalResult,
  });
  
  // Compute flags
  const flags = computeFlags(finalResult, xProcessed, yProcessed, controlBits.f);
  
  return {
    result: finalResult,
    flags,
    steps,
    xAfterZX: afterZX,
    xAfterNX: afterNX,
    yAfterZY: afterZY,
    yAfterNY: afterNY,
    rawOutput: rawResult,
  };
}

/**
 * Helper to compute a named operation
 */
export function hackALUByOperation(x: Bits, y: Bits, operation: string): HackALUResult {
  const controlBits = OPERATION_TO_CONTROL_BITS[operation] as ControlBits | undefined;
  if (controlBits === undefined) {
    throw new Error(`Unknown operation: ${operation}`);
  }
  return hackALU(x, y, controlBits);
}
