import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useRequests } from '../useRequests';

vi.mock('@/lib/api-client', () => ({
  default: {
    get: vi.fn(),
  },
}));

import apiClient from '@/lib/api-client';

describe('useRequests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('monta query params com filtros de status e type', async () => {
    vi.mocked(apiClient.get).mockResolvedValue({ data: [] });

    renderHook(() => useRequests({ status: 'pending', type: 'bug_fix' }));

    await waitFor(() => {
      expect(apiClient.get).toHaveBeenCalledWith(
        expect.stringContaining('status=pending'),
      );
    });

    expect(vi.mocked(apiClient.get).mock.calls[0][0]).toContain('type=bug_fix');
  });

  it('trata resposta como array direto', async () => {
    const mockData = [{ id: '1', title: 'Test' }];
    vi.mocked(apiClient.get).mockResolvedValue({ data: mockData });

    const { result } = renderHook(() => useRequests());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.requests).toEqual(mockData);
  });

  it('trata resposta como { data: [] }', async () => {
    const mockData = [{ id: '2', title: 'Test 2' }];
    vi.mocked(apiClient.get).mockResolvedValue({ data: { data: mockData } });

    const { result } = renderHook(() => useRequests());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.requests).toEqual(mockData);
  });

  it('seta error ao falhar', async () => {
    vi.mocked(apiClient.get).mockRejectedValue(new Error('Network error'));

    const { result } = renderHook(() => useRequests());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.error).toBe('Erro ao carregar solicitações');
  });

  it('isLoading inicia como true e vai para false após resposta', async () => {
    vi.mocked(apiClient.get).mockResolvedValue({ data: [] });

    const { result } = renderHook(() => useRequests());

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
  });

  it('refetch faz nova chamada', async () => {
    vi.mocked(apiClient.get).mockResolvedValue({ data: [] });

    const { result } = renderHook(() => useRequests());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(apiClient.get).toHaveBeenCalledTimes(1);

    await result.current.refetch();

    expect(apiClient.get).toHaveBeenCalledTimes(2);
  });
});
