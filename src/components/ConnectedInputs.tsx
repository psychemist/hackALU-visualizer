/**
 * Connected Input Components
 * Wraps base components with Zustand store integration
 */

import { useALUStore } from '@/store/aluStore';
import { bitsToDecimal } from '@/lib/core';
import {
  NumericInput,
  PinGrid,
  ControlBitsPanel,
  OperationSelector,
  BitWidthSelector,
} from '@/components';

/**
 * Connected X Input (Numeric Mode)
 */
export function XNumericInput() {
  const x = useALUStore((state) => state.x);
  const width = useALUStore((state) => state.width);
  const signed = useALUStore((state) => state.signed);
  const base = useALUStore((state) => state.numericBase);
  const setX = useALUStore((state) => state.setX);
  const setNumericBase = useALUStore((state) => state.setNumericBase);

  return (
    <NumericInput
      label="X Input"
      value={x}
      width={width}
      signed={signed}
      base={base}
      onChange={setX}
      onBaseChange={setNumericBase}
      id="x-input"
    />
  );
}

/**
 * Connected Y Input (Numeric Mode)
 */
export function YNumericInput() {
  const y = useALUStore((state) => state.y);
  const width = useALUStore((state) => state.width);
  const signed = useALUStore((state) => state.signed);
  const base = useALUStore((state) => state.numericBase);
  const setY = useALUStore((state) => state.setY);
  const setNumericBase = useALUStore((state) => state.setNumericBase);

  return (
    <NumericInput
      label="Y Input"
      value={y}
      width={width}
      signed={signed}
      base={base}
      onChange={setY}
      onBaseChange={setNumericBase}
      id="y-input"
    />
  );
}

/**
 * Connected X Input (Pin Mode)
 */
export function XPinGrid() {
  const x = useALUStore((state) => state.x);
  const setX = useALUStore((state) => state.setX);

  const handleBitChange = (index: number, value: 0 | 1) => {
    const newX = [...x];
    newX[index] = value;
    setX(newX);
  };

  return <PinGrid label="X Input" value={x} onChange={handleBitChange} />;
}

/**
 * Connected Y Input (Pin Mode)
 */
export function YPinGrid() {
  const y = useALUStore((state) => state.y);
  const setY = useALUStore((state) => state.setY);

  const handleBitChange = (index: number, value: 0 | 1) => {
    const newY = [...y];
    newY[index] = value;
    setY(newY);
  };

  return <PinGrid label="Y Input" value={y} onChange={handleBitChange} />;
}

/**
 * Connected Control Bits Panel
 */
export function ConnectedControlBitsPanel() {
  const controlBits = useALUStore((state) => state.controlBits);
  const setControlBit = useALUStore((state) => state.setControlBit);

  return <ControlBitsPanel value={controlBits} onChange={setControlBit} />;
}

/**
 * Connected Operation Selector
 */
export function ConnectedOperationSelector() {
  const setOperation = useALUStore((state) => state.setOperation);

  // For now, pass null as current operation
  // Could reverse-lookup from control bits in the future
  const currentOperation = null;

  return <OperationSelector value={currentOperation} onChange={setOperation} />;
}

/**
 * Connected Bit Width Selector
 */
export function ConnectedBitWidthSelector() {
  const width = useALUStore((state) => state.width);
  const x = useALUStore((state) => state.x);
  const y = useALUStore((state) => state.y);
  const signed = useALUStore((state) => state.signed);
  const setWidth = useALUStore((state) => state.setWidth);

  const currentXValue = bitsToDecimal(x, signed);
  const currentYValue = bitsToDecimal(y, signed);

  return (
    <BitWidthSelector
      value={width}
      onChange={setWidth}
      currentXValue={currentXValue}
      currentYValue={currentYValue}
    />
  );
}

/**
 * Input Mode Toggle
 */
export function InputModeToggle() {
  const inputMode = useALUStore((state) => state.inputMode);
  const setInputMode = useALUStore((state) => state.setInputMode);

  return (
    <div className="flex items-center gap-2">
      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Input Mode:</label>
      <div className="flex rounded-lg border border-gray-300 dark:border-gray-600" role="radiogroup">
        <button
          type="button"
          role="radio"
          aria-checked={inputMode === 'numeric'}
          onClick={() => {
            setInputMode('numeric');
          }}
          className={`px-3 py-1.5 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            inputMode === 'numeric'
              ? 'bg-blue-500 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
          } rounded-l-lg`}
        >
          Numeric
        </button>
        <button
          type="button"
          role="radio"
          aria-checked={inputMode === 'pin'}
          onClick={() => {
            setInputMode('pin');
          }}
          className={`px-3 py-1.5 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            inputMode === 'pin'
              ? 'bg-blue-500 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
          } rounded-r-lg border-l border-gray-300 dark:border-gray-600`}
        >
          Pin
        </button>
      </div>
    </div>
  );
}

/**
 * Signed/Unsigned Toggle
 */
export function SignedToggle() {
  const signed = useALUStore((state) => state.signed);
  const setSigned = useALUStore((state) => state.setSigned);

  return (
    <label className="flex cursor-pointer items-center gap-2">
      <input
        type="checkbox"
        checked={signed}
        onChange={(e) => {
          setSigned(e.target.checked);
        }}
        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-600"
      />
      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
        Signed (Two's Complement)
      </span>
    </label>
  );
}

/**
 * Control Buttons
 */
export function ControlButtons() {
  const reset = useALUStore((state) => state.reset);
  const randomize = useALUStore((state) => state.randomize);

  return (
    <div className="flex gap-2">
      <button
        type="button"
        onClick={randomize}
        className="flex-1 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
      >
        🎲 Random
      </button>
      <button
        type="button"
        onClick={reset}
        className="flex-1 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
      >
        🔄 Reset
      </button>
    </div>
  );
}
