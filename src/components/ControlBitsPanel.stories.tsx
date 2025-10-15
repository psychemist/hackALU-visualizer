import type { Meta, StoryObj } from '@storybook/react';
import { ControlBitsPanel } from './ControlBitsPanel';

const meta = {
  title: 'Components/ControlBitsPanel',
  component: ControlBitsPanel,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof ControlBitsPanel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    value: { zx: 0, nx: 0, zy: 0, ny: 0, f: 1, no: 0 },
    onChange: () => {},
  },
};

export const AllZeros: Story = {
  args: {
    value: { zx: 0, nx: 0, zy: 0, ny: 0, f: 0, no: 0 },
    onChange: () => {},
  },
};

export const AllOnes: Story = {
  args: {
    value: { zx: 1, nx: 1, zy: 1, ny: 1, f: 1, no: 1 },
    onChange: () => {},
  },
};

export const Disabled: Story = {
  args: {
    value: { zx: 1, nx: 0, zy: 1, ny: 0, f: 1, no: 0 },
    onChange: () => {},
    disabled: true,
  },
};
