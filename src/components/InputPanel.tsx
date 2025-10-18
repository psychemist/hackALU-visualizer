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
    <div className="space-y-4">
      {/* Bit Width Selector */}
      <ConnectedBitWidthSelector />

      {/* Signed Toggle */}
      <SignedToggle />

      {/* Input Mode Toggle */}
      <InputModeToggle />

      {/* X Input */}
      <div className="rounded-lg border border-gray-200 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-900">
        {inputMode === 'numeric' ? <XNumericInput /> : <XPinGrid />}
      </div>

      {/* Y Input */}
      <div className="rounded-lg border border-gray-200 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-900">
        {inputMode === 'numeric' ? <YNumericInput /> : <YPinGrid />}
      </div>

      {/* Operation Selector */}
      <ConnectedOperationSelector />

      {/* Control Bits Panel */}
      <div className="rounded-lg border border-gray-200 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-900">
        <ConnectedControlBitsPanel />
      </div>

      {/* Control Buttons */}
      <ControlButtons />
    </div>
  );
}
