/**
 * BitLane Component
 * 
 * Visualizes a single bit position in the ALU pipeline.
 * Shows x, y, carry in, sum, and carry out with highlighting for the current step.
 */

import { useState } from 'react';
import { type Bit } from '@/lib/core';
import { ExplainTooltip } from './ExplainTooltip';

export interface BitLaneProps {
  /** Bit index (0 = LSB) */
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
  /** Whether this lane is currently highlighted */
  isActive: boolean;
  /** Width of the lane in pixels */
  width?: number;
  /** Whether to show labels */
  showLabels?: boolean;
}

const BIT_CIRCLE_RADIUS = 16;
const LANE_HEIGHT = 300;
const VERTICAL_SPACING = 60;

export function BitLane({
  index,
  xBit,
  yBit,
  carryIn,
  sum,
  carryOut,
  isActive,
  width = 80,
  showLabels = true,
}: BitLaneProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  const centerX = width / 2;

  // Vertical positions
  const xPos = 30;
  const yPos = xPos + VERTICAL_SPACING;
  const carryInPos = yPos + VERTICAL_SPACING;
  const sumPos = carryInPos + VERTICAL_SPACING;
  const carryOutPos = sumPos + VERTICAL_SPACING;

  return (
    <g 
      className={`bit-lane ${isActive ? 'active' : ''}`}
      onMouseEnter={() => { setShowTooltip(true); }}
      onMouseLeave={() => { setShowTooltip(false); }}
    >
      {/* Background highlight for active lane */}
      {isActive && (
        <rect
          x={0}
          y={0}
          width={width}
          height={LANE_HEIGHT}
          fill="rgb(59, 130, 246)"
          fillOpacity={0.1}
          stroke="rgb(59, 130, 246)"
          strokeWidth={2}
          strokeDasharray="4 4"
          rx={4}
        />
      )}

      {/* Bit index label */}
      {showLabels && (
        <text
          x={centerX}
          y={15}
          textAnchor="middle"
          className="fill-gray-600 font-mono text-xs font-semibold dark:fill-gray-400"
        >
          [{index}]
        </text>
      )}

      {/* X input bit */}
      <BitCircle
        cx={centerX}
        cy={xPos}
        value={xBit}
        label="x"
        isActive={isActive}
      />

      {/* Y input bit */}
      <BitCircle
        cx={centerX}
        cy={yPos}
        value={yBit}
        label="y"
        isActive={isActive}
      />

      {/* Carry in */}
      <BitCircle
        cx={centerX}
        cy={carryInPos}
        value={carryIn}
        label="c_in"
        isActive={isActive}
        isCarry
      />

      {/* Connection lines */}
      <line
        x1={centerX}
        y1={xPos + BIT_CIRCLE_RADIUS}
        x2={centerX}
        y2={sumPos - BIT_CIRCLE_RADIUS}
        stroke={isActive ? 'rgb(59, 130, 246)' : 'rgb(209, 213, 219)'}
        strokeWidth={isActive ? 2 : 1}
        strokeDasharray="2 2"
        className="dark:stroke-gray-600"
      />

      {/* Sum/Result bit */}
      <BitCircle
        cx={centerX}
        cy={sumPos}
        value={sum}
        label="sum"
        isActive={isActive}
        isResult
      />

      {/* Carry out */}
      <BitCircle
        cx={centerX}
        cy={carryOutPos}
        value={carryOut}
        label="c_out"
        isActive={isActive}
        isCarry
      />

      {/* Carry propagation line */}
      {carryOut === 1 && (
        <line
          x1={centerX}
          y1={sumPos + BIT_CIRCLE_RADIUS}
          x2={centerX}
          y2={carryOutPos - BIT_CIRCLE_RADIUS}
          stroke="rgb(239, 68, 68)"
          strokeWidth={2}
          markerEnd="url(#arrowhead)"
        />
      )}

      {/* Explain mode tooltip */}
      {showTooltip && (
        <ExplainTooltip
          index={index}
          xBit={xBit}
          yBit={yBit}
          carryIn={carryIn}
          sum={sum}
          carryOut={carryOut}
          x={width + 10}
          y={50}
          visible={showTooltip}
        />
      )}
    </g>
  );
}

interface BitCircleProps {
  cx: number;
  cy: number;
  value: Bit;
  label: string;
  isActive: boolean;
  isCarry?: boolean;
  isResult?: boolean;
}

function BitCircle({
  cx,
  cy,
  value,
  label,
  isActive,
  isCarry = false,
  isResult = false,
}: BitCircleProps) {
  const baseColor = value === 1 ? 'rgb(34, 197, 94)' : 'rgb(156, 163, 175)';
  const activeColor = value === 1 ? 'rgb(22, 163, 74)' : 'rgb(107, 114, 128)';
  const carryColor = 'rgb(239, 68, 68)';
  const resultColor = 'rgb(59, 130, 246)';

  let fillColor = isActive ? activeColor : baseColor;
  if (isCarry && value === 1) fillColor = carryColor;
  if (isResult && value === 1) fillColor = resultColor;

  return (
    <g className="bit-circle">
      {/* Outer glow for active bits */}
      {isActive && value === 1 && (
        <circle
          cx={cx}
          cy={cy}
          r={BIT_CIRCLE_RADIUS + 4}
          fill={fillColor}
          fillOpacity={0.3}
        />
      )}

      {/* Main circle */}
      <circle
        cx={cx}
        cy={cy}
        r={BIT_CIRCLE_RADIUS}
        fill={fillColor}
        stroke={isActive ? 'rgb(59, 130, 246)' : 'rgb(209, 213, 219)'}
        strokeWidth={isActive ? 2 : 1}
        className="transition-all duration-200"
      />

      {/* Bit value */}
      <text
        x={cx}
        y={cy + 1}
        textAnchor="middle"
        dominantBaseline="middle"
        className="select-none fill-white font-mono text-sm font-bold"
      >
        {value}
      </text>

      {/* Label */}
      <text
        x={cx}
        y={cy + BIT_CIRCLE_RADIUS + 12}
        textAnchor="middle"
        className="fill-gray-500 font-mono text-xs dark:fill-gray-400"
      >
        {label}
      </text>
    </g>
  );
}
