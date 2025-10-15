import { bench } from 'vitest'
import { addFull, subViaTwosComplement } from '../operations'
import { decimalToBits } from '../bits'

// Run with: npm run test:bench or vitest bench

bench('64-bit addition', () => {
  const a = decimalToBits(123456789, 64, false)
  const b = decimalToBits(987654321, 64, false)
  addFull(a, b, false)
})

bench('64-bit subtraction', () => {
  const a = decimalToBits(987654321, 64, false)
  const b = decimalToBits(123456789, 64, false)
  subViaTwosComplement(a, b, false)
})

bench('32-bit addition', () => {
  const a = decimalToBits(123456, 32, false)
  const b = decimalToBits(654321, 32, false)
  addFull(a, b, false)
})

bench('16-bit addition', () => {
  const a = decimalToBits(1234, 16, false)
  const b = decimalToBits(4321, 16, false)
  addFull(a, b, false)
})

bench('8-bit addition', () => {
  const a = decimalToBits(123, 8, false)
  const b = decimalToBits(231, 8, false)
  addFull(a, b, false)
})

bench('4-bit addition', () => {
  const a = decimalToBits(5, 4, false)
  const b = decimalToBits(10, 4, false)
  addFull(a, b, false)
})
