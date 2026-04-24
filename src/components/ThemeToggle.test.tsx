import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ThemeToggle from './ThemeToggle';

const mockSetTheme = vi.fn();

vi.mock('next-themes', () => ({
  useTheme: () => ({
    resolvedTheme: 'light',
    setTheme: mockSetTheme,
  }),
}));

describe('ThemeToggle', () => {
  beforeEach(() => {
    mockSetTheme.mockClear();
  });

  it('renderiza botão de troca de tema', () => {
    render(<ThemeToggle />);
    expect(screen.getByText('Tema Escuro')).toBeInTheDocument();
  });

  it('chama setTheme com "dark" ao clicar quando tema é light', async () => {
    const user = userEvent.setup();
    render(<ThemeToggle />);
    await user.click(screen.getByRole('button'));
    expect(mockSetTheme).toHaveBeenCalledWith('dark');
  });
});
