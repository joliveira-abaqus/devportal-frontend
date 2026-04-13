import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useRequest } from '../useRequest';

vi.mock('@/lib/api-client', () => ({
  default: {
    get: vi.fn(),
  },
}));

describe('useRequest', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('inicia com isLoading=true', async () => {
    const { default: apiClient } = await import('@/lib/api-client');
    (apiClient.get as ReturnType<typeof vi.fn>).mockReturnValue(new Promise(() => {}));

    const { result } = renderHook(() => useRequest('req-1'));
    expect(result.current.isLoading).toBe(true);
  });

  it('retorna request após fetch com sucesso', async () => {
    const mockRequest = {
      id: 'req-1',
      title: 'Test Request',
      status: 'pending',
    };
    const { default: apiClient } = await import('@/lib/api-client');
    (apiClient.get as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      data: { data: mockRequest },
    });

    const { result } = renderHook(() => useRequest('req-1'));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.request).toEqual(mockRequest);
    expect(result.current.error).toBeNull();
  });

  it('retorna error quando fetch falha', async () => {
    const { default: apiClient } = await import('@/lib/api-client');
    (apiClient.get as ReturnType<typeof vi.fn>).mockRejectedValueOnce(new Error('Network error'));

    const { result } = renderHook(() => useRequest('req-1'));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.error).toBe('Erro ao carregar solicitação');
    expect(result.current.request).toBeNull();
  });

  it('não faz fetch quando id é vazio', async () => {
    const { default: apiClient } = await import('@/lib/api-client');

    renderHook(() => useRequest(''));

    expect(apiClient.get).not.toHaveBeenCalled();
  });

  it('refetch re-executa o fetch', async () => {
    const mockRequest = { id: 'req-1', title: 'Test' };
    const { default: apiClient } = await import('@/lib/api-client');
    (apiClient.get as ReturnType<typeof vi.fn>)
      .mockResolvedValueOnce({ data: { data: mockRequest } })
      .mockResolvedValueOnce({ data: { data: { ...mockRequest, title: 'Updated' } } });

    const { result } = renderHook(() => useRequest('req-1'));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    await result.current.refetch();

    await waitFor(() => {
      expect(apiClient.get).toHaveBeenCalledTimes(2);
    });
  });
});
