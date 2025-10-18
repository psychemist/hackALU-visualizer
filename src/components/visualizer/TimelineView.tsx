/**
 * TimelineView Component
 * 
 * Horizontal timeline showing carry propagation and sum generation across bit positions.
 * Provides a "waveform" view of the ripple-carry addition process.
 */

import { useALUStore } from '@/store/aluStore';
import { type StepState } from '@/lib/core';

const ROW_HEIGHT = 40;
const CELL_WIDTH = 60;
const HEADER_WIDTH = 80;

export function TimelineView() {
  const result = useALUStore((state) => state.result);
  const currentStep = useALUStore((state) => state.animation.currentStep);
  const width = useALUStore((state) => state.width);

  if (!result) {
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-gray-500 dark:text-gray-400">
          Configure inputs to view timeline
        </p>
      </div>
    );
  }

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

  const svgWidth = HEADER_WIDTH + CELL_WIDTH * width + 20;
  const svgHeight = ROW_HEIGHT * 5 + 40;

  return (
    <div className="overflow-x-auto p-4">
      <h3 className="mb-3 text-sm font-semibold text-gray-900 dark:text-white">
        Timeline View - Carry Propagation
      </h3>
        
        <svg
          width={svgWidth}
          height={svgHeight}
          viewBox={`0 0 ${String(svgWidth)} ${String(svgHeight)}`}
        >
          {/* Grid lines */}
          <g className="grid-lines">
            {/* Horizontal lines */}
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <line
                key={`h-${String(i)}`}
                x1={HEADER_WIDTH}
                y1={20 + i * ROW_HEIGHT}
                x2={svgWidth - 10}
                y2={20 + i * ROW_HEIGHT}
                stroke="rgb(229, 231, 235)"
                strokeWidth={1}
                className="dark:stroke-gray-700"
              />
            ))}
            
            {/* Vertical lines */}
            {Array.from({ length: width + 1 }, (_, i) => (
              <line
                key={`v-${String(i)}`}
                x1={HEADER_WIDTH + i * CELL_WIDTH}
                y1={20}
                x2={HEADER_WIDTH + i * CELL_WIDTH}
                y2={20 + ROW_HEIGHT * 5}
                stroke="rgb(229, 231, 235)"
                strokeWidth={1}
                className="dark:stroke-gray-700"
              />
            ))}
          </g>

          {/* Row headers */}
          <g className="headers">
            {['Bit', 'X', 'Y', 'C_in', 'Sum', 'C_out'].map((label, i) => (
              <text
                key={label}
                x={10}
                y={20 + i * ROW_HEIGHT + ROW_HEIGHT / 2}
                dominantBaseline="middle"
                className="fill-gray-700 text-xs font-semibold dark:fill-gray-300"
              >
                {label}
              </text>
            ))}
          </g>

          {/* Column headers (bit indices) */}
          <g className="bit-indices">
            {steps.map((_, i) => (
              <text
                key={i}
                x={HEADER_WIDTH + i * CELL_WIDTH + CELL_WIDTH / 2}
                y={20 + ROW_HEIGHT / 2}
                textAnchor="middle"
                dominantBaseline="middle"
                className="fill-gray-600 font-mono text-xs font-semibold dark:fill-gray-400"
              >
                [{i}]
              </text>
            ))}
          </g>

          {/* Data cells */}
          <g className="data-cells">
            {steps.map((step, colIndex) => {
              const isActive = currentStep === colIndex;
              const x = HEADER_WIDTH + colIndex * CELL_WIDTH;

              return (
                <g key={colIndex}>
                  {/* Highlight active column */}
                  {isActive && (
                    <rect
                      x={x}
                      y={20 + ROW_HEIGHT}
                      width={CELL_WIDTH}
                      height={ROW_HEIGHT * 4}
                      fill="rgb(59, 130, 246)"
                      fillOpacity={0.1}
                    />
                  )}

                  {/* X bit */}
                  <TimelineCell
                    x={x}
                    y={20 + ROW_HEIGHT}
                    width={CELL_WIDTH}
                    height={ROW_HEIGHT}
                    value={step.aBit}
                    isActive={isActive}
                  />

                  {/* Y bit */}
                  <TimelineCell
                    x={x}
                    y={20 + ROW_HEIGHT * 2}
                    width={CELL_WIDTH}
                    height={ROW_HEIGHT}
                    value={step.bBit}
                    isActive={isActive}
                  />

                  {/* Carry in */}
                  <TimelineCell
                    x={x}
                    y={20 + ROW_HEIGHT * 3}
                    width={CELL_WIDTH}
                    height={ROW_HEIGHT}
                    value={step.carryIn}
                    isActive={isActive}
                    isCarry
                  />

                  {/* Sum */}
                  <TimelineCell
                    x={x}
                    y={20 + ROW_HEIGHT * 4}
                    width={CELL_WIDTH}
                    height={ROW_HEIGHT}
                    value={step.sum}
                    isActive={isActive}
                    isResult
                  />

                  {/* Carry out */}
                  <TimelineCell
                    x={x}
                    y={20 + ROW_HEIGHT * 5}
                    width={CELL_WIDTH}
                    height={ROW_HEIGHT}
                    value={step.carryOut}
                    isActive={isActive}
                    isCarry
                  />

                  {/* Carry propagation arrow */}
                  {step.carryOut === 1 && colIndex < steps.length - 1 && (
                    <line
                      x1={x + CELL_WIDTH}
                      y1={20 + ROW_HEIGHT * 5 + ROW_HEIGHT / 2}
                      x2={x + CELL_WIDTH}
                      y2={20 + ROW_HEIGHT * 3 + ROW_HEIGHT / 2}
                      stroke="rgb(239, 68, 68)"
                      strokeWidth={2}
                      markerEnd="url(#timeline-arrow)"
                    />
                  )}
                </g>
              );
            })}
          </g>

          {/* Arrow marker definition */}
          <defs>
            <marker
              id="timeline-arrow"
              markerWidth="8"
              markerHeight="8"
              refX="4"
              refY="4"
              orient="auto"
            >
              <polygon points="0 0, 8 4, 0 8" fill="rgb(239, 68, 68)" />
            </marker>
          </defs>
        </svg>
    </div>
  );
}

interface TimelineCellProps {
  x: number;
  y: number;
  width: number;
  height: number;
  value: 0 | 1;
  isActive: boolean;
  isCarry?: boolean;
  isResult?: boolean;
}

function TimelineCell({
  x,
  y,
  width,
  height,
  value,
  isActive,
  isCarry = false,
  isResult = false,
}: TimelineCellProps) {
  let fillColor = value === 1 ? 'rgb(34, 197, 94)' : 'rgb(243, 244, 246)';
  let textColor = value === 1 ? 'white' : 'rgb(107, 114, 128)';

  if (isCarry && value === 1) {
    fillColor = 'rgb(239, 68, 68)';
    textColor = 'white';
  }

  if (isResult && value === 1) {
    fillColor = 'rgb(59, 130, 246)';
    textColor = 'white';
  }

  return (
    <g>
      <rect
        x={x + 2}
        y={y + 2}
        width={width - 4}
        height={height - 4}
        fill={fillColor}
        rx={4}
        className="transition-all duration-200"
      />
      
      <text
        x={x + width / 2}
        y={y + height / 2}
        textAnchor="middle"
        dominantBaseline="middle"
        className="font-mono text-sm font-bold"
        fill={textColor}
      >
        {value}
      </text>

      {isActive && (
        <rect
          x={x + 2}
          y={y + 2}
          width={width - 4}
          height={height - 4}
          fill="none"
          stroke="rgb(59, 130, 246)"
          strokeWidth={2}
          rx={4}
        />
      )}
    </g>
  );
}
