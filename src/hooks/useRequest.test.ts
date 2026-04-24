import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useRequest } from './useRequest';

vi.mock('@/lib/api-client', () => ({
  default: {
    get: vi.fn(),
  },
}));

import apiClient from '@/lib/api-client';

const mockRequest = {
  id: 'req-1',
  title: 'Corrigir bug',
  description: 'Descrição do bug',
  type: 'bug_fix',
  status: 'pending',
  userId: 'user-1',
  events: [],
  createdAt: '2024-03-15T14:00:00Z',
  updatedAt: '2024-03-15T14:00:00Z',
};

describe('useRequest', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('busca e retorna request por id', async () => {
    vi.mocked(apiClient.get).mockResolvedValueOnce({
      data: { data: mockRequest },
    });

    const { result } = renderHook(() => useRequest('req-1'));

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.request).toEqual(mockRequest);
    expect(result.current.error).toBeNull();
    expect(apiClient.get).toHaveBeenCalledWith('/requests/req-1');
  });

  it('trata resposta sem wrapper data', async () => {
    vi.mocked(apiClient.get).mockResolvedValueOnce({
      data: mockRequest,
    });

    const { result } = renderHook(() => useRequest('req-1'));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.request).toEqual(mockRequest);
  });

  it('retorna erro ao falhar a busca', async () => {
    vi.mocked(apiClient.get).mockRejectedValueOnce(new Error('Network error'));

    const { result } = renderHook(() => useRequest('req-1'));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.error).toBe('Erro ao carregar solicitação');
    expect(result.current.request).toBeNull();
  });

  it('não faz fetch quando id é vazio', async () => {
    const { result } = renderHook(() => useRequest(''));

    await waitFor(() => {
      expect(apiClient.get).not.toHaveBeenCalled();
    });

    expect(result.current.request).toBeNull();
  });

  it('refetch recarrega dados', async () => {
    vi.mocked(apiClient.get)
      .mockResolvedValueOnce({ data: { data: mockRequest } })
      .mockResolvedValueOnce({ data: { data: { ...mockRequest, title: 'Atualizado' } } });

    const { result } = renderHook(() => useRequest('req-1'));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    await result.current.refetch();

    await waitFor(() => {
      expect(result.current.request?.title).toBe('Atualizado');
    });

    expect(apiClient.get).toHaveBeenCalledTimes(2);
  });
});
