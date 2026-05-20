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

import apiClient from '@/lib/api-client';

describe('RequestForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('exibe erro de validação quando título tem menos de 3 caracteres', async () => {
    const user = userEvent.setup();
    render(<RequestForm />);

    await user.type(screen.getByLabelText('Título'), 'ab');
    await user.type(screen.getByLabelText('Descrição'), 'Uma descrição com mais de dez caracteres');
    await user.click(screen.getByRole('button', { name: 'Criar Solicitação' }));

    await waitFor(() => {
      expect(screen.getByText('Título deve ter pelo menos 3 caracteres')).toBeInTheDocument();
    });
  });

  it('exibe erro de validação quando descrição tem menos de 10 caracteres', async () => {
    const user = userEvent.setup();
    render(<RequestForm />);

    await user.type(screen.getByLabelText('Título'), 'Título válido');
    await user.type(screen.getByLabelText('Descrição'), 'Curta');
    await user.click(screen.getByRole('button', { name: 'Criar Solicitação' }));

    await waitFor(() => {
      expect(screen.getByText('Descrição deve ter pelo menos 10 caracteres')).toBeInTheDocument();
    });
  });

  it('chama o handler com dados corretos ao submeter formulário válido', async () => {
    const user = userEvent.setup();
    vi.mocked(apiClient.post).mockResolvedValue({
      data: { data: { id: 'req-123' } },
    });

    render(<RequestForm />);

    await user.type(screen.getByLabelText('Título'), 'Correção de bug');
    await user.type(screen.getByLabelText('Descrição'), 'Descrição detalhada do problema encontrado');
    await user.selectOptions(screen.getByLabelText('Tipo'), 'bug_fix');
    await user.click(screen.getByRole('button', { name: 'Criar Solicitação' }));

    await waitFor(() => {
      expect(apiClient.post).toHaveBeenCalledWith('/requests', {
        title: 'Correção de bug',
        description: 'Descrição detalhada do problema encontrado',
        type: 'bug_fix',
      });
    });

    expect(mockPush).toHaveBeenCalledWith('/requests/req-123');
  });

  it('exibe mensagem de erro quando o submit falha', async () => {
    const user = userEvent.setup();
    vi.mocked(apiClient.post).mockRejectedValue(new Error('Network error'));

    render(<RequestForm />);

    await user.type(screen.getByLabelText('Título'), 'Título válido');
    await user.type(screen.getByLabelText('Descrição'), 'Descrição válida com mais de dez caracteres');
    await user.click(screen.getByRole('button', { name: 'Criar Solicitação' }));

    await waitFor(() => {
      expect(screen.getByText('Erro ao criar solicitação. Tente novamente.')).toBeInTheDocument();
    });
  });
});
