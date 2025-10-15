import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { NumericInput, type NumericBase } from './NumericInput';
import { createBits, decimalToBits } from '@/lib/core';

/**
 * NumericInput allows users to input values in decimal, hexadecimal, or binary formats.
 * It handles validation, conversion between formats, and provides real-time feedback.
 */
const meta = {
  title: 'Components/NumericInput',
  component: NumericInput,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    base: {
      control: { type: 'radio' },
      options: ['decimal', 'hex', 'binary'],
      description: 'Number base for input',
    },
    width: {
      control: { type: 'number', min: 4, max: 16, step: 4 },
      description: 'Bit width',
    },
    signed: {
      control: 'boolean',
      description: 'Whether to use signed (two\'s complement) interpretation',
    },
  },
} satisfies Meta<typeof NumericInput>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default decimal input with 8-bit width
 */
export const Decimal: Story = {
  args: {
    label: 'Value',
    value: decimalToBits(42, 8, true),
    width: 8,
    signed: true,
    base: 'decimal',
    onChange: () => {},
    id: 'decimal-input',
  },
};

/**
 * Hexadecimal input mode
 */
export const Hexadecimal: Story = {
  args: {
    label: 'Hex Value',
    value: decimalToBits(255, 8, false),
    width: 8,
    signed: false,
    base: 'hex',
    onChange: () => {},
    id: 'hex-input',
  },
};

/**
 * Binary input mode
 */
export const Binary: Story = {
  args: {
    label: 'Binary Value',
    value: decimalToBits(170, 8, false),
    width: 8,
    signed: false,
    base: 'binary',
    onChange: () => {},
    id: 'binary-input',
  },
};

/**
 * Signed 16-bit input
 */
export const Signed16Bit: Story = {
  args: {
    label: 'Signed Value',
    value: decimalToBits(-1024, 16, true),
    width: 16,
    signed: true,
    base: 'decimal',
    onChange: () => {},
    id: 'signed-input',
  },
};

/**
 * Unsigned 4-bit input
 */
export const Unsigned4Bit: Story = {
  args: {
    label: 'Small Value',
    value: decimalToBits(15, 4, false),
    width: 4,
    signed: false,
    base: 'decimal',
    onChange: () => {},
    id: 'small-input',
  },
};

/**
 * Zero value
 */
export const Zero: Story = {
  args: {
    label: 'Zero',
    value: createBits(8),
    width: 8,
    signed: true,
    base: 'decimal',
    onChange: () => {},
    id: 'zero-input',
  },
};

/**
 * Maximum positive value
 */
export const MaxPositive: Story = {
  args: {
    label: 'Max Positive',
    value: decimalToBits(127, 8, true),
    width: 8,
    signed: true,
    base: 'decimal',
    onChange: () => {},
    id: 'max-input',
  },
};

/**
 * Minimum negative value
 */
export const MinNegative: Story = {
  args: {
    label: 'Min Negative',
    value: decimalToBits(-128, 8, true),
    width: 8,
    signed: true,
    base: 'decimal',
    onChange: () => {},
    id: 'min-input',
  },
};

/**
 * Interactive example with base switching
 */
export const InteractiveWithBaseSwitching: Story = {
  args: {
    label: 'Interactive',
    value: createBits(8),
    width: 8,
    signed: true,
    base: 'decimal' as NumericBase,
    onChange: () => {},
    id: 'interactive',
  },
  render: () => {
    const [value, setValue] = useState(decimalToBits(100, 8, true));
    const [base, setBase] = useState<NumericBase>('decimal');

    return (
      <div className="w-80">
        <NumericInput
          label="Interactive Value"
          value={value}
          width={8}
          signed={true}
          base={base}
          onChange={setValue}
          onBaseChange={setBase}
          id="interactive-input"
        />
        <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
          Try changing the base and entering different values!
        </p>
      </div>
    );
  },
};
