import type { Meta, StoryObj } from '@storybook/react';
import { StepController } from './StepController';
import { useALUStore } from '@/store/aluStore';
import { useEffect } from 'react';

const meta = {
  title: 'Visualizer/StepController',
  component: StepController,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="w-96">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof StepController>;

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
        story: 'Controls are disabled when there is no result to visualize',
      },
    },
  },
};

export const Playing: Story = {
  decorators: [
    (Story) => {
      const compute = useALUStore((state) => state.compute);
      const play = useALUStore((state) => state.play);
      
      useEffect(() => {
        compute();
        play();
      }, [compute, play]);

      return <Story />;
    },
  ],
  parameters: {
    docs: {
      description: {
        story: 'Animation is currently playing (automatically stepping through)',
      },
    },
  },
};

export const MidAnimation: Story = {
  decorators: [
    (Story) => {
      const compute = useALUStore((state) => state.compute);
      const resetAnimation = useALUStore((state) => state.resetAnimation);
      const stepForward = useALUStore((state) => state.stepForward);
      
      useEffect(() => {
        compute();
        resetAnimation();
        // Step forward 5 times
        for (let i = 0; i < 5; i++) {
          stepForward();
        }
      }, [compute, resetAnimation, stepForward]);

      return <Story />;
    },
  ],
  parameters: {
    docs: {
      description: {
        story: 'Controller in the middle of animation (step 6/16)',
      },
    },
  },
};

export const FastSpeed: Story = {
  decorators: [
    (Story) => {
      const compute = useALUStore((state) => state.compute);
      const setSpeed = useALUStore((state) => state.setSpeed);
      
      useEffect(() => {
        compute();
        setSpeed(100); // Fast speed
      }, [compute, setSpeed]);

      return <Story />;
    },
  ],
  parameters: {
    docs: {
      description: {
        story: 'Speed slider set to fastest (100ms per step)',
      },
    },
  },
};

export const SlowSpeed: Story = {
  decorators: [
    (Story) => {
      const compute = useALUStore((state) => state.compute);
      const setSpeed = useALUStore((state) => state.setSpeed);
      
      useEffect(() => {
        compute();
        setSpeed(2000); // Slow speed
      }, [compute, setSpeed]);

      return <Story />;
    },
  ],
  parameters: {
    docs: {
      description: {
        story: 'Speed slider set to slowest (2000ms per step)',
      },
    },
  },
};
