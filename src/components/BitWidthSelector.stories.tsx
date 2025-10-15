import type { Meta, StoryObj } from '@storybook/react';
import { BitWidthSelector } from './BitWidthSelector';

const meta = {
  title: 'Components/BitWidthSelector',
  component: BitWidthSelector,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof BitWidthSelector>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    value: 8,
    onChange: () => {},
  },
};

export const FourBit: Story = {
  args: {
    value: 4,
    onChange: () => {},
  },
};

export const SixteenBit: Story = {
  args: {
    value: 16,
    onChange: () => {},
  },
};

export const WithWarning: Story = {
  args: {
    value: 4,
    onChange: () => {},
    currentXValue: 100,
    currentYValue: 200,
  },
};

export const Disabled: Story = {
  args: {
    value: 8,
    onChange: () => {},
    disabled: true,
  },
};
