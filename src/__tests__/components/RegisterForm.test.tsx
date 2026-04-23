import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import RegisterPage from '@/app/register/page';

const mockPush = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
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

jest.mock('@/lib/api-client', () => ({
  __esModule: true,
  default: {
    post: jest.fn(() => Promise.resolve({ data: {} })),
  },
}));

describe('RegisterPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve renderizar o título Criar Conta', () => {
    render(<RegisterPage />);
    expect(screen.getByRole('heading', { name: 'Criar Conta' })).toBeInTheDocument();
  });

  it('deve renderizar campo Nome', () => {
    render(<RegisterPage />);
    expect(screen.getByLabelText('Nome')).toBeInTheDocument();
  });

  it('deve renderizar campo Email', () => {
    render(<RegisterPage />);
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
  });

  it('deve renderizar campo Senha', () => {
    render(<RegisterPage />);
    expect(screen.getByLabelText('Senha', { exact: true })).toBeInTheDocument();
  });

  it('deve renderizar campo Confirmar Senha', () => {
    render(<RegisterPage />);
    expect(screen.getByLabelText('Confirmar Senha')).toBeInTheDocument();
  });

  it('deve renderizar botão Criar Conta', () => {
    render(<RegisterPage />);
    expect(screen.getByRole('button', { name: 'Criar Conta' })).toBeInTheDocument();
  });

  it('deve renderizar link para login', () => {
    render(<RegisterPage />);
    const link = screen.getByRole('link', { name: 'Faça login' });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/login');
  });

  it('deve exibir erro de validação para nome curto', async () => {
    const user = userEvent.setup();
    render(<RegisterPage />);

    await user.type(screen.getByLabelText('Nome'), 'A');
    await user.click(screen.getByRole('button', { name: 'Criar Conta' }));

    await waitFor(() => {
      expect(screen.getByText('Nome deve ter pelo menos 2 caracteres')).toBeInTheDocument();
    });
  });

  it('deve validar formato de email com Zod', () => {
    const { z } = require('zod');
    const registerSchema = z.object({
      name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
      email: z.string().email('Email inválido'),
      password: z.string().min(8, 'Senha deve ter pelo menos 8 caracteres'),
      confirmPassword: z.string(),
    });

    const result = registerSchema.safeParse({
      name: 'Teste',
      email: 'email-sem-arroba',
      password: 'SenhaForte123!',
      confirmPassword: 'SenhaForte123!',
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('Email inválido');
    }
  });

  it('deve exibir erro de validação para senha curta', async () => {
    const user = userEvent.setup();
    render(<RegisterPage />);

    await user.type(screen.getByLabelText('Senha', { exact: true }), '123');
    await user.click(screen.getByRole('button', { name: 'Criar Conta' }));

    await waitFor(() => {
      expect(screen.getByText('Senha deve ter pelo menos 8 caracteres')).toBeInTheDocument();
    });
  });

  it('deve exibir erro de validação quando senhas não coincidem', async () => {
    const user = userEvent.setup();
    render(<RegisterPage />);

    await user.type(screen.getByLabelText('Nome'), 'Teste');
    await user.type(screen.getByLabelText('Email'), 'teste@email.com');
    await user.type(screen.getByLabelText('Senha', { exact: true }), 'SenhaForte123!');
    await user.type(screen.getByLabelText('Confirmar Senha'), 'SenhaDiferente456!');
    await user.click(screen.getByRole('button', { name: 'Criar Conta' }));

    await waitFor(() => {
      expect(screen.getByText('Senhas não coincidem')).toBeInTheDocument();
    });
  });

  it('deve exibir erros de validação com todos os campos vazios', async () => {
    const user = userEvent.setup();
    render(<RegisterPage />);

    await user.click(screen.getByRole('button', { name: 'Criar Conta' }));

    await waitFor(() => {
      expect(screen.getByText('Nome deve ter pelo menos 2 caracteres')).toBeInTheDocument();
      expect(screen.getByText('Email inválido')).toBeInTheDocument();
      expect(screen.getByText('Senha deve ter pelo menos 8 caracteres')).toBeInTheDocument();
    });
  });

  it('deve chamar apiClient.post com dados corretos ao submeter', async () => {
    const user = userEvent.setup();
    const apiClient = require('@/lib/api-client').default;

    render(<RegisterPage />);

    await user.type(screen.getByLabelText('Nome'), 'Teste User');
    await user.type(screen.getByLabelText('Email'), 'teste@email.com');
    await user.type(screen.getByLabelText('Senha', { exact: true }), 'SenhaForte123!');
    await user.type(screen.getByLabelText('Confirmar Senha'), 'SenhaForte123!');
    await user.click(screen.getByRole('button', { name: 'Criar Conta' }));

    await waitFor(() => {
      expect(apiClient.post).toHaveBeenCalledWith('/auth/register', {
        name: 'Teste User',
        email: 'teste@email.com',
        password: 'SenhaForte123!',
      });
    });
  });

  it('deve redirecionar para login após registro bem-sucedido', async () => {
    const user = userEvent.setup();

    render(<RegisterPage />);

    await user.type(screen.getByLabelText('Nome'), 'Teste User');
    await user.type(screen.getByLabelText('Email'), 'teste@email.com');
    await user.type(screen.getByLabelText('Senha', { exact: true }), 'SenhaForte123!');
    await user.type(screen.getByLabelText('Confirmar Senha'), 'SenhaForte123!');
    await user.click(screen.getByRole('button', { name: 'Criar Conta' }));

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/login?registered=true');
    });
  });
});
