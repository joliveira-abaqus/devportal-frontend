import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import DashboardLoading from '../loading';

describe('DashboardLoading', () => {
  it('renderiza skeletons animados', () => {
    const { container } = render(<DashboardLoading />);
    const pulses = container.querySelectorAll('.animate-pulse');
    expect(pulses.length).toBeGreaterThan(0);
  });
});
