import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Header from './Header';

const mockSignOut = vi.fn();

vi.mock('next-auth/react', () => ({
  useSession: () => ({
    data: {
      user: { name: 'Dev User', email: 'dev@devportal.local' },
    },
  }),
  signOut: (...args: unknown[]) => mockSignOut(...args),
}));

describe('Header', () => {
  it('deve renderizar o título DevPortal', () => {
    render(<Header />);
    expect(screen.getByText('DevPortal')).toBeInTheDocument();
  });

  it('deve exibir nome do usuário logado', () => {
    render(<Header />);
    expect(screen.getByText('Dev User')).toBeInTheDocument();
  });

  it('deve renderizar botão Sair', () => {
    render(<Header />);
    expect(screen.getByText('Sair')).toBeInTheDocument();
  });

  it('deve chamar signOut ao clicar em Sair', async () => {
    const user = userEvent.setup();
    render(<Header />);
    await user.click(screen.getByText('Sair'));
    expect(mockSignOut).toHaveBeenCalledWith({ callbackUrl: '/login' });
  });
});
