import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useRequests } from './useRequests';

const mockGet = vi.fn();

vi.mock('@/lib/api-client', () => ({
  default: {
    get: (...args: unknown[]) => mockGet(...args),
  },
}));

describe('useRequests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('deve retornar estado inicial de loading', () => {
    mockGet.mockReturnValue(new Promise(() => {}));
    const { result } = renderHook(() => useRequests());
    expect(result.current.isLoading).toBe(true);
    expect(result.current.requests).toEqual([]);
    expect(result.current.error).toBeNull();
  });

  it('deve carregar solicitações com sucesso', async () => {
    const mockData = [
      { id: '1', title: 'Request 1', status: 'pending' },
      { id: '2', title: 'Request 2', status: 'done' },
    ];
    mockGet.mockResolvedValue({ data: { data: mockData } });

    const { result } = renderHook(() => useRequests());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.requests).toEqual(mockData);
    expect(result.current.error).toBeNull();
  });

  it('deve tratar erro ao carregar', async () => {
    mockGet.mockRejectedValue(new Error('Network error'));

    const { result } = renderHook(() => useRequests());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.error).toBe('Erro ao carregar solicitações');
    expect(result.current.requests).toEqual([]);
  });

  it('deve passar filtros como query params', async () => {
    mockGet.mockResolvedValue({ data: { data: [] } });

    renderHook(() => useRequests({ status: 'pending', type: 'bug_fix' }));

    await waitFor(() => {
      expect(mockGet).toHaveBeenCalledWith('/requests?status=pending&type=bug_fix');
    });
  });

  it('deve permitir refetch', async () => {
    mockGet.mockResolvedValue({ data: { data: [] } });

    const { result } = renderHook(() => useRequests());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    mockGet.mockResolvedValue({
      data: { data: [{ id: '1', title: 'New' }] },
    });

    await result.current.refetch();

    await waitFor(() => {
      expect(result.current.requests).toEqual([{ id: '1', title: 'New' }]);
    });
  });

  it('deve lidar com resposta em formato array', async () => {
    const mockData = [{ id: '1', title: 'Request 1' }];
    mockGet.mockResolvedValue({ data: mockData });

    const { result } = renderHook(() => useRequests());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.requests).toEqual(mockData);
  });
});
