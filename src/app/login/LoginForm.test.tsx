import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LoginPage from './page';

const mockPush = vi.fn();
const mockRefresh = vi.fn();

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
  signIn: vi.fn().mockResolvedValue({ error: null }),
}));

// Mock fetch global para chamada à API de login
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe('LoginPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockFetch.mockReset();
  });

  it('deve renderizar o formulário de login', () => {
    render(<LoginPage />);
    expect(screen.getByText('DevPortal')).toBeInTheDocument();
    expect(screen.getByText('Faça login para acessar o portal')).toBeInTheDocument();
  });

  it('deve renderizar campos de email e senha', () => {
    render(<LoginPage />);
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Senha')).toBeInTheDocument();
  });

  it('deve renderizar botão Entrar', () => {
    render(<LoginPage />);
    expect(screen.getByRole('button', { name: 'Entrar' })).toBeInTheDocument();
  });

  it('deve ter link para registro', () => {
    render(<LoginPage />);
    expect(screen.getByText('Registre-se')).toBeInTheDocument();
  });

  it('deve exibir erro de email inválido', async () => {
    const user = userEvent.setup();
    render(<LoginPage />);

    await user.type(screen.getByLabelText('Email'), 'invalido');
    await user.type(screen.getByLabelText('Senha'), 'senha123');

    // Usar fireEvent.submit para contornar validação nativa do type="email" no jsdom
    const form = screen.getByRole('button', { name: 'Entrar' }).closest('form')!;
    fireEvent.submit(form);

    await waitFor(() => {
      expect(screen.getByText('Email inválido')).toBeInTheDocument();
    });
  });

  it('deve exibir erro de senha obrigatória', async () => {
    const user = userEvent.setup();
    render(<LoginPage />);

    await user.type(screen.getByLabelText('Email'), 'dev@devportal.local');
    await user.click(screen.getByRole('button', { name: 'Entrar' }));

    await waitFor(() => {
      expect(screen.getByText('Senha é obrigatória')).toBeInTheDocument();
    });
  });

  it('deve exibir erro quando credenciais são inválidas', async () => {
    const user = userEvent.setup();
    mockFetch.mockResolvedValue({ ok: false });

    render(<LoginPage />);

    await user.type(screen.getByLabelText('Email'), 'dev@devportal.local');
    await user.type(screen.getByLabelText('Senha'), 'senhaerrada');
    await user.click(screen.getByRole('button', { name: 'Entrar' }));

    await waitFor(() => {
      expect(screen.getByText('Email ou senha inválidos')).toBeInTheDocument();
    });
  });

  it('deve redirecionar para dashboard após login bem-sucedido', async () => {
    const user = userEvent.setup();
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ data: { id: '1', email: 'dev@devportal.local', name: 'Dev' } }),
    });

    render(<LoginPage />);

    await user.type(screen.getByLabelText('Email'), 'dev@devportal.local');
    await user.type(screen.getByLabelText('Senha'), 'DevPortal123!');
    await user.click(screen.getByRole('button', { name: 'Entrar' }));

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/dashboard');
    });
  });
});
