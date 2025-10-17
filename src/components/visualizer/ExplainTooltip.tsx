/**
 * ExplainTooltip Component
 * 
 * Educational tooltip showing formulas and explanations for each bit operation.
 */

import { type Bit } from '@/lib/core';

export interface ExplainTooltipProps {
  /** Bit index */
  index: number;
  /** X input bit */
  xBit: Bit;
  /** Y input bit */
  yBit: Bit;
  /** Carry in bit */
  carryIn: Bit;
  /** Sum/result bit */
  sum: Bit;
  /** Carry out bit */
  carryOut: Bit;
  /** Position of the tooltip */
  x: number;
  y: number;
  /** Whether to show the tooltip */
  visible: boolean;
}

export function ExplainTooltip({
  index,
  xBit,
  yBit,
  carryIn,
  sum,
  carryOut,
  x,
  y,
  visible,
}: ExplainTooltipProps) {
  if (!visible) return null;

  // Calculate formulas
  const sumFormula = `sum[${String(index)}] = x[${String(index)}] ⊕ y[${String(index)}] ⊕ c_in`;
  const sumCalculation = `${String(xBit)} ⊕ ${String(yBit)} ⊕ ${String(carryIn)} = ${String(sum)}`;
  
  const carryFormula = `c_out = (x[${String(index)}] ∧ y[${String(index)}]) ∨ (c_in ∧ (x[${String(index)}] ⊕ y[${String(index)}]))`;
  const propagate = xBit ^ yBit ? 1 : 0;
  const generate = xBit & yBit ? 1 : 0;
  const carryCalculation = `(${String(xBit)} ∧ ${String(yBit)}) ∨ (${String(carryIn)} ∧ ${String(propagate)}) = ${String(generate)} ∨ ${String(carryIn & propagate)} = ${String(carryOut)}`;

  return (
    <g className="explain-tooltip" style={{ pointerEvents: 'none' }}>
      {/* Background */}
      <rect
        x={x}
        y={y}
        width={280}
        height={120}
        fill="rgb(255, 255, 255)"
        stroke="rgb(59, 130, 246)"
        strokeWidth={2}
        rx={8}
        className="drop-shadow-lg dark:fill-gray-800"
      />

      {/* Title */}
      <text
        x={x + 10}
        y={y + 20}
        className="fill-gray-900 text-xs font-bold dark:fill-white"
      >
        Bit {index} - Full Adder
      </text>

      {/* Sum formula */}
      <text
        x={x + 10}
        y={y + 40}
        className="fill-gray-700 font-mono text-xs dark:fill-gray-300"
      >
        {sumFormula}
      </text>
      <text
        x={x + 10}
        y={y + 55}
        className="fill-blue-600 font-mono text-xs dark:fill-blue-400"
      >
        {sumCalculation}
      </text>

      {/* Carry formula */}
      <text
        x={x + 10}
        y={y + 75}
        className="fill-gray-700 font-mono text-xs dark:fill-gray-300"
      >
        {carryFormula.substring(0, 35)}
      </text>
      <text
        x={x + 10}
        y={y + 90}
        className="fill-gray-700 font-mono text-xs dark:fill-gray-300"
      >
        {carryFormula.substring(35)}
      </text>
      <text
        x={x + 10}
        y={y + 105}
        className="fill-red-600 font-mono text-xs dark:fill-red-400"
      >
        {carryCalculation}
      </text>

      {/* Pointer arrow */}
      <path
        d={`M ${x - 5} ${y + 60} L ${x} ${y + 60} L ${x} ${y + 55} L ${x} ${y + 65} Z`}
        fill="rgb(59, 130, 246)"
      />
    </g>
  );
}
