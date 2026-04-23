import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ThemeToggle from '@/components/ThemeToggle';

const mockSetTheme = jest.fn();

jest.mock('next-themes', () => ({
  useTheme: jest.fn(() => ({
    resolvedTheme: 'light',
    setTheme: mockSetTheme,
  })),
}));

describe('ThemeToggle', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve exibir "Tema Escuro" quando o tema atual é light', () => {
    render(<ThemeToggle />);
    expect(screen.getByText('Tema Escuro')).toBeInTheDocument();
  });

  it('deve exibir "Tema Claro" quando o tema atual é dark', () => {
    const { useTheme } = require('next-themes');
    useTheme.mockReturnValue({ resolvedTheme: 'dark', setTheme: mockSetTheme });

    render(<ThemeToggle />);
    expect(screen.getByText('Tema Claro')).toBeInTheDocument();
  });

  it('deve chamar setTheme("dark") ao clicar quando tema é light', async () => {
    const user = userEvent.setup();
    const { useTheme } = require('next-themes');
    useTheme.mockReturnValue({ resolvedTheme: 'light', setTheme: mockSetTheme });

    render(<ThemeToggle />);
    await user.click(screen.getByText('Tema Escuro'));
    expect(mockSetTheme).toHaveBeenCalledWith('dark');
  });

  it('deve chamar setTheme("light") ao clicar quando tema é dark', async () => {
    const user = userEvent.setup();
    const { useTheme } = require('next-themes');
    useTheme.mockReturnValue({ resolvedTheme: 'dark', setTheme: mockSetTheme });

    render(<ThemeToggle />);
    await user.click(screen.getByText('Tema Claro'));
    expect(mockSetTheme).toHaveBeenCalledWith('light');
  });

  it('não deve renderizar antes de montar (hidratação)', () => {
    jest.spyOn(require('react'), 'useState').mockImplementationOnce(() => [false, jest.fn()]);

    const { container } = render(<ThemeToggle />);
    expect(container.firstChild).toBeNull();

    jest.restoreAllMocks();
  });
});
