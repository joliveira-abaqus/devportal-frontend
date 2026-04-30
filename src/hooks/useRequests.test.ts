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
    mockGet.mockReset();
  });

  it('retorna estado inicial de loading', () => {
    mockGet.mockReturnValue(new Promise(() => {}));
    const { result } = renderHook(() => useRequests());
    expect(result.current.isLoading).toBe(true);
    expect(result.current.requests).toEqual([]);
    expect(result.current.error).toBeNull();
  });

  it('carrega lista de solicitações com sucesso (array direto)', async () => {
    const mockData = [
      { id: '1', title: 'Request 1', status: 'pending', type: 'feature' },
      { id: '2', title: 'Request 2', status: 'done', type: 'bug_fix' },
    ];
    mockGet.mockResolvedValue({ data: mockData });

    const { result } = renderHook(() => useRequests());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.requests).toEqual(mockData);
    expect(result.current.error).toBeNull();
  });

  it('carrega lista de solicitações com sucesso (formato paginado)', async () => {
    const mockData = [{ id: '1', title: 'Request 1' }];
    mockGet.mockResolvedValue({ data: { data: mockData, total: 1 } });

    const { result } = renderHook(() => useRequests());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.requests).toEqual(mockData);
  });

  it('trata erro de requisição', async () => {
    mockGet.mockRejectedValue(new Error('Network error'));

    const { result } = renderHook(() => useRequests());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.error).toBe('Erro ao carregar solicitações');
    expect(result.current.requests).toEqual([]);
  });

  it('envia filtros de status e tipo na query string', async () => {
    mockGet.mockResolvedValue({ data: [] });

    renderHook(() => useRequests({ status: 'pending', type: 'feature' }));

    await waitFor(() => {
      expect(mockGet).toHaveBeenCalledWith('/requests?status=pending&type=feature');
    });
  });

  it('refetch recarrega os dados', async () => {
    mockGet.mockResolvedValue({ data: [{ id: '1', title: 'Original' }] });

    const { result } = renderHook(() => useRequests());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    mockGet.mockResolvedValue({ data: [{ id: '2', title: 'Updated' }] });
    await result.current.refetch();

    await waitFor(() => {
      expect(result.current.requests).toEqual([{ id: '2', title: 'Updated' }]);
    });
  });
});
