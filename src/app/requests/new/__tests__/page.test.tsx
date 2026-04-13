import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import NewRequestPage from '../page';

vi.mock('@/components/Sidebar', () => ({
  default: () => <div data-testid="sidebar">Sidebar</div>,
}));

vi.mock('@/components/Header', () => ({
  default: () => <div data-testid="header">Header</div>,
}));

vi.mock('@/components/RequestForm', () => ({
  default: () => <div data-testid="request-form">RequestForm</div>,
}));

vi.mock('@/components/ui/Card', () => ({
  default: ({ children }: { children: React.ReactNode }) => <div data-testid="card">{children}</div>,
}));

describe('NewRequestPage', () => {
  it('renderiza título "Nova Solicitação"', () => {
    render(<NewRequestPage />);
    expect(screen.getByText('Nova Solicitação')).toBeInTheDocument();
  });

  it('renderiza Sidebar', () => {
    render(<NewRequestPage />);
    expect(screen.getByTestId('sidebar')).toBeInTheDocument();
  });

  it('renderiza Header', () => {
    render(<NewRequestPage />);
    expect(screen.getByTestId('header')).toBeInTheDocument();
  });

  it('renderiza RequestForm', () => {
    render(<NewRequestPage />);
    expect(screen.getByTestId('request-form')).toBeInTheDocument();
  });
});
