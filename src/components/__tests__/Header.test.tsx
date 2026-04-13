import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Header from '../Header';

const mockSignOut = vi.fn();

vi.mock('next-auth/react', () => ({
  useSession: vi.fn(),
  signOut: (...args: unknown[]) => mockSignOut(...args),
}));

describe('Header', () => {
  it('exibe nome do usuário quando sessão existe', async () => {
    const { useSession } = await import('next-auth/react');
    (useSession as ReturnType<typeof vi.fn>).mockReturnValue({
      data: { user: { name: 'João Silva', email: 'joao@example.com' } },
    });

    render(<Header />);
    expect(screen.getByText('João Silva')).toBeInTheDocument();
  });

  it('exibe email quando nome não está disponível', async () => {
    const { useSession } = await import('next-auth/react');
    (useSession as ReturnType<typeof vi.fn>).mockReturnValue({
      data: { user: { name: null, email: 'joao@example.com' } },
    });

    render(<Header />);
    expect(screen.getByText('joao@example.com')).toBeInTheDocument();
  });

  it('chama signOut ao clicar em "Sair"', async () => {
    const { useSession } = await import('next-auth/react');
    (useSession as ReturnType<typeof vi.fn>).mockReturnValue({
      data: { user: { name: 'João', email: 'joao@example.com' } },
    });

    const user = userEvent.setup();
    render(<Header />);

    const logoutButton = screen.getByText('Sair').closest('button')!;
    await user.click(logoutButton);

    expect(mockSignOut).toHaveBeenCalledWith({ callbackUrl: '/login' });
  });
});
