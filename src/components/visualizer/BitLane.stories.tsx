import type { Meta, StoryObj } from '@storybook/react';
import { BitLane } from './BitLane';

const meta = {
  title: 'Visualizer/BitLane',
  component: BitLane,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    index: {
      control: { type: 'number', min: 0, max: 15 },
      description: 'Bit position (0 = LSB)',
    },
    xBit: {
      control: { type: 'select' },
      options: [0, 1],
      description: 'X input bit value',
    },
    yBit: {
      control: { type: 'select' },
      options: [0, 1],
      description: 'Y input bit value',
    },
    carryIn: {
      control: { type: 'select' },
      options: [0, 1],
      description: 'Carry in bit value',
    },
    sum: {
      control: { type: 'select' },
      options: [0, 1],
      description: 'Sum/result bit value',
    },
    carryOut: {
      control: { type: 'select' },
      options: [0, 1],
      description: 'Carry out bit value',
    },
    isActive: {
      control: 'boolean',
      description: 'Whether this lane is highlighted',
    },
    width: {
      control: { type: 'number', min: 50, max: 200 },
      description: 'Width of the lane in pixels',
    },
    showLabels: {
      control: 'boolean',
      description: 'Whether to show bit labels',
    },
  },
  decorators: [
    (Story) => (
      <svg width="120" height="320" viewBox="0 0 120 320">
        <Story />
      </svg>
    ),
  ],
} satisfies Meta<typeof BitLane>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    index: 0,
    xBit: 1,
    yBit: 0,
    carryIn: 0,
    sum: 1,
    carryOut: 0,
    isActive: false,
    width: 80,
    showLabels: true,
  },
};

export const AllZeros: Story = {
  args: {
    index: 0,
    xBit: 0,
    yBit: 0,
    carryIn: 0,
    sum: 0,
    carryOut: 0,
    isActive: false,
    width: 80,
    showLabels: true,
  },
};

export const AllOnes: Story = {
  args: {
    index: 0,
    xBit: 1,
    yBit: 1,
    carryIn: 1,
    sum: 1,
    carryOut: 1,
    isActive: false,
    width: 80,
    showLabels: true,
  },
};

export const Active: Story = {
  args: {
    index: 3,
    xBit: 1,
    yBit: 1,
    carryIn: 0,
    sum: 0,
    carryOut: 1,
    isActive: true,
    width: 80,
    showLabels: true,
  },
};

export const WithCarryPropagation: Story = {
  args: {
    index: 5,
    xBit: 1,
    yBit: 1,
    carryIn: 1,
    sum: 1,
    carryOut: 1,
    isActive: true,
    width: 80,
    showLabels: true,
  },
};

export const Narrow: Story = {
  args: {
    index: 0,
    xBit: 1,
    yBit: 0,
    carryIn: 1,
    sum: 0,
    carryOut: 1,
    isActive: false,
    width: 50,
    showLabels: false,
  },
};

export const Wide: Story = {
  args: {
    index: 15,
    xBit: 0,
    yBit: 1,
    carryIn: 1,
    sum: 0,
    carryOut: 1,
    isActive: false,
    width: 120,
    showLabels: true,
  },
};

export const FullAdderExample: Story = {
  args: {
    index: 7,
    xBit: 1,
    yBit: 1,
    carryIn: 0,
    sum: 0,
    carryOut: 1,
    isActive: true,
    width: 80,
    showLabels: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Full adder example: 1 + 1 + 0 = 10 (binary), so sum=0 and carry out=1',
      },
    },
  },
};
