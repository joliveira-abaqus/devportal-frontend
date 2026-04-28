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
    post: vi.fn().mockResolvedValue({
      data: { data: { id: '3' } },
    }),
  },
}));

describe('RequestForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('deve renderizar todos os campos do formulário', () => {
    render(<RequestForm />);
    expect(screen.getByLabelText('Título')).toBeInTheDocument();
    expect(screen.getByLabelText('Descrição')).toBeInTheDocument();
    expect(screen.getByLabelText('Tipo')).toBeInTheDocument();
  });

  it('deve renderizar botões de ação', () => {
    render(<RequestForm />);
    expect(screen.getByRole('button', { name: 'Criar Solicitação' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Cancelar' })).toBeInTheDocument();
  });

  it('deve exibir erro de validação para título curto', async () => {
    const user = userEvent.setup();
    render(<RequestForm />);

    const titleInput = screen.getByLabelText('Título');
    await user.type(titleInput, 'AB');
    await user.click(screen.getByRole('button', { name: 'Criar Solicitação' }));

    await waitFor(() => {
      expect(screen.getByText('Título deve ter pelo menos 3 caracteres')).toBeInTheDocument();
    });
  });

  it('deve exibir erro de validação para descrição curta', async () => {
    const user = userEvent.setup();
    render(<RequestForm />);

    await user.type(screen.getByLabelText('Título'), 'Título válido');
    await user.type(screen.getByLabelText('Descrição'), 'Curta');
    await user.click(screen.getByRole('button', { name: 'Criar Solicitação' }));

    await waitFor(() => {
      expect(screen.getByText('Descrição deve ter pelo menos 10 caracteres')).toBeInTheDocument();
    });
  });

  it('deve navegar para trás ao clicar em Cancelar', async () => {
    const user = userEvent.setup();
    render(<RequestForm />);

    await user.click(screen.getByRole('button', { name: 'Cancelar' }));
    expect(mockBack).toHaveBeenCalled();
  });

  it('deve ter opções de tipo corretas', () => {
    render(<RequestForm />);
    const select = screen.getByLabelText('Tipo');
    expect(select).toBeInTheDocument();

    const options = screen.getAllByRole('option');
    expect(options).toHaveLength(3);
    expect(options[0]).toHaveTextContent('Feature');
    expect(options[1]).toHaveTextContent('Bug Fix');
    expect(options[2]).toHaveTextContent('Migration');
  });

  it('deve submeter formulário com dados válidos', async () => {
    const user = userEvent.setup();
    const { default: apiClient } = await import('@/lib/api-client');

    render(<RequestForm />);

    await user.type(screen.getByLabelText('Título'), 'Nova funcionalidade');
    await user.type(screen.getByLabelText('Descrição'), 'Descrição detalhada da nova funcionalidade');
    await user.click(screen.getByRole('button', { name: 'Criar Solicitação' }));

    await waitFor(() => {
      expect(apiClient.post).toHaveBeenCalledWith('/requests', {
        title: 'Nova funcionalidade',
        description: 'Descrição detalhada da nova funcionalidade',
        type: 'feature',
      });
    });

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/requests/3');
    });
  });
});
