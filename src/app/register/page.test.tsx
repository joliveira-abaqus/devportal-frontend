import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import RegisterPage from './page';

const mockPush = vi.fn();
const mockPost = vi.fn();

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

vi.mock('@/lib/api-client', () => ({
  default: {
    post: (...args: unknown[]) => mockPost(...args),
  },
}));

vi.mock('next/link', () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));

describe('RegisterPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renderiza título "Criar Conta"', () => {
    render(<RegisterPage />);
    expect(screen.getByRole('heading', { name: /criar conta/i })).toBeInTheDocument();
  });

  it('renderiza campos Nome, Email, Senha e Confirmar Senha', () => {
    render(<RegisterPage />);
    expect(screen.getByLabelText('Nome')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Senha')).toBeInTheDocument();
    expect(screen.getByLabelText('Confirmar Senha')).toBeInTheDocument();
  });

  it('renderiza botão Criar Conta', () => {
    render(<RegisterPage />);
    expect(screen.getByRole('button', { name: /criar conta/i })).toBeInTheDocument();
  });

  it('renderiza link para login', () => {
    render(<RegisterPage />);
    expect(screen.getByRole('link', { name: /faça login/i })).toHaveAttribute('href', '/login');
  });

  it('exibe erro para nome curto', async () => {
    const user = userEvent.setup();
    render(<RegisterPage />);

    await user.type(screen.getByLabelText('Nome'), 'A');
    await user.type(screen.getByLabelText('Email'), 'teste@email.com');
    await user.type(screen.getByLabelText('Senha'), '12345678');
    await user.type(screen.getByLabelText('Confirmar Senha'), '12345678');
    await user.click(screen.getByRole('button', { name: /criar conta/i }));

    await waitFor(() => {
      expect(screen.getByText('Nome deve ter pelo menos 2 caracteres')).toBeInTheDocument();
    });
  });

  it('exibe erro para senha curta', async () => {
    const user = userEvent.setup();
    render(<RegisterPage />);

    await user.type(screen.getByLabelText('Nome'), 'João');
    await user.type(screen.getByLabelText('Email'), 'teste@email.com');
    await user.type(screen.getByLabelText('Senha'), '123');
    await user.type(screen.getByLabelText('Confirmar Senha'), '123');
    await user.click(screen.getByRole('button', { name: /criar conta/i }));

    await waitFor(() => {
      expect(screen.getByText('Senha deve ter pelo menos 8 caracteres')).toBeInTheDocument();
    });
  });

  it('exibe erro quando senhas não coincidem', async () => {
    const user = userEvent.setup();
    render(<RegisterPage />);

    await user.type(screen.getByLabelText('Nome'), 'João');
    await user.type(screen.getByLabelText('Email'), 'teste@email.com');
    await user.type(screen.getByLabelText('Senha'), '12345678');
    await user.type(screen.getByLabelText('Confirmar Senha'), '87654321');
    await user.click(screen.getByRole('button', { name: /criar conta/i }));

    await waitFor(() => {
      expect(screen.getByText('Senhas não coincidem')).toBeInTheDocument();
    });
  });

  it('redireciona para /login após registro com sucesso', async () => {
    const user = userEvent.setup();
    mockPost.mockResolvedValue({ data: { id: '1' } });

    render(<RegisterPage />);

    await user.type(screen.getByLabelText('Nome'), 'João');
    await user.type(screen.getByLabelText('Email'), 'joao@email.com');
    await user.type(screen.getByLabelText('Senha'), 'senha12345');
    await user.type(screen.getByLabelText('Confirmar Senha'), 'senha12345');
    await user.click(screen.getByRole('button', { name: /criar conta/i }));

    await waitFor(() => {
      expect(mockPost).toHaveBeenCalledWith('/auth/register', {
        name: 'João',
        email: 'joao@email.com',
        password: 'senha12345',
      });
      expect(mockPush).toHaveBeenCalledWith('/login?registered=true');
    });
  });

  it('exibe erro quando API falha', async () => {
    const user = userEvent.setup();
    mockPost.mockRejectedValue(new Error('Server error'));

    render(<RegisterPage />);

    await user.type(screen.getByLabelText('Nome'), 'João');
    await user.type(screen.getByLabelText('Email'), 'joao@email.com');
    await user.type(screen.getByLabelText('Senha'), 'senha12345');
    await user.type(screen.getByLabelText('Confirmar Senha'), 'senha12345');
    await user.click(screen.getByRole('button', { name: /criar conta/i }));

    await waitFor(() => {
      expect(screen.getByText('Erro ao criar conta. Tente novamente.')).toBeInTheDocument();
    });
  });
});
