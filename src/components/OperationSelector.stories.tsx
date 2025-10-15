import type { Meta, StoryObj } from '@storybook/react';
import { OperationSelector } from './OperationSelector';

const meta = {
  title: 'Components/OperationSelector',
  component: OperationSelector,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof OperationSelector>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    value: null,
    onChange: () => {},
  },
};

export const AddSelected: Story = {
  args: {
    value: 'x+y',
    onChange: () => {},
  },
};

export const SubtractSelected: Story = {
  args: {
    value: 'x-y',
    onChange: () => {},
  },
};

export const AndSelected: Story = {
  args: {
    value: 'x&y',
    onChange: () => {},
  },
};

export const Disabled: Story = {
  args: {
    value: 'x+y',
    onChange: () => {},
    disabled: true,
  },
};
