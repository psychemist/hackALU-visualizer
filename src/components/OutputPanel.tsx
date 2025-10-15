/**
 * OutputPanel Component
 * Displays ALU computation results and details
 */

import { useALUStore } from '@/store/aluStore';
import { bitsToDecimal, bitsToHex, bitsToBinary } from '@/lib/core';

export function OutputPanel() {
  const result = useALUStore((state) => state.result);
  const signed = useALUStore((state) => state.signed);
  const width = useALUStore((state) => state.width);

  if (!result) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Output</h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Configure inputs to see results
          </p>
        </div>
      </div>
    );
  }

  const decimalValue = bitsToDecimal(result.result, signed);
  const hexValue = bitsToHex(result.result);
  const binaryValue = bitsToBinary(result.result);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Output</h2>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          ALU computation results
        </p>
      </div>

      {/* Result Value */}
      <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
        <h3 className="mb-3 text-sm font-semibold text-gray-900 dark:text-white">Result</h3>
        
        <div className="space-y-2">
          <div className="flex items-baseline justify-between">
            <span className="text-sm text-gray-600 dark:text-gray-400">Decimal:</span>
            <span className="font-mono text-lg font-semibold text-gray-900 dark:text-white">
              {String(decimalValue)}
            </span>
          </div>
          
          <div className="flex items-baseline justify-between">
            <span className="text-sm text-gray-600 dark:text-gray-400">Hex:</span>
            <span className="font-mono text-sm text-gray-900 dark:text-white">
              0x{hexValue}
            </span>
          </div>
          
          <div className="flex items-baseline justify-between">
            <span className="text-sm text-gray-600 dark:text-gray-400">Binary:</span>
            <span className="font-mono text-xs text-gray-900 dark:text-white">
              {binaryValue}
            </span>
          </div>
        </div>
      </div>

      {/* Flags */}
      <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
        <h3 className="mb-3 text-sm font-semibold text-gray-900 dark:text-white">Flags</h3>
        
        <div className="grid grid-cols-2 gap-3">
          <FlagBadge label="Zero" active={result.flags.zero} />
          <FlagBadge label="Negative" active={result.flags.sign} />
          <FlagBadge label="Overflow" active={result.flags.overflow} />
          <FlagBadge label="Carry" active={result.flags.carry} />
        </div>
      </div>

      {/* Pipeline Stages */}
      <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
        <h3 className="mb-3 text-sm font-semibold text-gray-900 dark:text-white">Pipeline Stages</h3>
        
        <div className="space-y-3">
          <PipelineStage
            label="1. Preprocess X"
            description={result.steps[0]?.description ?? ''}
            bits={result.steps[0]?.xProcessed}
            signed={signed}
          />
          <PipelineStage
            label="2. Preprocess Y"
            description={result.steps[1]?.description ?? ''}
            bits={result.steps[1]?.yProcessed}
            signed={signed}
          />
          <PipelineStage
            label="3. Compute"
            description={result.steps[2]?.description ?? ''}
            bits={result.steps[2]?.rawResult}
            signed={signed}
          />
          <PipelineStage
            label="4. Postprocess"
            description={result.steps[3]?.description ?? ''}
            bits={result.steps[3]?.finalResult}
            signed={signed}
          />
        </div>
      </div>

      {/* Info */}
      <div className="rounded-lg bg-blue-50 p-3 dark:bg-blue-900/20">
        <p className="text-xs text-blue-700 dark:text-blue-300">
          Width: {String(width)} bits • Format: {signed ? 'Signed' : 'Unsigned'}
        </p>
      </div>
    </div>
  );
}

function FlagBadge({ label, active }: { label: string; active: boolean }) {
  return (
    <div
      className={`rounded-md px-3 py-2 text-center text-sm font-medium transition-colors ${
        active
          ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300'
          : 'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400'
      }`}
    >
      {label}
      <span className="ml-1 text-xs">{active ? '✓' : '—'}</span>
    </div>
  );
}

function PipelineStage({
  label,
  description,
  bits,
  signed,
}: {
  label: string;
  description: string;
  bits?: (0 | 1)[];
  signed: boolean;
}) {
  const value = bits !== undefined ? bitsToDecimal(bits, signed) : null;

  return (
    <div className="border-l-2 border-blue-500 pl-3">
      <div className="text-xs font-semibold text-gray-900 dark:text-white">{label}</div>
      <div className="mt-0.5 text-xs text-gray-600 dark:text-gray-400">{description}</div>
      {value !== null && (
        <div className="mt-1 font-mono text-sm text-gray-900 dark:text-white">
          = {String(value)}
        </div>
      )}
    </div>
  );
}
