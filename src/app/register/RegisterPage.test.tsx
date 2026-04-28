import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import RegisterPage from './page';

const mockPush = vi.fn();

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

vi.mock('@/lib/api-client', () => ({
  default: {
    post: vi.fn().mockResolvedValue({ data: { data: { id: '2' } } }),
  },
}));

describe('RegisterPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('deve renderizar o formulário de registro', () => {
    render(<RegisterPage />);
    expect(screen.getByRole('heading', { name: 'Criar Conta' })).toBeInTheDocument();
    expect(screen.getByText('Registre-se no DevPortal')).toBeInTheDocument();
  });

  it('deve renderizar campos Nome, Email, Senha e Confirmar Senha', () => {
    render(<RegisterPage />);
    expect(screen.getByLabelText('Nome')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Senha')).toBeInTheDocument();
    expect(screen.getByLabelText('Confirmar Senha')).toBeInTheDocument();
  });

  it('deve renderizar botão Criar Conta', () => {
    render(<RegisterPage />);
    expect(screen.getByRole('button', { name: 'Criar Conta' })).toBeInTheDocument();
  });

  it('deve ter link para login', () => {
    render(<RegisterPage />);
    expect(screen.getByText('Faça login')).toBeInTheDocument();
  });

  it('deve exibir erro de nome curto', async () => {
    const user = userEvent.setup();
    render(<RegisterPage />);

    await user.type(screen.getByLabelText('Nome'), 'A');
    await user.type(screen.getByLabelText('Email'), 'dev@devportal.local');
    await user.type(screen.getByLabelText('Senha'), 'DevPortal123!');
    await user.type(screen.getByLabelText('Confirmar Senha'), 'DevPortal123!');
    await user.click(screen.getByRole('button', { name: 'Criar Conta' }));

    await waitFor(() => {
      expect(screen.getByText('Nome deve ter pelo menos 2 caracteres')).toBeInTheDocument();
    });
  });

  it('deve exibir erro de senha curta', async () => {
    const user = userEvent.setup();
    render(<RegisterPage />);

    await user.type(screen.getByLabelText('Nome'), 'Dev User');
    await user.type(screen.getByLabelText('Email'), 'dev@devportal.local');
    await user.type(screen.getByLabelText('Senha'), '1234567');
    await user.type(screen.getByLabelText('Confirmar Senha'), '1234567');
    await user.click(screen.getByRole('button', { name: 'Criar Conta' }));

    await waitFor(() => {
      expect(screen.getByText('Senha deve ter pelo menos 8 caracteres')).toBeInTheDocument();
    });
  });

  it('deve exibir erro quando senhas não coincidem', async () => {
    const user = userEvent.setup();
    render(<RegisterPage />);

    await user.type(screen.getByLabelText('Nome'), 'Dev User');
    await user.type(screen.getByLabelText('Email'), 'dev@devportal.local');
    await user.type(screen.getByLabelText('Senha'), 'DevPortal123!');
    await user.type(screen.getByLabelText('Confirmar Senha'), 'OutraSenha99!');
    await user.click(screen.getByRole('button', { name: 'Criar Conta' }));

    await waitFor(() => {
      expect(screen.getByText('Senhas não coincidem')).toBeInTheDocument();
    });
  });

  it('deve redirecionar para login após registro bem-sucedido', async () => {
    const user = userEvent.setup();
    render(<RegisterPage />);

    await user.type(screen.getByLabelText('Nome'), 'Dev User');
    await user.type(screen.getByLabelText('Email'), 'novo@devportal.local');
    await user.type(screen.getByLabelText('Senha'), 'DevPortal123!');
    await user.type(screen.getByLabelText('Confirmar Senha'), 'DevPortal123!');
    await user.click(screen.getByRole('button', { name: 'Criar Conta' }));

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/login?registered=true');
    });
  });
});
