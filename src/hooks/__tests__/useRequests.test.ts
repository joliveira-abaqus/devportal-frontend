import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useRequests } from '../useRequests';

vi.mock('@/lib/api-client', () => ({
  default: {
    get: vi.fn(),
  },
}));

describe('useRequests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('inicia com isLoading=true e requests=[]', async () => {
    const { default: apiClient } = await import('@/lib/api-client');
    (apiClient.get as ReturnType<typeof vi.fn>).mockReturnValue(new Promise(() => {}));

    const { result } = renderHook(() => useRequests());
    expect(result.current.isLoading).toBe(true);
    expect(result.current.requests).toEqual([]);
  });

  it('retorna lista de requests após fetch com sucesso', async () => {
    const mockRequests = [
      { id: 'req-1', title: 'Request 1' },
      { id: 'req-2', title: 'Request 2' },
    ];
    const { default: apiClient } = await import('@/lib/api-client');
    (apiClient.get as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      data: { data: mockRequests },
    });

    const { result } = renderHook(() => useRequests());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.requests).toEqual(mockRequests);
    expect(result.current.error).toBeNull();
  });

  it('passa query params de status e type na URL', async () => {
    const { default: apiClient } = await import('@/lib/api-client');
    (apiClient.get as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      data: [],
    });

    renderHook(() => useRequests({ status: 'pending', type: 'bug_fix' }));

    await waitFor(() => {
      expect(apiClient.get).toHaveBeenCalledWith(
        expect.stringContaining('status=pending'),
      );
    });

    expect((apiClient.get as ReturnType<typeof vi.fn>).mock.calls[0][0]).toContain('type=bug_fix');
  });

  it('retorna error quando fetch falha', async () => {
    const { default: apiClient } = await import('@/lib/api-client');
    (apiClient.get as ReturnType<typeof vi.fn>).mockRejectedValueOnce(new Error('Network error'));

    const { result } = renderHook(() => useRequests());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.error).toBe('Erro ao carregar solicitações');
  });

  it('trata resposta como array direto', async () => {
    const mockRequests = [{ id: 'req-1', title: 'Request 1' }];
    const { default: apiClient } = await import('@/lib/api-client');
    (apiClient.get as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      data: mockRequests,
    });

    const { result } = renderHook(() => useRequests());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.requests).toEqual(mockRequests);
  });
});
