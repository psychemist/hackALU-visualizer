import type { Meta, StoryObj } from '@storybook/react';
import { PinGrid } from './PinGrid';
import { decimalToBits } from '@/lib/core';

/**
 * PinGrid displays a grid of bit toggles for visual pin-mode input.
 * Bits are displayed in LSB-first order (right-to-left).
 */
const meta = {
  title: 'Components/PinGrid',
  component: PinGrid,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    showLabels: {
      control: 'boolean',
      description: 'Whether to show bit index labels',
    },
    size: {
      control: { type: 'radio' },
      options: ['sm', 'md', 'lg'],
      description: 'Size of individual bit toggles',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the grid is disabled',
    },
  },
} satisfies Meta<typeof PinGrid>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * 8-bit grid with default settings
 */
export const EightBit: Story = {
  args: {
    label: 'X Input',
    value: decimalToBits(42, 8, false),
    onChange: () => {},
    showLabels: true,
    size: 'md',
  },
};

/**
 * 4-bit grid (compact)
 */
export const FourBit: Story = {
  args: {
    label: 'Small Value',
    value: decimalToBits(15, 4, false),
    onChange: () => {},
    showLabels: true,
    size: 'md',
  },
};

/**
 * 16-bit grid (wide)
 */
export const SixteenBit: Story = {
  args: {
    label: 'Wide Value',
    value: decimalToBits(32768, 16, false),
    onChange: () => {},
    showLabels: true,
    size: 'sm',
  },
};

/**
 * Grid without labels
 */
export const WithoutLabels: Story = {
  args: {
    label: 'No Labels',
    value: decimalToBits(170, 8, false),
    onChange: () => {},
    showLabels: false,
    size: 'md',
  },
};

/**
 * Small size variant
 */
export const SmallSize: Story = {
  args: {
    label: 'Small Toggles',
    value: decimalToBits(85, 8, false),
    onChange: () => {},
    showLabels: true,
    size: 'sm',
  },
};

/**
 * Large size variant
 */
export const LargeSize: Story = {
  args: {
    label: 'Large Toggles',
    value: decimalToBits(85, 8, false),
    onChange: () => {},
    showLabels: true,
    size: 'lg',
  },
};

/**
 * Disabled state
 */
export const Disabled: Story = {
  args: {
    label: 'Disabled Grid',
    value: decimalToBits(255, 8, false),
    onChange: () => {},
    showLabels: true,
    size: 'md',
    disabled: true,
  },
};

/**
 * All zeros
 */
export const AllZeros: Story = {
  args: {
    label: 'Zero',
    value: [0, 0, 0, 0, 0, 0, 0, 0],
    onChange: () => {},
    showLabels: true,
    size: 'md',
  },
};

/**
 * All ones
 */
export const AllOnes: Story = {
  args: {
    label: 'Max Value',
    value: [1, 1, 1, 1, 1, 1, 1, 1],
    onChange: () => {},
    showLabels: true,
    size: 'md',
  },
};
