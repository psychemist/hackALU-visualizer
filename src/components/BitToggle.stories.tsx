import type { Meta, StoryObj } from '@storybook/react';
import { BitToggle } from './BitToggle';

/**
 * BitToggle is a single-bit toggle switch that can be clicked or controlled via keyboard.
 * It displays a 0 or 1 and provides visual feedback for the current state.
 */
const meta = {
  title: 'Components/BitToggle',
  component: BitToggle,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    value: {
      control: { type: 'radio' },
      options: [0, 1],
      description: 'Current bit value (0 or 1)',
    },
    size: {
      control: { type: 'radio' },
      options: ['sm', 'md', 'lg'],
      description: 'Size variant of the toggle',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the toggle is disabled',
    },
  },
  args: {
    onChange: () => {},
  },
} satisfies Meta<typeof BitToggle>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default state showing a bit with value 0
 */
export const Zero: Story = {
  args: {
    value: 0,
    index: 0,
  },
};

/**
 * Bit with value 1 (active state)
 */
export const One: Story = {
  args: {
    value: 1,
    index: 0,
  },
};

/**
 * Small size variant
 */
export const SmallSize: Story = {
  args: {
    value: 1,
    size: 'sm',
    index: 0,
  },
};

/**
 * Medium size (default)
 */
export const MediumSize: Story = {
  args: {
    value: 1,
    size: 'md',
    index: 0,
  },
};

/**
 * Large size variant
 */
export const LargeSize: Story = {
  args: {
    value: 1,
    size: 'lg',
    index: 0,
  },
};

/**
 * Disabled state
 */
export const Disabled: Story = {
  args: {
    value: 0,
    disabled: true,
    index: 0,
  },
};

/**
 * Disabled with value 1
 */
export const DisabledOne: Story = {
  args: {
    value: 1,
    disabled: true,
    index: 0,
  },
};

/**
 * Interactive example showing multiple bits
 */
export const MultipleBits: Story = {
  args: {
    value: 1,
    index: 0,
  },
  render: () => (
    <div className="flex gap-2">
      <BitToggle value={1} onChange={() => {}} index={7} />
      <BitToggle value={0} onChange={() => {}} index={6} />
      <BitToggle value={1} onChange={() => {}} index={5} />
      <BitToggle value={1} onChange={() => {}} index={4} />
      <BitToggle value={0} onChange={() => {}} index={3} />
      <BitToggle value={0} onChange={() => {}} index={2} />
      <BitToggle value={1} onChange={() => {}} index={1} />
      <BitToggle value={0} onChange={() => {}} index={0} />
    </div>
  ),
};
