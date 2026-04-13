import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import Providers from '../providers';

vi.mock('next-auth/react', () => ({
  SessionProvider: ({ children }: { children: React.ReactNode }) => <div data-testid="session-provider">{children}</div>,
}));

vi.mock('next-themes', () => ({
  ThemeProvider: ({ children }: { children: React.ReactNode }) => <div data-testid="theme-provider">{children}</div>,
}));

describe('Providers', () => {
  it('renderiza children dentro do SessionProvider e ThemeProvider', () => {
    render(
      <Providers>
        <p>Test Content</p>
      </Providers>,
    );
    expect(screen.getByText('Test Content')).toBeInTheDocument();
    expect(screen.getByTestId('session-provider')).toBeInTheDocument();
    expect(screen.getByTestId('theme-provider')).toBeInTheDocument();
  });
});
