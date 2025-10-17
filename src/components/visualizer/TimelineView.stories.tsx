import type { Meta, StoryObj } from '@storybook/react';
import { TimelineView } from './TimelineView';
import { useALUStore } from '@/store/aluStore';
import { useEffect } from 'react';
import { decimalToBits } from '@/lib/core';

const meta = {
  title: 'Visualizer/TimelineView',
  component: TimelineView,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof TimelineView>;

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
      const store = useALUStore();
      
      useEffect(() => {
        store.reset();
        // Don't compute to have null result
      }, [store]);

      return <Story />;
    },
  ],
  parameters: {
    docs: {
      description: {
        story: 'Timeline view when no result is available',
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
        store.setX(decimalToBits(10, 4, false, false)); // 10
        store.setY(decimalToBits(5, 4, false, false)); // 5
        store.setOperation('x+y');
      }, [store]);

      return <Story />;
    },
  ],
  parameters: {
    docs: {
      description: {
        story: '4-bit addition: 10 + 5 = 15',
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
        store.setX(decimalToBits(204, 8, false)); // 204
        store.setY(decimalToBits(51, 8, false)); // 51
        store.setOperation('x+y');
      }, [store]);

      return <Story />;
    },
  ],
  parameters: {
    docs: {
      description: {
        story: '8-bit addition: 204 + 51 = 255',
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
        store.setX(decimalToBits(0b1111000011110000, 16, false));
        store.setY(decimalToBits(0b0000111100001111, 16, false));
        store.setOperation('x+y');
      }, [store]);

      return <Story />;
    },
  ],
  parameters: {
    docs: {
      description: {
        story: '16-bit addition with carry propagation',
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
        // Step forward a few times
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
        story: 'Timeline view with active step highlighted (step 4)',
      },
    },
  },
};

export const WithCarryPropagation: Story = {
  decorators: [
    (Story) => {
      const store = useALUStore();
      
      useEffect(() => {
        store.setWidth(4);
        store.setX(decimalToBits(15, 4, false)); // 15
        store.setY(decimalToBits(1, 4, false)); // 1
        store.setOperation('x+y'); // 15 + 1 = 16 (overflow in 4-bit)
      }, [store]);

      return <Story />;
    },
  ],
  parameters: {
    docs: {
      description: {
        story: 'Timeline showing carry propagation through all bits: 15 + 1 = 0 (with overflow)',
      },
    },
  },
};
