import { describe, it, expect, vi } from 'vitest';
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
  it('deve renderizar botão de tema escuro quando no tema claro', () => {
    render(<ThemeToggle />);
    expect(screen.getByText('Tema Escuro')).toBeInTheDocument();
  });

  it('deve chamar setTheme ao clicar', async () => {
    const user = userEvent.setup();
    render(<ThemeToggle />);
    await user.click(screen.getByRole('button'));
    expect(mockSetTheme).toHaveBeenCalledWith('dark');
  });
});
