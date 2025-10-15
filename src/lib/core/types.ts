/**
 * Core type definitions for the ALU Visualizer simulation.
 * Uses LSB-first bit array representation for natural carry propagation.
 * 
 * Implements the Hack ALU architecture with 6 control bits:
 * - zx: zero the x input
 * - nx: negate the x input (bitwise NOT)
 * - zy: zero the y input
 * - ny: negate the y input (bitwise NOT)
 * - f: function selector (1=add, 0=and)
 * - no: negate the output (bitwise NOT)
 */

export type Bit = 0 | 1;
export type Bits = Bit[];

export interface Flags {
  zero: boolean; // output is zero
  sign: boolean; // output is negative (MSB = 1)
  overflow: boolean; // signed overflow occurred
  carry: boolean; // carry out from MSB
}

/**
 * Control bits for Hack ALU operations
 */
export interface ControlBits {
  zx: Bit; // if 1, zero x
  nx: Bit; // if 1, negate x (bitwise NOT)
  zy: Bit; // if 1, zero y
  ny: Bit; // if 1, negate y (bitwise NOT)
  f: Bit;  // if 1, add; if 0, and
  no: Bit; // if 1, negate output
}

/**
 * Step state for visualizing ALU pipeline stages
 */
export interface HackALUStepState {
  stage: 'preprocess-x' | 'preprocess-y' | 'compute' | 'postprocess';
  description: string;
  xProcessed?: Bits; // x after zx, nx
  yProcessed?: Bits; // y after zy, ny
  rawResult?: Bits;  // result before no
  finalResult?: Bits; // result after no
  // For bit-level steps during add/and
  bitIndex?: number;
  carryIn?: Bit;
  carryOut?: Bit;
}

/**
 * Traditional step state for ripple-carry addition
 */
export interface StepState {
  bitIndex: number;
  aBit: Bit;
  bBit: Bit;
  carryIn: Bit;
  sum: Bit;
  carryOut: Bit;
  description: string;
}

export interface ALUResult {
  result: Bits;
  flags: Flags;
  steps: StepState[];
}

/**
 * Hack ALU result with pipeline visualization
 */
export interface HackALUResult {
  result: Bits;
  flags: Flags;
  steps: HackALUStepState[];
  // Intermediate values for debugging
  xAfterZX: Bits;
  xAfterNX: Bits;
  yAfterZY: Bits;
  yAfterNY: Bits;
  rawOutput: Bits;
}

export interface ALUInput {
  x: Bits;
  y: Bits;
  width: number;
  controlBits: ControlBits;
}

/**
 * Predefined operations map to control bit patterns
 * Based on Hack ALU truth table
 */
export type ALUOperation = 
  | '0'       // zx=1, nx=0, zy=1, ny=0, f=1, no=0
  | '1'       // zx=1, nx=1, zy=1, ny=1, f=1, no=1
  | '-1'      // zx=1, nx=1, zy=1, ny=0, f=1, no=0
  | 'x'       // zx=0, nx=0, zy=1, ny=1, f=0, no=0
  | 'y'       // zx=1, nx=1, zy=0, ny=0, f=0, no=0
  | '!x'      // zx=0, nx=0, zy=1, ny=1, f=0, no=1
  | '!y'      // zx=1, nx=1, zy=0, ny=0, f=0, no=1
  | '-x'      // zx=0, nx=0, zy=1, ny=1, f=1, no=1
  | '-y'      // zx=1, nx=1, zy=0, ny=0, f=1, no=1
  | 'x+1'     // zx=0, nx=1, zy=1, ny=1, f=1, no=1
  | 'y+1'     // zx=1, nx=1, zy=0, ny=1, f=1, no=1
  | 'x-1'     // zx=0, nx=0, zy=1, ny=1, f=1, no=0
  | 'y-1'     // zx=1, nx=1, zy=0, ny=0, f=1, no=0
  | 'x+y'     // zx=0, nx=0, zy=0, ny=0, f=1, no=0
  | 'x-y'     // zx=0, nx=1, zy=0, ny=0, f=1, no=1
  | 'y-x'     // zx=0, nx=0, zy=0, ny=1, f=1, no=1
  | 'x&y'     // zx=0, nx=0, zy=0, ny=0, f=0, no=0
  | 'x|y';    // zx=0, nx=1, zy=0, ny=1, f=0, no=1
