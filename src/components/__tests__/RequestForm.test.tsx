import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import RequestForm from '../RequestForm';

const mockPush = vi.fn();
const mockBack = vi.fn();

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    back: mockBack,
    refresh: vi.fn(),
    replace: vi.fn(),
  }),
}));

vi.mock('@/lib/api-client', () => ({
  default: {
    post: vi.fn(),
  },
}));

import apiClient from '@/lib/api-client';

describe('RequestForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renderiza campos: título, descrição, tipo, botões', () => {
    render(<RequestForm />);
    expect(screen.getByLabelText('Título')).toBeInTheDocument();
    expect(screen.getByLabelText('Descrição')).toBeInTheDocument();
    expect(screen.getByLabelText('Tipo')).toBeInTheDocument();
    expect(screen.getByText('Criar Solicitação')).toBeInTheDocument();
    expect(screen.getByText('Cancelar')).toBeInTheDocument();
  });

  it('mostra erro quando título < 3 caracteres', async () => {
    const user = userEvent.setup();
    render(<RequestForm />);

    await user.type(screen.getByLabelText('Título'), 'AB');
    await user.type(screen.getByLabelText('Descrição'), 'Uma descrição com mais de 10 caracteres');
    await user.click(screen.getByText('Criar Solicitação'));

    await waitFor(() => {
      expect(screen.getByText('Título deve ter pelo menos 3 caracteres')).toBeInTheDocument();
    });
  });

  it('mostra erro quando descrição < 10 caracteres', async () => {
    const user = userEvent.setup();
    render(<RequestForm />);

    await user.type(screen.getByLabelText('Título'), 'Título válido');
    await user.type(screen.getByLabelText('Descrição'), 'Curta');
    await user.click(screen.getByText('Criar Solicitação'));

    await waitFor(() => {
      expect(screen.getByText('Descrição deve ter pelo menos 10 caracteres')).toBeInTheDocument();
    });
  });

  it('submit com sucesso chama apiClient.post e redireciona', async () => {
    (apiClient.post as ReturnType<typeof vi.fn>).mockResolvedValue({
      data: { data: { id: 'new-req-1' } },
    });

    const user = userEvent.setup();
    render(<RequestForm />);

    await user.type(screen.getByLabelText('Título'), 'Novo bug report');
    await user.type(screen.getByLabelText('Descrição'), 'Descrição detalhada do bug encontrado');
    await user.click(screen.getByText('Criar Solicitação'));

    await waitFor(() => {
      expect(apiClient.post).toHaveBeenCalledWith('/requests', {
        title: 'Novo bug report',
        description: 'Descrição detalhada do bug encontrado',
        type: 'feature',
      });
      expect(mockPush).toHaveBeenCalledWith('/requests/new-req-1');
    });
  });

  it('submit com sucesso sem wrapper data', async () => {
    (apiClient.post as ReturnType<typeof vi.fn>).mockResolvedValue({
      data: { id: 'new-req-2' },
    });

    const user = userEvent.setup();
    render(<RequestForm />);

    await user.type(screen.getByLabelText('Título'), 'Novo bug report');
    await user.type(screen.getByLabelText('Descrição'), 'Descrição detalhada do bug encontrado');
    await user.click(screen.getByText('Criar Solicitação'));

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/requests/new-req-2');
    });
  });

  it('submit com erro mostra mensagem de erro', async () => {
    (apiClient.post as ReturnType<typeof vi.fn>).mockRejectedValue(new Error('API Error'));

    const user = userEvent.setup();
    render(<RequestForm />);

    await user.type(screen.getByLabelText('Título'), 'Novo bug report');
    await user.type(screen.getByLabelText('Descrição'), 'Descrição detalhada do bug encontrado');
    await user.click(screen.getByText('Criar Solicitação'));

    await waitFor(() => {
      expect(screen.getByText('Erro ao criar solicitação. Tente novamente.')).toBeInTheDocument();
    });
  });

  it('botão cancelar chama router.back()', async () => {
    render(<RequestForm />);
    fireEvent.click(screen.getByText('Cancelar'));
    expect(mockBack).toHaveBeenCalled();
  });
});
