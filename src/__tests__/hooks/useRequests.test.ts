import { renderHook, waitFor } from '@testing-library/react';
import { useRequests } from '@/hooks/useRequests';
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

const mockRequests: Request[] = [
  {
    id: 'req-1',
    title: 'Bug no login',
    description: 'O login não funciona',
    type: 'bug_fix',
    status: 'pending',
    userId: 'user-1',
    events: [],
    createdAt: '2024-06-15T10:00:00Z',
    updatedAt: '2024-06-15T10:00:00Z',
  },
  {
    id: 'req-2',
    title: 'Nova feature',
    description: 'Adicionar dark mode',
    type: 'feature',
    status: 'done',
    userId: 'user-1',
    events: [],
    createdAt: '2024-06-14T10:00:00Z',
    updatedAt: '2024-06-14T10:00:00Z',
  },
];

describe('useRequests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve retornar lista de solicitações com sucesso', async () => {
    (apiClient.get as jest.Mock).mockResolvedValue({ data: { data: mockRequests } });

    const { result } = renderHook(() => useRequests());

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.requests).toEqual(mockRequests);
    expect(result.current.error).toBeNull();
  });

  it('deve lidar com resposta como array direto', async () => {
    (apiClient.get as jest.Mock).mockResolvedValue({ data: mockRequests });

    const { result } = renderHook(() => useRequests());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.requests).toEqual(mockRequests);
  });

  it('deve definir erro quando requisição falha', async () => {
    (apiClient.get as jest.Mock).mockRejectedValue(new Error('Network error'));

    const { result } = renderHook(() => useRequests());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.error).toBe('Erro ao carregar solicitações');
    expect(result.current.requests).toEqual([]);
  });

  it('deve passar filtro de status como query param', async () => {
    (apiClient.get as jest.Mock).mockResolvedValue({ data: { data: [] } });

    renderHook(() => useRequests({ status: 'pending' }));

    await waitFor(() => {
      expect(apiClient.get).toHaveBeenCalledWith('/requests?status=pending');
    });
  });

  it('deve passar filtro de tipo como query param', async () => {
    (apiClient.get as jest.Mock).mockResolvedValue({ data: { data: [] } });

    renderHook(() => useRequests({ type: 'bug_fix' }));

    await waitFor(() => {
      expect(apiClient.get).toHaveBeenCalledWith('/requests?type=bug_fix');
    });
  });

  it('deve passar ambos filtros como query params', async () => {
    (apiClient.get as jest.Mock).mockResolvedValue({ data: { data: [] } });

    renderHook(() => useRequests({ status: 'done', type: 'feature' }));

    await waitFor(() => {
      expect(apiClient.get).toHaveBeenCalledWith('/requests?status=done&type=feature');
    });
  });

  it('deve fornecer função refetch', async () => {
    (apiClient.get as jest.Mock).mockResolvedValue({ data: { data: mockRequests } });

    const { result } = renderHook(() => useRequests());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(typeof result.current.refetch).toBe('function');
  });
});
