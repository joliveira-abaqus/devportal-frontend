import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LoginPage from '../page';

const mockPush = vi.fn();
const mockRefresh = vi.fn();
const mockSignIn = vi.fn();

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    back: vi.fn(),
    refresh: mockRefresh,
    replace: vi.fn(),
  }),
  useSearchParams: () => new URLSearchParams(),
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

  it('renderiza formulário com campos email e senha', () => {
    render(<LoginPage />);
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Senha')).toBeInTheDocument();
    expect(screen.getByText('Entrar')).toBeInTheDocument();
  });

  it('mostra erro para email inválido', async () => {
    const user = userEvent.setup();
    render(<LoginPage />);

    // Submeter sem preencher email para acionar validação do Zod
    await user.type(screen.getByLabelText('Senha'), 'password123');
    await user.click(screen.getByRole('button', { name: 'Entrar' }));

    await waitFor(() => {
      expect(screen.getByText('Email inválido')).toBeInTheDocument();
    });
  });

  it('mostra erro para senha vazia', async () => {
    const user = userEvent.setup();
    render(<LoginPage />);

    await user.type(screen.getByLabelText('Email'), 'test@test.com');
    await user.click(screen.getByText('Entrar'));

    await waitFor(() => {
      expect(screen.getByText('Senha é obrigatória')).toBeInTheDocument();
    });
  });

  it('login com sucesso chama fetch + signIn e redireciona', async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ token: 'abc' }),
    });
    mockSignIn.mockResolvedValue({ error: null });

    const user = userEvent.setup();
    render(<LoginPage />);

    await user.type(screen.getByLabelText('Email'), 'test@test.com');
    await user.type(screen.getByLabelText('Senha'), 'password123');
    await user.click(screen.getByText('Entrar'));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalled();
      expect(mockSignIn).toHaveBeenCalledWith('credentials', {
        email: 'test@test.com',
        password: 'password123',
        redirect: false,
      });
      expect(mockPush).toHaveBeenCalledWith('/dashboard');
    });
  });

  it('login com erro da API mostra "Email ou senha inválidos"', async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: false,
    });

    const user = userEvent.setup();
    render(<LoginPage />);

    await user.type(screen.getByLabelText('Email'), 'test@test.com');
    await user.type(screen.getByLabelText('Senha'), 'wrong');
    await user.click(screen.getByText('Entrar'));

    await waitFor(() => {
      expect(screen.getByText('Email ou senha inválidos')).toBeInTheDocument();
    });
  });

  it('login com erro do signIn mostra mensagem de erro', async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ token: 'abc' }),
    });
    mockSignIn.mockResolvedValue({ error: 'CredentialsSignin' });

    const user = userEvent.setup();
    render(<LoginPage />);

    await user.type(screen.getByLabelText('Email'), 'test@test.com');
    await user.type(screen.getByLabelText('Senha'), 'password123');
    await user.click(screen.getByText('Entrar'));

    await waitFor(() => {
      expect(screen.getByText('Erro ao criar sessão. Tente novamente.')).toBeInTheDocument();
    });
  });

  it('login com exceção mostra mensagem genérica', async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockRejectedValue(new Error('Network'));

    const user = userEvent.setup();
    render(<LoginPage />);

    await user.type(screen.getByLabelText('Email'), 'test@test.com');
    await user.type(screen.getByLabelText('Senha'), 'password123');
    await user.click(screen.getByText('Entrar'));

    await waitFor(() => {
      expect(screen.getByText('Erro ao fazer login. Tente novamente.')).toBeInTheDocument();
    });
  });

  it('link para registro está presente', () => {
    render(<LoginPage />);
    const link = screen.getByText('Registre-se');
    expect(link).toHaveAttribute('href', '/register');
  });

  it('renderiza título DevPortal', () => {
    render(<LoginPage />);
    expect(screen.getByText('DevPortal')).toBeInTheDocument();
  });
});
