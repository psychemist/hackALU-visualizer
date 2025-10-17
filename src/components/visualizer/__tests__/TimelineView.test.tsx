/**
 * Tests for TimelineView Component
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { TimelineView } from '../TimelineView';
import { useALUStore } from '@/store/aluStore';

describe('TimelineView', () => {
  beforeEach(() => {
    // Reset store before each test
    useALUStore.getState().reset();
  });

  it('renders empty state when no result is available', () => {
    useALUStore.setState({ result: null });
    render(<TimelineView />);
    
    expect(screen.getByText(/configure inputs to view timeline/i)).toBeInTheDocument();
  });

  it('renders timeline grid when result is available', () => {
    const store = useALUStore.getState();
    store.compute();

    const { container } = render(<TimelineView />);
    
    expect(screen.getByText(/timeline view - carry propagation/i)).toBeInTheDocument();
    
    // Check for SVG element
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('displays row headers correctly', () => {
    const store = useALUStore.getState();
    store.compute();

    const { container } = render(<TimelineView />);
    
    // Check for row headers in SVG text elements
    const textElements = container.querySelectorAll('text');
    const headerTexts = Array.from(textElements).map(el => el.textContent);
    
    expect(headerTexts).toContain('Bit');
    expect(headerTexts).toContain('X');
    expect(headerTexts).toContain('Y');
    expect(headerTexts).toContain('C_in');
    expect(headerTexts).toContain('Sum');
    expect(headerTexts).toContain('C_out');
  });

  it('renders cells for each bit position', () => {
    const store = useALUStore.getState();
    store.setWidth(4);
    store.compute();

    const { container } = render(<TimelineView />);
    
    // Should have cells for 4 bit positions
    const bitIndices = container.querySelectorAll('text[text-anchor="middle"]');
    const pattern = /\[\d+\]/;
    const indices = Array.from(bitIndices)
      .map(el => el.textContent)
      .filter(text => text && pattern.exec(text));
    
    expect(indices.length).toBeGreaterThanOrEqual(4);
  });

  it('highlights active column when animation is in progress', () => {
    const store = useALUStore.getState();
    store.setWidth(8);
    store.compute();
    store.stepForward();
    store.stepForward();

    const { container } = render(<TimelineView />);
    
    // Check for highlight rectangle
    const highlights = container.querySelectorAll('rect[fill-opacity="0.1"]');
    expect(highlights.length).toBeGreaterThan(0);
  });

  it('adapts to different bit widths', () => {
    const store = useALUStore.getState();
    
    // Test with 4-bit width
    store.setWidth(4);
    store.compute();
    const { container: container4, unmount: unmount4 } = render(<TimelineView />);
    const svg4 = container4.querySelector('svg');
    const width4 = Number(svg4?.getAttribute('width'));
    unmount4();
    
    // Test with 16-bit width
    store.setWidth(16);
    store.compute();
    const { container: container16 } = render(<TimelineView />);
    const svg16 = container16.querySelector('svg');
    const width16 = Number(svg16?.getAttribute('width'));
    
    // 16-bit should have wider SVG than 4-bit
    expect(width16).toBeGreaterThan(width4);
  });
});
