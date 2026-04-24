import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import RequestForm from './RequestForm';

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

  it('renderiza campos do formulário', () => {
    render(<RequestForm />);
    expect(screen.getByLabelText('Título')).toBeInTheDocument();
    expect(screen.getByLabelText('Descrição')).toBeInTheDocument();
    expect(screen.getByLabelText('Tipo')).toBeInTheDocument();
  });

  it('renderiza botões de ação', () => {
    render(<RequestForm />);
    expect(screen.getByText('Criar Solicitação')).toBeInTheDocument();
    expect(screen.getByText('Cancelar')).toBeInTheDocument();
  });

  it('navega para trás ao clicar em Cancelar', async () => {
    const user = userEvent.setup();
    render(<RequestForm />);
    await user.click(screen.getByText('Cancelar'));
    expect(mockBack).toHaveBeenCalled();
  });

  it('exibe erros de validação para campos vazios', async () => {
    const user = userEvent.setup();
    render(<RequestForm />);
    await user.click(screen.getByText('Criar Solicitação'));

    await waitFor(() => {
      expect(screen.getByText('Título deve ter pelo menos 3 caracteres')).toBeInTheDocument();
    });
  });

  it('exibe erro de validação para descrição curta', async () => {
    const user = userEvent.setup();
    render(<RequestForm />);

    await user.type(screen.getByLabelText('Título'), 'Meu título');
    await user.type(screen.getByLabelText('Descrição'), 'Curta');
    await user.click(screen.getByText('Criar Solicitação'));

    await waitFor(() => {
      expect(screen.getByText('Descrição deve ter pelo menos 10 caracteres')).toBeInTheDocument();
    });
  });

  it('envia dados e redireciona ao submeter com sucesso', async () => {
    const user = userEvent.setup();
    vi.mocked(apiClient.post).mockResolvedValueOnce({
      data: { data: { id: 'req-novo' } },
    });

    render(<RequestForm />);

    await user.type(screen.getByLabelText('Título'), 'Nova feature');
    await user.type(screen.getByLabelText('Descrição'), 'Descrição detalhada da nova feature');
    await user.click(screen.getByText('Criar Solicitação'));

    await waitFor(() => {
      expect(apiClient.post).toHaveBeenCalledWith('/requests', {
        title: 'Nova feature',
        description: 'Descrição detalhada da nova feature',
        type: 'feature',
      });
      expect(mockPush).toHaveBeenCalledWith('/requests/req-novo');
    });
  });

  it('exibe mensagem de erro ao falhar o envio', async () => {
    const user = userEvent.setup();
    vi.mocked(apiClient.post).mockRejectedValueOnce(new Error('Network error'));

    render(<RequestForm />);

    await user.type(screen.getByLabelText('Título'), 'Teste erro');
    await user.type(screen.getByLabelText('Descrição'), 'Descrição para testar o comportamento de erro');
    await user.click(screen.getByText('Criar Solicitação'));

    await waitFor(() => {
      expect(screen.getByText('Erro ao criar solicitação. Tente novamente.')).toBeInTheDocument();
    });
  });

  it('permite selecionar tipo bug_fix', async () => {
    const user = userEvent.setup();
    render(<RequestForm />);
    await user.selectOptions(screen.getByLabelText('Tipo'), 'bug_fix');
    expect(screen.getByLabelText('Tipo')).toHaveValue('bug_fix');
  });
});
