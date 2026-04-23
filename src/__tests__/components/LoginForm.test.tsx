import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LoginPage from '@/app/login/page';

const mockPush = jest.fn();
const mockRefresh = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush, refresh: mockRefresh }),
  useSearchParams: () => ({
    get: jest.fn(() => null),
  }),
}));

jest.mock('next-auth/react', () => ({
  signIn: jest.fn(() => Promise.resolve({ error: null })),
}));

jest.mock('next/link', () => {
  const MockLink = ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  );
  MockLink.displayName = 'MockLink';
  return MockLink;
});

jest.mock('lucide-react', () => {
  const MockFileText = () => <svg data-testid="file-text-icon" />;
  MockFileText.displayName = 'MockFileText';
  return { FileText: MockFileText };
});

describe('LoginPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch = jest.fn();
  });

  it('deve renderizar o título DevPortal', () => {
    render(<LoginPage />);
    expect(screen.getByText('DevPortal')).toBeInTheDocument();
  });

  it('deve renderizar o campo de email', () => {
    render(<LoginPage />);
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
  });

  it('deve renderizar o campo de senha', () => {
    render(<LoginPage />);
    expect(screen.getByLabelText('Senha')).toBeInTheDocument();
  });

  it('deve renderizar o botão Entrar', () => {
    render(<LoginPage />);
    expect(screen.getByRole('button', { name: 'Entrar' })).toBeInTheDocument();
  });

  it('deve renderizar link para registro', () => {
    render(<LoginPage />);
    const link = screen.getByRole('link', { name: 'Registre-se' });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/register');
  });

  it('deve validar formato de email com Zod', () => {
    const { z } = require('zod');
    const loginSchema = z.object({
      email: z.string().email('Email inválido'),
      password: z.string().min(1, 'Senha é obrigatória'),
    });

    const result = loginSchema.safeParse({ email: 'invalido', password: 'qualquersenha' });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('Email inválido');
    }
  });

  it('deve exibir erro de validação para senha vazia', async () => {
    const user = userEvent.setup();
    render(<LoginPage />);

    await user.type(screen.getByLabelText('Email'), 'teste@email.com');
    await user.click(screen.getByRole('button', { name: 'Entrar' }));

    await waitFor(() => {
      expect(screen.getByText('Senha é obrigatória')).toBeInTheDocument();
    });
  });

  it('deve exibir erros de validação com ambos campos vazios', async () => {
    const user = userEvent.setup();
    render(<LoginPage />);

    await user.click(screen.getByRole('button', { name: 'Entrar' }));

    await waitFor(() => {
      expect(screen.getByText('Email inválido')).toBeInTheDocument();
      expect(screen.getByText('Senha é obrigatória')).toBeInTheDocument();
    });
  });

  it('deve chamar fetch com dados corretos ao submeter', async () => {
    const user = userEvent.setup();
    (global.fetch as jest.Mock).mockResolvedValue({ ok: true });

    render(<LoginPage />);

    await user.type(screen.getByLabelText('Email'), 'teste@email.com');
    await user.type(screen.getByLabelText('Senha'), 'senha123');
    await user.click(screen.getByRole('button', { name: 'Entrar' }));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/auth/login'),
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({ email: 'teste@email.com', password: 'senha123' }),
        }),
      );
    });
  });

  it('deve exibir erro com credenciais inválidas', async () => {
    const user = userEvent.setup();
    (global.fetch as jest.Mock).mockResolvedValue({ ok: false });

    render(<LoginPage />);

    await user.type(screen.getByLabelText('Email'), 'teste@email.com');
    await user.type(screen.getByLabelText('Senha'), 'senhaerrada');
    await user.click(screen.getByRole('button', { name: 'Entrar' }));

    await waitFor(() => {
      expect(screen.getByText('Email ou senha inválidos')).toBeInTheDocument();
    });
  });

  it('deve redirecionar para dashboard após login bem-sucedido', async () => {
    const user = userEvent.setup();
    (global.fetch as jest.Mock).mockResolvedValue({ ok: true });

    render(<LoginPage />);

    await user.type(screen.getByLabelText('Email'), 'teste@email.com');
    await user.type(screen.getByLabelText('Senha'), 'senha123');
    await user.click(screen.getByRole('button', { name: 'Entrar' }));

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/dashboard');
    });
  });
});
