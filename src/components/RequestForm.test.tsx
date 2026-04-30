import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import RequestForm from './RequestForm';

const mockPush = vi.fn();
const mockBack = vi.fn();
const mockPost = vi.fn();

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    back: mockBack,
  }),
}));

vi.mock('@/lib/api-client', () => ({
  default: {
    post: (...args: unknown[]) => mockPost(...args),
  },
}));

describe('RequestForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renderiza campos Título, Descrição e Tipo', () => {
    render(<RequestForm />);
    expect(screen.getByLabelText('Título')).toBeInTheDocument();
    expect(screen.getByLabelText('Descrição')).toBeInTheDocument();
    expect(screen.getByLabelText('Tipo')).toBeInTheDocument();
  });

  it('renderiza botão Criar Solicitação', () => {
    render(<RequestForm />);
    expect(screen.getByRole('button', { name: /criar solicitação/i })).toBeInTheDocument();
  });

  it('renderiza botão Cancelar', () => {
    render(<RequestForm />);
    expect(screen.getByRole('button', { name: /cancelar/i })).toBeInTheDocument();
  });

  it('chama router.back ao clicar em Cancelar', async () => {
    const user = userEvent.setup();
    render(<RequestForm />);

    await user.click(screen.getByRole('button', { name: /cancelar/i }));
    expect(mockBack).toHaveBeenCalled();
  });

  it('exibe erro para título curto', async () => {
    const user = userEvent.setup();
    render(<RequestForm />);

    await user.type(screen.getByLabelText('Título'), 'AB');
    await user.type(screen.getByLabelText('Descrição'), 'Uma descrição com mais de 10 caracteres');
    await user.click(screen.getByRole('button', { name: /criar solicitação/i }));

    await waitFor(() => {
      expect(screen.getByText('Título deve ter pelo menos 3 caracteres')).toBeInTheDocument();
    });
  });

  it('exibe erro para descrição curta', async () => {
    const user = userEvent.setup();
    render(<RequestForm />);

    await user.type(screen.getByLabelText('Título'), 'Título válido');
    await user.type(screen.getByLabelText('Descrição'), 'Curta');
    await user.click(screen.getByRole('button', { name: /criar solicitação/i }));

    await waitFor(() => {
      expect(screen.getByText('Descrição deve ter pelo menos 10 caracteres')).toBeInTheDocument();
    });
  });

  it('envia formulário com dados corretos e redireciona', async () => {
    const user = userEvent.setup();
    mockPost.mockResolvedValue({ data: { data: { id: 'new-123' } } });

    render(<RequestForm />);

    await user.type(screen.getByLabelText('Título'), 'Nova feature');
    await user.type(screen.getByLabelText('Descrição'), 'Implementar funcionalidade X com detalhes');
    await user.selectOptions(screen.getByLabelText('Tipo'), 'bug_fix');
    await user.click(screen.getByRole('button', { name: /criar solicitação/i }));

    await waitFor(() => {
      expect(mockPost).toHaveBeenCalledWith('/requests', {
        title: 'Nova feature',
        description: 'Implementar funcionalidade X com detalhes',
        type: 'bug_fix',
      });
      expect(mockPush).toHaveBeenCalledWith('/requests/new-123');
    });
  });

  it('exibe erro quando API falha', async () => {
    const user = userEvent.setup();
    mockPost.mockRejectedValue(new Error('Server error'));

    render(<RequestForm />);

    await user.type(screen.getByLabelText('Título'), 'Título válido');
    await user.type(screen.getByLabelText('Descrição'), 'Uma descrição com mais de 10 caracteres');
    await user.click(screen.getByRole('button', { name: /criar solicitação/i }));

    await waitFor(() => {
      expect(screen.getByText('Erro ao criar solicitação. Tente novamente.')).toBeInTheDocument();
    });
  });

  it('tipo padrão é feature', () => {
    render(<RequestForm />);
    expect(screen.getByLabelText('Tipo')).toHaveValue('feature');
  });
});
