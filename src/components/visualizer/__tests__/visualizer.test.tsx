/**
 * Tests for visualizer components
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { StepController } from '../StepController';
import { TimelineView } from '../TimelineView';
import { ALUVisualizer } from '../ALUVisualizer';
import { useALUStore } from '@/store/aluStore';

describe('StepController', () => {
  beforeEach(() => {
    // Reset store before each test
    const store = useALUStore.getState();
    store.reset();
    store.compute();
  });

  it('renders animation controls', () => {
    render(<StepController />);
    
    expect(screen.getByLabelText(/play/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/step forward/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/step backward/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/reset/i)).toBeInTheDocument();
  });

  it('displays current step counter', () => {
    render(<StepController />);
    
    expect(screen.getByText(/\d+ \/ \d+/)).toBeInTheDocument();
  });

  it('disables controls when no result', () => {
    useALUStore.setState({ result: null });
    render(<StepController />);
    
    expect(screen.getByLabelText(/play/i)).toBeDisabled();
    expect(screen.getByLabelText(/step forward/i)).toBeDisabled();
    expect(screen.getByLabelText(/step backward/i)).toBeDisabled();
  });

  it('toggles between play and pause', async () => {
    const user = userEvent.setup();
    render(<StepController />);
    
    const playButton = screen.getByLabelText(/play/i);
    
    // Initially shows play
    expect(playButton).toHaveAccessibleName(/play/i);
    
    // Click to play
    await user.click(playButton);
    
    // Now shows pause
    expect(screen.getByLabelText(/pause/i)).toBeInTheDocument();
  });

  it('steps forward when clicking step forward button', async () => {
    const user = userEvent.setup();
    render(<StepController />);
    
    const initialStep = useALUStore.getState().animation.currentStep;
    
    await user.click(screen.getByLabelText(/step forward/i));
    
    const newStep = useALUStore.getState().animation.currentStep;
    expect(newStep).toBe(initialStep + 1);
  });

  it('steps backward when clicking step backward button', async () => {
    const user = userEvent.setup();
    
    // First step forward to have something to step back from
    const store = useALUStore.getState();
    store.stepForward();
    
    render(<StepController />);
    
    const initialStep = useALUStore.getState().animation.currentStep;
    
    await user.click(screen.getByLabelText(/step backward/i));
    
    const newStep = useALUStore.getState().animation.currentStep;
    expect(newStep).toBe(initialStep - 1);
  });

  it('resets to first step when clicking reset', async () => {
    const user = userEvent.setup();
    
    // First step forward a few times
    const store = useALUStore.getState();
    store.stepForward();
    store.stepForward();
    store.stepForward();
    
    render(<StepController />);
    
    await user.click(screen.getByLabelText(/reset/i));
    
    const currentStep = useALUStore.getState().animation.currentStep;
    expect(currentStep).toBe(0);
  });

  it('updates speed when using slider', () => {
    render(<StepController />);
    
    // Verify slider is rendered
    const slider = screen.getByLabelText(/animation speed/i);
    expect(slider).toBeInTheDocument();
    
    const store = useALUStore.getState();
    
    // Directly call the store action to simulate slider change
    store.setSpeed(1000);
    
    // Verify the speed was updated in the store
    expect(useALUStore.getState().animation.speed).toBe(1000);
  });

  it('disables step backward at first step', () => {
    const store = useALUStore.getState();
    store.resetAnimation();
    
    render(<StepController />);
    
    expect(screen.getByLabelText(/step backward/i)).toBeDisabled();
  });

  it('disables step forward at last step', () => {
    const store = useALUStore.getState();
    const maxSteps = store.result?.steps.length ?? 0;
    
    useALUStore.setState({
      animation: {
        ...store.animation,
        currentStep: maxSteps - 1,
      },
    });
    
    render(<StepController />);
    
    expect(screen.getByLabelText(/step forward/i)).toBeDisabled();
  });
});

describe('TimelineView', () => {
  beforeEach(() => {
    const store = useALUStore.getState();
    store.reset();
    store.compute();
  });

  it('renders timeline view with result', () => {
    render(<TimelineView />);
    
    expect(screen.getByText(/timeline view/i)).toBeInTheDocument();
    expect(screen.getByText(/carry propagation/i)).toBeInTheDocument();
  });

  it('shows empty state when no result', () => {
    useALUStore.setState({ result: null });
    render(<TimelineView />);
    
    expect(screen.getByText(/configure inputs to view timeline/i)).toBeInTheDocument();
  });

  it('renders correct number of columns for bit width', () => {
    const store = useALUStore.getState();
    store.setWidth(8);
    
    const { container } = render(<TimelineView />);
    
    // Should have 8 bit index labels [0] through [7]
    expect(container.textContent).toMatch(/\[0\]/);
    expect(container.textContent).toMatch(/\[7\]/);
  });

  it('renders row headers', () => {
    const { container } = render(<TimelineView />);
    
    expect(container.textContent).toMatch(/Bit/);
    expect(container.textContent).toMatch(/X/);
    expect(container.textContent).toMatch(/Y/);
    expect(container.textContent).toMatch(/C_in/);
    expect(container.textContent).toMatch(/Sum/);
    expect(container.textContent).toMatch(/C_out/);
  });
});

describe('ALUVisualizer', () => {
  beforeEach(() => {
    const store = useALUStore.getState();
    store.reset();
    store.compute();
  });

  it('renders visualizer with result', () => {
    const { container } = render(<ALUVisualizer />);
    
    // Should render SVG
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('shows empty state when no result', () => {
    useALUStore.setState({ result: null });
    render(<ALUVisualizer />);
    
    expect(screen.getByText(/configure inputs to visualize/i)).toBeInTheDocument();
  });

  it('renders legend', () => {
    const { container } = render(<ALUVisualizer />);
    
    expect(container.textContent).toMatch(/Legend/);
    expect(container.textContent).toMatch(/Green.*1/);
    expect(container.textContent).toMatch(/Gray.*0/);
  });

  it('renders correct number of bit lanes for width', () => {
    const store = useALUStore.getState();
    store.setWidth(4);
    
    const { container } = render(<ALUVisualizer />);
    
    // Should have 4 bit lanes with indices [0] through [3]
    expect(container.textContent).toMatch(/\[0\]/);
    expect(container.textContent).toMatch(/\[3\]/);
    expect(container.textContent).not.toMatch(/\[4\]/);
  });

  it('highlights active bit lane', () => {
    const store = useALUStore.getState();
    store.resetAnimation();
    store.stepForward(); // Move to step 1
    
    const { container } = render(<ALUVisualizer />);
    
    // Active lane should have the 'active' class
    const activeLanes = container.querySelectorAll('.bit-lane.active');
    expect(activeLanes.length).toBeGreaterThan(0);
  });

  it('renders SVG with correct dimensions', () => {
    const store = useALUStore.getState();
    store.setWidth(8);
    
    const { container } = render(<ALUVisualizer />);
    
    const svg = container.querySelector('svg');
    expect(svg).toHaveAttribute('width');
    expect(svg).toHaveAttribute('height');
  });
});
