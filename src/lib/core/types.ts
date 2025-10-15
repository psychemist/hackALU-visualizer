/**
 * Core type definitions for ALU simulation.
 * All bit arrays use LSB-first ordering (index 0 = least significant bit).
 */

export type Bit = 0 | 1

export type Bits = Bit[]

export interface Flags {
  zero: boolean
  sign: boolean
  overflow: boolean
  carry: boolean
}

export interface StepState {
  /** Current bit index being processed (0-based, LSB-first) */
  index: number
  /** Carry input to this bit position */
  carryIn: Bit
  /** Carry output from this bit position */
  carryOut: Bit
  /** Bit value from operand A at this position */
  aBit: Bit
  /** Bit value from operand B at this position */
  bBit: Bit
  /** Sum bit computed at this position */
  sumBit: Bit
  /** Partial result accumulated up to and including this index (LSB-first) */
  partialResult: Bits
  /** Flags state after processing this bit */
  flags: Flags
}

export interface ALUResult {
  /** Final result bits (LSB-first) */
  result: Bits
  /** Final flags state */
  flags: Flags
  /** Step-by-step trace of the computation */
  steps: StepState[]
}

export type ALUOperation =
  | 'add'
  | 'sub'
  | 'and'
  | 'or'
  | 'xor'
  | 'not'
  | 'inc'
  | 'dec'
  | 'shl'
  | 'shr'

export interface ALUInput {
  x: Bits
  y: Bits
  width: number
  signed: boolean
  op: ALUOperation
}
