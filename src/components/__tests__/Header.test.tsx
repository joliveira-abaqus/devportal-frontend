import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Header from '../Header';

const mockSignOut = vi.fn();

vi.mock('next-auth/react', () => ({
  useSession: vi.fn(() => ({ data: null, status: 'unauthenticated' })),
  signOut: (...args: unknown[]) => mockSignOut(...args),
}));

import { useSession } from 'next-auth/react';

describe('Header', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('mostra nome do usuário quando sessão existe', () => {
    (useSession as ReturnType<typeof vi.fn>).mockReturnValue({
      data: { user: { name: 'João', email: 'joao@test.com' } },
      status: 'authenticated',
    });

    render(<Header />);
    expect(screen.getByText('João')).toBeInTheDocument();
  });

  it('mostra email quando nome não existe', () => {
    (useSession as ReturnType<typeof vi.fn>).mockReturnValue({
      data: { user: { name: null, email: 'joao@test.com' } },
      status: 'authenticated',
    });

    render(<Header />);
    expect(screen.getByText('joao@test.com')).toBeInTheDocument();
  });

  it('não mostra informações de usuário quando sessão não existe', () => {
    (useSession as ReturnType<typeof vi.fn>).mockReturnValue({
      data: null,
      status: 'unauthenticated',
    });

    render(<Header />);
    expect(screen.queryByText('João')).not.toBeInTheDocument();
  });

  it('botão "Sair" chama signOut com callbackUrl /login', () => {
    (useSession as ReturnType<typeof vi.fn>).mockReturnValue({
      data: { user: { name: 'João', email: 'joao@test.com' } },
      status: 'authenticated',
    });

    render(<Header />);
    fireEvent.click(screen.getByText('Sair'));
    expect(mockSignOut).toHaveBeenCalledWith({ callbackUrl: '/login' });
  });
});
