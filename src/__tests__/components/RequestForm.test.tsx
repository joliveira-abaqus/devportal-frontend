import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import RequestForm from '@/components/RequestForm';

const mockPush = jest.fn();
const mockBack = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush, back: mockBack }),
}));

jest.mock('@/lib/api-client', () => ({
  __esModule: true,
  default: {
    post: jest.fn(() => Promise.resolve({ data: { data: { id: 'abc-123' } } })),
  },
}));

describe('RequestForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve renderizar o campo Título', () => {
    render(<RequestForm />);
    expect(screen.getByLabelText('Título')).toBeInTheDocument();
  });

  it('deve renderizar o campo Descrição', () => {
    render(<RequestForm />);
    expect(screen.getByLabelText('Descrição')).toBeInTheDocument();
  });

  it('deve renderizar o campo Tipo', () => {
    render(<RequestForm />);
    expect(screen.getByLabelText('Tipo')).toBeInTheDocument();
  });

  it('deve renderizar o botão Criar Solicitação', () => {
    render(<RequestForm />);
    expect(screen.getByRole('button', { name: 'Criar Solicitação' })).toBeInTheDocument();
  });

  it('deve renderizar o botão Cancelar', () => {
    render(<RequestForm />);
    expect(screen.getByRole('button', { name: 'Cancelar' })).toBeInTheDocument();
  });

  it('deve ter Feature como tipo padrão', () => {
    render(<RequestForm />);
    const select = screen.getByLabelText('Tipo') as HTMLSelectElement;
    expect(select.value).toBe('feature');
  });

  it('deve exibir todas as opções de tipo', () => {
    render(<RequestForm />);
    const select = screen.getByLabelText('Tipo');
    const options = select.querySelectorAll('option');
    expect(options).toHaveLength(3);
    expect(options[0]).toHaveTextContent('Feature');
    expect(options[1]).toHaveTextContent('Bug Fix');
    expect(options[2]).toHaveTextContent('Migration');
  });

  it('deve exibir erro de validação para título curto', async () => {
    const user = userEvent.setup();
    render(<RequestForm />);

    await user.type(screen.getByLabelText('Título'), 'AB');
    await user.click(screen.getByRole('button', { name: 'Criar Solicitação' }));

    await waitFor(() => {
      expect(screen.getByText('Título deve ter pelo menos 3 caracteres')).toBeInTheDocument();
    });
  });

  it('deve exibir erro de validação para descrição curta', async () => {
    const user = userEvent.setup();
    render(<RequestForm />);

    await user.type(screen.getByLabelText('Título'), 'Título válido');
    await user.type(screen.getByLabelText('Descrição'), '123456789');
    await user.click(screen.getByRole('button', { name: 'Criar Solicitação' }));

    await waitFor(() => {
      expect(screen.getByText('Descrição deve ter pelo menos 10 caracteres')).toBeInTheDocument();
    });
  });

  it('deve exibir erros de validação com campos vazios', async () => {
    const user = userEvent.setup();
    render(<RequestForm />);

    await user.click(screen.getByRole('button', { name: 'Criar Solicitação' }));

    await waitFor(() => {
      expect(screen.getByText('Título deve ter pelo menos 3 caracteres')).toBeInTheDocument();
      expect(screen.getByText('Descrição deve ter pelo menos 10 caracteres')).toBeInTheDocument();
    });
  });

  it('deve chamar apiClient.post com dados corretos ao submeter', async () => {
    const user = userEvent.setup();
    const apiClient = require('@/lib/api-client').default;

    render(<RequestForm />);

    await user.type(screen.getByLabelText('Título'), 'Bug no login');
    await user.type(screen.getByLabelText('Descrição'), 'O botão de login não funciona corretamente');
    await user.selectOptions(screen.getByLabelText('Tipo'), 'bug_fix');
    await user.click(screen.getByRole('button', { name: 'Criar Solicitação' }));

    await waitFor(() => {
      expect(apiClient.post).toHaveBeenCalledWith('/requests', {
        title: 'Bug no login',
        description: 'O botão de login não funciona corretamente',
        type: 'bug_fix',
      });
    });
  });

  it('deve redirecionar para a solicitação criada após sucesso', async () => {
    const user = userEvent.setup();
    render(<RequestForm />);

    await user.type(screen.getByLabelText('Título'), 'Bug no login');
    await user.type(screen.getByLabelText('Descrição'), 'O botão de login não funciona corretamente');
    await user.click(screen.getByRole('button', { name: 'Criar Solicitação' }));

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/requests/abc-123');
    });
  });

  it('deve chamar router.back ao clicar em Cancelar', async () => {
    const user = userEvent.setup();
    render(<RequestForm />);

    await user.click(screen.getByRole('button', { name: 'Cancelar' }));
    expect(mockBack).toHaveBeenCalled();
  });

  it('deve exibir erro quando a API falha', async () => {
    const user = userEvent.setup();
    const apiClient = require('@/lib/api-client').default;
    apiClient.post.mockRejectedValueOnce(new Error('Network error'));

    render(<RequestForm />);

    await user.type(screen.getByLabelText('Título'), 'Bug no login');
    await user.type(screen.getByLabelText('Descrição'), 'O botão de login não funciona corretamente');
    await user.click(screen.getByRole('button', { name: 'Criar Solicitação' }));

    await waitFor(() => {
      expect(screen.getByText('Erro ao criar solicitação. Tente novamente.')).toBeInTheDocument();
    });
  });
});
