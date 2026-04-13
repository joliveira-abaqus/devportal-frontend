import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import RequestForm from '../RequestForm';

const mockPush = vi.fn();
const mockBack = vi.fn();

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    back: mockBack,
  }),
}));

vi.mock('@/lib/api-client', () => ({
  default: {
    post: vi.fn(),
  },
}));

describe('RequestForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renderiza campos de título, descrição e tipo', () => {
    render(<RequestForm />);
    expect(screen.getByLabelText('Título')).toBeInTheDocument();
    expect(screen.getByLabelText('Descrição')).toBeInTheDocument();
    expect(screen.getByLabelText('Tipo')).toBeInTheDocument();
  });

  it('exibe erros de validação quando submetido vazio', async () => {
    const user = userEvent.setup();
    render(<RequestForm />);

    const submitButton = screen.getByRole('button', { name: 'Criar Solicitação' });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/Título deve ter pelo menos 3 caracteres/)).toBeInTheDocument();
    });
  });

  it('chama apiClient.post com dados corretos ao submeter formulário válido', async () => {
    const { default: apiClient } = await import('@/lib/api-client');
    (apiClient.post as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      data: { data: { id: 'new-req-1' } },
    });

    const user = userEvent.setup();
    render(<RequestForm />);

    await user.type(screen.getByLabelText('Título'), 'Novo bug report');
    await user.type(screen.getByLabelText('Descrição'), 'Descrição detalhada do bug encontrado no sistema');

    const submitButton = screen.getByRole('button', { name: 'Criar Solicitação' });
    await user.click(submitButton);

    await waitFor(() => {
      expect(apiClient.post).toHaveBeenCalledWith('/requests', {
        title: 'Novo bug report',
        description: 'Descrição detalhada do bug encontrado no sistema',
        type: 'feature',
      });
    });
  });

  it('exibe mensagem de erro quando API falha', async () => {
    const { default: apiClient } = await import('@/lib/api-client');
    (apiClient.post as ReturnType<typeof vi.fn>).mockRejectedValueOnce(new Error('API Error'));

    const user = userEvent.setup();
    render(<RequestForm />);

    await user.type(screen.getByLabelText('Título'), 'Bug report');
    await user.type(screen.getByLabelText('Descrição'), 'Descrição detalhada do bug encontrado no sistema');

    const submitButton = screen.getByRole('button', { name: 'Criar Solicitação' });
    await user.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText('Erro ao criar solicitação. Tente novamente.'),
      ).toBeInTheDocument();
    });
  });

  it('redireciona para /requests/{id} após criação com sucesso', async () => {
    const { default: apiClient } = await import('@/lib/api-client');
    (apiClient.post as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      data: { data: { id: 'created-123' } },
    });

    const user = userEvent.setup();
    render(<RequestForm />);

    await user.type(screen.getByLabelText('Título'), 'Nova feature');
    await user.type(screen.getByLabelText('Descrição'), 'Descrição detalhada da nova feature request');

    const submitButton = screen.getByRole('button', { name: 'Criar Solicitação' });
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/requests/created-123');
    });
  });
});
