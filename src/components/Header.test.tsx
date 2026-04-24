import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Header from './Header';

const mockSignOut = vi.fn();

vi.mock('next-auth/react', () => ({
  useSession: () => ({
    data: {
      user: { name: 'João Silva', email: 'joao@email.com' },
    },
  }),
  signOut: (...args: unknown[]) => mockSignOut(...args),
}));

describe('Header', () => {
  it('renderiza título DevPortal', () => {
    render(<Header />);
    expect(screen.getByText('DevPortal')).toBeInTheDocument();
  });

  it('exibe nome do usuário logado', () => {
    render(<Header />);
    expect(screen.getByText('João Silva')).toBeInTheDocument();
  });

  it('renderiza botão de sair', () => {
    render(<Header />);
    expect(screen.getByText('Sair')).toBeInTheDocument();
  });

  it('chama signOut ao clicar em Sair', async () => {
    const user = userEvent.setup();
    render(<Header />);
    await user.click(screen.getByText('Sair'));
    expect(mockSignOut).toHaveBeenCalledWith({ callbackUrl: '/login' });
  });
});
