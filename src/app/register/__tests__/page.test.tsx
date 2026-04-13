import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import RegisterPage from '../page';

const mockPush = vi.fn();

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    back: vi.fn(),
    refresh: vi.fn(),
    replace: vi.fn(),
  }),
}));

vi.mock('@/lib/api-client', () => ({
  default: {
    post: vi.fn(),
  },
}));

vi.mock('next/link', () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));

import apiClient from '@/lib/api-client';

describe('RegisterPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renderiza campos: nome, email, senha, confirmar senha', () => {
    render(<RegisterPage />);
    expect(screen.getByLabelText('Nome')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Senha')).toBeInTheDocument();
    expect(screen.getByLabelText('Confirmar Senha')).toBeInTheDocument();
    const submitButton = screen.getByRole('button', { name: 'Criar Conta' });
    expect(submitButton).toBeInTheDocument();
  });

  it('mostra erro quando nome < 2 caracteres', async () => {
    const user = userEvent.setup();
    render(<RegisterPage />);

    await user.type(screen.getByLabelText('Nome'), 'A');
    await user.type(screen.getByLabelText('Email'), 'test@test.com');
    await user.type(screen.getByLabelText('Senha'), 'password123');
    await user.type(screen.getByLabelText('Confirmar Senha'), 'password123');
    await user.click(screen.getByRole('button', { name: 'Criar Conta' }));

    await waitFor(() => {
      expect(screen.getByText('Nome deve ter pelo menos 2 caracteres')).toBeInTheDocument();
    });
  });

  it('mostra erro quando email inválido', async () => {
    const user = userEvent.setup();
    render(<RegisterPage />);

    await user.type(screen.getByLabelText('Nome'), 'Test');
    // Submeter sem email para acionar validação do Zod
    await user.type(screen.getByLabelText('Senha'), 'password123');
    await user.type(screen.getByLabelText('Confirmar Senha'), 'password123');
    await user.click(screen.getByRole('button', { name: 'Criar Conta' }));

    await waitFor(() => {
      expect(screen.getByText('Email inválido')).toBeInTheDocument();
    });
  });

  it('mostra erro quando senha < 8 caracteres', async () => {
    const user = userEvent.setup();
    render(<RegisterPage />);

    await user.type(screen.getByLabelText('Nome'), 'Test');
    await user.type(screen.getByLabelText('Email'), 'test@test.com');
    await user.type(screen.getByLabelText('Senha'), 'short');
    await user.type(screen.getByLabelText('Confirmar Senha'), 'short');
    await user.click(screen.getByRole('button', { name: 'Criar Conta' }));

    await waitFor(() => {
      expect(screen.getByText('Senha deve ter pelo menos 8 caracteres')).toBeInTheDocument();
    });
  });

  it('mostra erro quando senhas não coincidem', async () => {
    const user = userEvent.setup();
    render(<RegisterPage />);

    await user.type(screen.getByLabelText('Nome'), 'Test');
    await user.type(screen.getByLabelText('Email'), 'test@test.com');
    await user.type(screen.getByLabelText('Senha'), 'password123');
    await user.type(screen.getByLabelText('Confirmar Senha'), 'different123');
    await user.click(screen.getByRole('button', { name: 'Criar Conta' }));

    await waitFor(() => {
      expect(screen.getByText('Senhas não coincidem')).toBeInTheDocument();
    });
  });

  it('registro com sucesso redireciona para /login?registered=true', async () => {
    (apiClient.post as ReturnType<typeof vi.fn>).mockResolvedValue({ data: {} });

    const user = userEvent.setup();
    render(<RegisterPage />);

    await user.type(screen.getByLabelText('Nome'), 'Test User');
    await user.type(screen.getByLabelText('Email'), 'test@test.com');
    await user.type(screen.getByLabelText('Senha'), 'password123');
    await user.type(screen.getByLabelText('Confirmar Senha'), 'password123');
    await user.click(screen.getByRole('button', { name: 'Criar Conta' }));

    await waitFor(() => {
      expect(apiClient.post).toHaveBeenCalledWith('/auth/register', {
        name: 'Test User',
        email: 'test@test.com',
        password: 'password123',
      });
      expect(mockPush).toHaveBeenCalledWith('/login?registered=true');
    });
  });

  it('registro com erro mostra mensagem', async () => {
    (apiClient.post as ReturnType<typeof vi.fn>).mockRejectedValue(new Error('API Error'));

    const user = userEvent.setup();
    render(<RegisterPage />);

    await user.type(screen.getByLabelText('Nome'), 'Test User');
    await user.type(screen.getByLabelText('Email'), 'test@test.com');
    await user.type(screen.getByLabelText('Senha'), 'password123');
    await user.type(screen.getByLabelText('Confirmar Senha'), 'password123');
    await user.click(screen.getByRole('button', { name: 'Criar Conta' }));

    await waitFor(() => {
      expect(screen.getByText('Erro ao criar conta. Tente novamente.')).toBeInTheDocument();
    });
  });

  it('link para login está presente', () => {
    render(<RegisterPage />);
    const link = screen.getByText('Faça login');
    expect(link).toHaveAttribute('href', '/login');
  });
});
