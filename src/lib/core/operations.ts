import { createBits } from './bits'
import type { Bit, Bits, Flags, StepState, ALUResult } from './types'
import { fullAdder, computeTwosComplement } from './arithmetic'

/**
 * Computes flags based on result bits and operation metadata.
 */
export function computeFlags(
  result: Bits,
  signed: boolean,
  carry: Bit,
  overflow: boolean,
): Flags {
  const width = result.length
  const allZero = result.every((b) => b === 0)
  const signBit = result[width - 1]

  return {
    zero: allZero,
    sign: signed && signBit === 1,
    carry: carry === 1,
    overflow,
  }
}

/**
 * Performs ripple-carry addition of two bit arrays, generating step-by-step trace.
 * Returns array of StepState objects, one per bit position.
 */
export function addStepwise(a: Bits, b: Bits, _signed: boolean): StepState[] {
  const width = a.length

  if (b.length !== width) {
    throw new RangeError('Operands must have the same width')
  }

  const steps: StepState[] = []
  const result = createBits(width)
  let carry: Bit = 0

  for (let i = 0; i < width; i++) {
    const { sum, carry: carryOut } = fullAdder(a[i], b[i], carry)
    result[i] = sum

    steps.push({
      bitIndex: i,
      carryIn: carry,
      carryOut,
      aBit: a[i],
      bBit: b[i],
      sum,
      description: `Bit ${String(i)}: ${String(a[i])} + ${String(b[i])} + carry(${String(carry)}) = ${String(sum)}, carry-out: ${String(carryOut)}`,
    })

    carry = carryOut
  }

  return steps
}

/**
 * Performs full addition without step trace.
 * Returns final result and flags.
 */
export function addFull(a: Bits, b: Bits, signed: boolean): ALUResult {
  const steps = addStepwise(a, b, signed)
  const width = a.length
  
  // Build result from steps
  const result: Bits = steps.map(step => step.sum)
  
  // Compute final flags
  const lastStep = steps.at(-1)
  if (!lastStep) {
    throw new Error('No steps generated; invalid inputs')
  }
  
  // Overflow detection: sign bit mismatch when operands have same sign
  const aSign = a[width - 1]
  const bSign = b[width - 1]
  const resultSign = result[width - 1]
  const overflow = signed && aSign === bSign && aSign !== resultSign
  
  const flags = computeFlags(result, signed, lastStep.carryOut, overflow)

  return {
    result,
    flags,
    steps,
  }
}

/**
 * Performs subtraction via two's complement: a - b = a + (~b + 1).
 * Returns result, flags, and step trace including two's complement conversion.
 */
export function subViaTwosComplement(a: Bits, b: Bits, signed: boolean): ALUResult {
  const twosComp = computeTwosComplement(b)
  const addResult = addFull(a, twosComp.result, signed)

  return {
    result: addResult.result,
    flags: addResult.flags,
    steps: addResult.steps,
  }
}
