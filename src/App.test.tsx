import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import App from './App';

describe('App', () => {
  it('renders the ALU Visualizer interface', () => {
    render(<App />);

    // Check for main heading
    expect(screen.getByRole('heading', { name: /ALU Visualizer/i })).toBeInTheDocument();
    
    // Check for key sections
    expect(screen.getByText(/Configure ALU inputs and operations/i)).toBeInTheDocument();
    expect(screen.getByText(/Animation Controls/i)).toBeInTheDocument();
  });

  it('renders input controls', () => {
    render(<App />);

    // Check for bit width selector
    expect(screen.getByText(/Bit Width/i)).toBeInTheDocument();
    
    // Check for input mode toggle
    expect(screen.getByText(/Input Mode:/i)).toBeInTheDocument();
    
    // Check for signed toggle
    expect(screen.getByText(/Signed \(Two's Complement\)/i)).toBeInTheDocument();
  });

  it('renders control buttons', () => {
    render(<App />);

    // Check for main control buttons
    expect(screen.getByRole('button', { name: /Random/i })).toBeInTheDocument();
    // Note: There are two reset buttons now (one in ControlButtons, one in StepController)
    expect(screen.getAllByRole('button', { name: /Reset/i }).length).toBeGreaterThan(0);
    
    // Check for animation controls
    expect(screen.getByRole('button', { name: /Play/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Step forward/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Step backward/i })).toBeInTheDocument();
  });
});
