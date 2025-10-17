import type { Meta, StoryObj } from '@storybook/react';
import { ALUVisualizer } from './ALUVisualizer';
import { useALUStore } from '@/store/aluStore';
import { useEffect } from 'react';
import { numberToBits } from '@/lib/core';

const meta = {
  title: 'Visualizer/ALUVisualizer',
  component: ALUVisualizer,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="p-8">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ALUVisualizer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  decorators: [
    (Story) => {
      const compute = useALUStore((state) => state.compute);
      
      useEffect(() => {
        compute();
      }, [compute]);

      return <Story />;
    },
  ],
};

export const NoResult: Story = {
  decorators: [
    (Story) => {
      useEffect(() => {
        useALUStore.setState({ result: null });
      }, []);

      return <Story />;
    },
  ],
  parameters: {
    docs: {
      description: {
        story: 'Visualizer with no computation result',
      },
    },
  },
};

export const FourBit: Story = {
  decorators: [
    (Story) => {
      const store = useALUStore();
      
      useEffect(() => {
        store.setWidth(4);
        store.setX(decimalToBits(5, 4, false));
        store.setY(decimalToBits(3, 4, false));
        store.setOperation('x+y');
      }, [store]);

      return <Story />;
    },
  ],
  parameters: {
    docs: {
      description: {
        story: '4-bit addition: 5 + 3 = 8',
      },
    },
  },
};

export const EightBit: Story = {
  decorators: [
    (Story) => {
      const store = useALUStore();
      
      useEffect(() => {
        store.setWidth(8);
        store.setX(decimalToBits(100, 8, false));
        store.setY(decimalToBits(50, 8, false));
        store.setOperation('x+y');
      }, [store]);

      return <Story />;
    },
  ],
  parameters: {
    docs: {
      description: {
        story: '8-bit addition: 100 + 50 = 150',
      },
    },
  },
};

export const SixteenBit: Story = {
  decorators: [
    (Story) => {
      const store = useALUStore();
      
      useEffect(() => {
        store.setWidth(16);
        store.setX(decimalToBits(1000, 16, false));
        store.setY(decimalToBits(2000, 16, false));
        store.setOperation('x+y');
      }, [store]);

      return <Story />;
    },
  ],
  parameters: {
    docs: {
      description: {
        story: '16-bit addition: 1000 + 2000 = 3000',
      },
    },
  },
};

export const ActiveStep: Story = {
  decorators: [
    (Story) => {
      const store = useALUStore();
      
      useEffect(() => {
        store.setWidth(8);
        store.compute();
        store.resetAnimation();
        // Step to bit 3
        for (let i = 0; i < 3; i++) {
          store.stepForward();
        }
      }, [store]);

      return <Story />;
    },
  ],
  parameters: {
    docs: {
      description: {
        story: 'Visualizer with active step highlighted (bit 3)',
      },
    },
  },
};

export const WithCarryPropagation: Story = {
  decorators: [
    (Story) => {
      const store = useALUStore();
      
      useEffect(() => {
        store.setWidth(8);
        store.setX(decimalToBits(0b11111111, 8, false)); // 255
        store.setY(decimalToBits(0b00000001, 8, false)); // 1
        store.setOperation('x+y'); // 255 + 1 = 0 (overflow)
      }, [store]);

      return <Story />;
    },
  ],
  parameters: {
    docs: {
      description: {
        story: 'Visualizer showing carry propagation: 255 + 1 = 0 (overflow)',
      },
    },
  },
};

export const BitwiseAND: Story = {
  decorators: [
    (Story) => {
      const store = useALUStore();
      
      useEffect(() => {
        store.setWidth(8);
        store.setX(decimalToBits(0b11110000, 8, false));
        store.setY(decimalToBits(0b10101010, 8, false));
        store.setOperation('x&y');
      }, [store]);

      return <Story />;
    },
  ],
  parameters: {
    docs: {
      description: {
        story: 'Bitwise AND operation visualization',
      },
    },
  },
};

export const BitwiseOR: Story = {
  decorators: [
    (Story) => {
      const store = useALUStore();
      
      useEffect(() => {
        store.setWidth(8);
        store.setX(decimalToBits(0b11110000, 8, false));
        store.setY(decimalToBits(0b10101010, 8, false));
        store.setOperation('x|y');
      }, [store]);

      return <Story />;
    },
  ],
  parameters: {
    docs: {
      description: {
        story: 'Bitwise OR operation visualization',
      },
    },
  },
};
