/**
 * ALUVisualizer Component
 * 
 * Main visualization component showing the complete ALU pipeline.
 * Displays all bit lanes side-by-side with animation support.
 */

import { useALUStore } from '@/store/aluStore';
import { BitLane } from './BitLane';
import { type StepState } from '@/lib/core';

export function ALUVisualizer() {
  const result = useALUStore((state) => state.result);
  const currentStep = useALUStore((state) => state.animation.currentStep);
  const width = useALUStore((state) => state.width);

  if (!result) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-gray-500 dark:text-gray-400">
          Configure inputs to visualize ALU operation
        </p>
      </div>
    );
  }

  // For Hack ALU, we need to handle the different pipeline stages
  // For now, let's show a simple ripple-carry addition visualization
  // TODO: Expand this to show all 4 Hack ALU pipeline stages

  const laneWidth = Math.min(80, Math.max(50, 600 / width));
  const svgWidth = laneWidth * width + 40;
  const svgHeight = 350;

  // Create dummy step states for visualization
  // In a real implementation, these would come from the actual computation steps
  const steps: StepState[] = Array.from({ length: width }, (_, i) => ({
    bitIndex: i,
    aBit: result.result[i] ?? 0,
    bBit: result.result[i] ?? 0,
    carryIn: 0,
    sum: result.result[i] ?? 0,
    carryOut: 0,
    description: `Bit ${String(i)}`,
  }));

  return (
    <div className="overflow-x-auto">
      <svg
        width={svgWidth}
        height={svgHeight}
        viewBox={`0 0 ${String(svgWidth)} ${String(svgHeight)}`}
        className="mx-auto"
      >
        {/* SVG Definitions */}
        <defs>
          {/* Arrowhead marker for carry lines */}
          <marker
            id="arrowhead"
            markerWidth="10"
            markerHeight="10"
            refX="5"
            refY="5"
            orient="auto"
          >
            <polygon
              points="0 0, 10 5, 0 10"
              fill="rgb(239, 68, 68)"
            />
          </marker>
        </defs>

        {/* Bit lanes */}
        <g transform="translate(20, 20)">
          {steps.map((step, index) => (
            <g key={index} transform={`translate(${String(index * laneWidth)}, 0)`}>
              <BitLane
                index={index}
                xBit={step.aBit}
                yBit={step.bBit}
                carryIn={step.carryIn}
                sum={step.sum}
                carryOut={step.carryOut}
                isActive={currentStep === index}
                width={laneWidth}
                showLabels={width <= 16}
              />
            </g>
          ))}
        </g>

        {/* Legend */}
        <g transform={`translate(20, ${String(svgHeight - 40)})`}>
          <text className="fill-gray-600 text-xs dark:fill-gray-400">
            <tspan x="0" dy="0">Legend:</tspan>
            <tspan x="0" dy="15">● Green = 1 | ● Gray = 0 | ● Blue = Active</tspan>
          </text>
        </g>
      </svg>
    </div>
  );
}
