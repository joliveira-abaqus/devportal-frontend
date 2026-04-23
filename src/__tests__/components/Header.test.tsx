import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Header from '@/components/Header';

const mockSignOut = jest.fn();

jest.mock('next-auth/react', () => ({
  useSession: jest.fn(() => ({
    data: {
      user: { name: 'João Silva', email: 'joao@test.com' },
    },
  })),
  signOut: (...args: unknown[]) => mockSignOut(...args),
}));

describe('Header', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve renderizar o título DevPortal', () => {
    render(<Header />);
    expect(screen.getByText('DevPortal')).toBeInTheDocument();
  });

  it('deve exibir o nome do usuário quando autenticado', () => {
    render(<Header />);
    expect(screen.getByText('João Silva')).toBeInTheDocument();
  });

  it('deve exibir botão de sair', () => {
    render(<Header />);
    expect(screen.getByText('Sair')).toBeInTheDocument();
  });

  it('deve chamar signOut ao clicar em Sair', async () => {
    const user = userEvent.setup();
    render(<Header />);

    await user.click(screen.getByText('Sair'));
    expect(mockSignOut).toHaveBeenCalledWith({ callbackUrl: '/login' });
  });

  it('deve exibir email quando nome não está disponível', () => {
    const { useSession } = require('next-auth/react');
    useSession.mockReturnValue({
      data: {
        user: { name: null, email: 'joao@test.com' },
      },
    });

    render(<Header />);
    expect(screen.getByText('joao@test.com')).toBeInTheDocument();
  });

  it('não deve exibir informações do usuário sem sessão', () => {
    const { useSession } = require('next-auth/react');
    useSession.mockReturnValue({ data: null });

    render(<Header />);
    expect(screen.queryByText('João Silva')).not.toBeInTheDocument();
  });
});
