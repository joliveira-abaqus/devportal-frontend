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

  it('faz fetch sem filtros', async () => {
    (apiClient.get as ReturnType<typeof vi.fn>).mockResolvedValue({
      data: [],
    });

    const { result } = renderHook(() => useRequests());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(apiClient.get).toHaveBeenCalledWith('/requests?');
    expect(result.current.requests).toEqual([]);
  });

  it('faz fetch com filtro de status', async () => {
    (apiClient.get as ReturnType<typeof vi.fn>).mockResolvedValue({
      data: [],
    });

    const { result } = renderHook(() => useRequests({ status: 'pending' }));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(apiClient.get).toHaveBeenCalledWith('/requests?status=pending');
  });

  it('faz fetch com filtro de type', async () => {
    (apiClient.get as ReturnType<typeof vi.fn>).mockResolvedValue({
      data: [],
    });

    const { result } = renderHook(() => useRequests({ type: 'bug_fix' }));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(apiClient.get).toHaveBeenCalledWith('/requests?type=bug_fix');
  });

  it('trata resposta como array direto', async () => {
    const mockRequests = [{ id: '1', title: 'Test' }];
    (apiClient.get as ReturnType<typeof vi.fn>).mockResolvedValue({
      data: mockRequests,
    });

    const { result } = renderHook(() => useRequests());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.requests).toEqual(mockRequests);
  });

  it('trata resposta como objeto com .data', async () => {
    const mockRequests = [{ id: '1', title: 'Test' }];
    (apiClient.get as ReturnType<typeof vi.fn>).mockResolvedValue({
      data: { data: mockRequests },
    });

    const { result } = renderHook(() => useRequests());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.requests).toEqual(mockRequests);
  });

  it('seta erro quando API falha', async () => {
    (apiClient.get as ReturnType<typeof vi.fn>).mockRejectedValue(new Error('fail'));

    const { result } = renderHook(() => useRequests());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.error).toBe('Erro ao carregar solicitações');
  });

  it('refetch chama API novamente', async () => {
    (apiClient.get as ReturnType<typeof vi.fn>).mockResolvedValue({ data: [] });

    const { result } = renderHook(() => useRequests());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(apiClient.get).toHaveBeenCalledTimes(1);

    await result.current.refetch();

    expect(apiClient.get).toHaveBeenCalledTimes(2);
  });
});
