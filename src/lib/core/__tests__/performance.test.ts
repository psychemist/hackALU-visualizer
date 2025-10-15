import { describe, it, expect } from 'vitest'
import { addFull, subViaTwosComplement } from '../operations'
import { decimalToBits } from '../bits'

describe('Performance benchmarks', () => {
  it('64-bit addition completes in under 10ms', () => {
    const iterations = 1000
    const a = decimalToBits(123456789, 64, false)
    const b = decimalToBits(987654321, 64, false)

    const start = performance.now()
    for (let i = 0; i < iterations; i++) {
      addFull(a, b, false)
    }
    const end = performance.now()

    const avgTime = (end - start) / iterations
    expect(avgTime).toBeLessThan(10) // Target: < 10ms per operation
  })

  it('64-bit subtraction completes in under 10ms', () => {
    const iterations = 1000
    const a = decimalToBits(987654321, 64, false)
    const b = decimalToBits(123456789, 64, false)

    const start = performance.now()
    for (let i = 0; i < iterations; i++) {
      subViaTwosComplement(a, b, false)
    }
    const end = performance.now()

    const avgTime = (end - start) / iterations
    expect(avgTime).toBeLessThan(10)
  })
})
