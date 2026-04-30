import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LoginPage from './page';

const mockPush = vi.fn();
const mockRefresh = vi.fn();
const mockSignIn = vi.fn();

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    refresh: mockRefresh,
  }),
  useSearchParams: () => ({
    get: () => null,
  }),
}));

vi.mock('next-auth/react', () => ({
  signIn: (...args: unknown[]) => mockSignIn(...args),
}));

vi.mock('next/link', () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));

describe('LoginPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = vi.fn();
  });

  it('renderiza campos de email e senha', () => {
    render(<LoginPage />);
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Senha')).toBeInTheDocument();
  });

  it('renderiza botão Entrar', () => {
    render(<LoginPage />);
    expect(screen.getByRole('button', { name: /entrar/i })).toBeInTheDocument();
  });

  it('renderiza link para registro', () => {
    render(<LoginPage />);
    expect(screen.getByRole('link', { name: /registre-se/i })).toHaveAttribute('href', '/register');
  });

  it('exibe erro de validação para email inválido', async () => {
    const user = userEvent.setup();
    render(<LoginPage />);

    const emailInput = screen.getByLabelText('Email');
    await user.type(emailInput, 'invalido');
    await user.type(screen.getByLabelText('Senha'), 'senha123');

    // fireEvent.submit ignora a validação nativa do HTML5 (type="email")
    const form = emailInput.closest('form')!;
    fireEvent.submit(form);

    await waitFor(() => {
      expect(screen.getByText(/email inválido/i)).toBeInTheDocument();
    });
  });

  it('exibe erro de validação para senha vazia', async () => {
    const user = userEvent.setup();
    render(<LoginPage />);

    await user.type(screen.getByLabelText('Email'), 'teste@email.com');
    await user.click(screen.getByRole('button', { name: /entrar/i }));

    await waitFor(() => {
      expect(screen.getByText('Senha é obrigatória')).toBeInTheDocument();
    });
  });

  it('exibe erro "Email ou senha inválidos" quando API retorna erro', async () => {
    const user = userEvent.setup();
    vi.mocked(global.fetch).mockResolvedValue({ ok: false } as Response);

    render(<LoginPage />);

    await user.type(screen.getByLabelText('Email'), 'teste@email.com');
    await user.type(screen.getByLabelText('Senha'), 'senha123');
    await user.click(screen.getByRole('button', { name: /entrar/i }));

    await waitFor(() => {
      expect(screen.getByText('Email ou senha inválidos')).toBeInTheDocument();
    });
  });

  it('redireciona para dashboard após login com sucesso', async () => {
    const user = userEvent.setup();
    vi.mocked(global.fetch).mockResolvedValue({ ok: true } as Response);
    mockSignIn.mockResolvedValue({ error: null });

    render(<LoginPage />);

    await user.type(screen.getByLabelText('Email'), 'teste@email.com');
    await user.type(screen.getByLabelText('Senha'), 'senha123');
    await user.click(screen.getByRole('button', { name: /entrar/i }));

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/dashboard');
    });
  });

  it('exibe erro quando signIn falha', async () => {
    const user = userEvent.setup();
    vi.mocked(global.fetch).mockResolvedValue({ ok: true } as Response);
    mockSignIn.mockResolvedValue({ error: 'CredentialsSignin' });

    render(<LoginPage />);

    await user.type(screen.getByLabelText('Email'), 'teste@email.com');
    await user.type(screen.getByLabelText('Senha'), 'senha123');
    await user.click(screen.getByRole('button', { name: /entrar/i }));

    await waitFor(() => {
      expect(screen.getByText('Erro ao criar sessão. Tente novamente.')).toBeInTheDocument();
    });
  });
});
