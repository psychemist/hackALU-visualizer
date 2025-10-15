/**
 * InputPanel Component
 * Complete left panel with all input controls
 */

import { useALUStore } from '@/store/aluStore';
import {
  XNumericInput,
  YNumericInput,
  XPinGrid,
  YPinGrid,
  ConnectedControlBitsPanel,
  ConnectedOperationSelector,
  ConnectedBitWidthSelector,
  InputModeToggle,
  SignedToggle,
  ControlButtons,
} from './ConnectedInputs';

export function InputPanel() {
  const inputMode = useALUStore((state) => state.inputMode);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Inputs</h2>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Configure ALU inputs and operations
        </p>
      </div>

      {/* Bit Width Selector */}
      <ConnectedBitWidthSelector />

      {/* Signed Toggle */}
      <SignedToggle />

      {/* Input Mode Toggle */}
      <InputModeToggle />

      {/* X Input */}
      <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
        {inputMode === 'numeric' ? <XNumericInput /> : <XPinGrid />}
      </div>

      {/* Y Input */}
      <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
        {inputMode === 'numeric' ? <YNumericInput /> : <YPinGrid />}
      </div>

      {/* Operation Selector */}
      <ConnectedOperationSelector />

      {/* Control Bits Panel */}
      <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
        <ConnectedControlBitsPanel />
      </div>

      {/* Control Buttons */}
      <ControlButtons />
    </div>
  );
}
