import { renderHook, waitFor } from '@testing-library/react';
import { useRequest } from '@/hooks/useRequest';
import apiClient from '@/lib/api-client';
import type { Request } from '@/types';

jest.mock('@/lib/api-client', () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  },
}));

const mockRequest: Request = {
  id: 'req-123',
  title: 'Bug no login',
  description: 'O login não funciona corretamente',
  type: 'bug_fix',
  status: 'pending',
  userId: 'user-1',
  events: [
    {
      id: 'evt-1',
      requestId: 'req-123',
      type: 'status_change',
      description: 'Solicitação criada',
      createdAt: '2024-06-15T10:00:00Z',
    },
  ],
  createdAt: '2024-06-15T10:00:00Z',
  updatedAt: '2024-06-15T10:00:00Z',
};

describe('useRequest', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve retornar solicitação com sucesso', async () => {
    (apiClient.get as jest.Mock).mockResolvedValue({ data: { data: mockRequest } });

    const { result } = renderHook(() => useRequest('req-123'));

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.request).toEqual(mockRequest);
    expect(result.current.error).toBeNull();
  });

  it('deve lidar com resposta sem wrapper data', async () => {
    (apiClient.get as jest.Mock).mockResolvedValue({ data: mockRequest });

    const { result } = renderHook(() => useRequest('req-123'));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.request).toEqual(mockRequest);
  });

  it('deve definir erro quando requisição falha', async () => {
    (apiClient.get as jest.Mock).mockRejectedValue(new Error('Not found'));

    const { result } = renderHook(() => useRequest('req-invalid'));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.error).toBe('Erro ao carregar solicitação');
    expect(result.current.request).toBeNull();
  });

  it('deve chamar API com o id correto', async () => {
    (apiClient.get as jest.Mock).mockResolvedValue({ data: { data: mockRequest } });

    renderHook(() => useRequest('req-123'));

    await waitFor(() => {
      expect(apiClient.get).toHaveBeenCalledWith('/requests/req-123');
    });
  });

  it('não deve fazer requisição com id vazio', async () => {
    renderHook(() => useRequest(''));

    await waitFor(() => {
      expect(apiClient.get).not.toHaveBeenCalled();
    });
  });

  it('deve fornecer função refetch', async () => {
    (apiClient.get as jest.Mock).mockResolvedValue({ data: { data: mockRequest } });

    const { result } = renderHook(() => useRequest('req-123'));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(typeof result.current.refetch).toBe('function');
  });
});
