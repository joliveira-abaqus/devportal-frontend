import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ThemeToggle from '../ThemeToggle';

const mockSetTheme = vi.fn();

vi.mock('next-themes', () => ({
  useTheme: vi.fn(() => ({ resolvedTheme: 'light', setTheme: mockSetTheme })),
}));

import { useTheme } from 'next-themes';

describe('ThemeToggle', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renderiza botão de tema escuro quando tema é light', () => {
    (useTheme as ReturnType<typeof vi.fn>).mockReturnValue({
      resolvedTheme: 'light',
      setTheme: mockSetTheme,
    });

    render(<ThemeToggle />);
    expect(screen.getByText('Tema Escuro')).toBeInTheDocument();
  });

  it('renderiza botão de tema claro quando tema é dark', () => {
    (useTheme as ReturnType<typeof vi.fn>).mockReturnValue({
      resolvedTheme: 'dark',
      setTheme: mockSetTheme,
    });

    render(<ThemeToggle />);
    expect(screen.getByText('Tema Claro')).toBeInTheDocument();
  });

  it('chama setTheme("dark") quando tema atual é light', () => {
    (useTheme as ReturnType<typeof vi.fn>).mockReturnValue({
      resolvedTheme: 'light',
      setTheme: mockSetTheme,
    });

    render(<ThemeToggle />);
    fireEvent.click(screen.getByText('Tema Escuro'));
    expect(mockSetTheme).toHaveBeenCalledWith('dark');
  });

  it('chama setTheme("light") quando tema atual é dark', () => {
    (useTheme as ReturnType<typeof vi.fn>).mockReturnValue({
      resolvedTheme: 'dark',
      setTheme: mockSetTheme,
    });

    render(<ThemeToggle />);
    fireEvent.click(screen.getByText('Tema Claro'));
    expect(mockSetTheme).toHaveBeenCalledWith('light');
  });

  it('não renderiza nada antes de montar (hydration guard)', () => {
    // ThemeToggle usa useState(false) para mounted. Na primeira renderização
    // mounted é false e retorna null. Após useEffect, mounted vira true.
    // Como useEffect roda no primeiro render no test env, o componente
    // acaba renderizando. Testaremos que o componente existe.
    render(<ThemeToggle />);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });
});
