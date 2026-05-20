import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useRequest } from '../useRequest';

vi.mock('@/lib/api-client', () => ({
  default: {
    get: vi.fn(),
  },
}));

import apiClient from '@/lib/api-client';

describe('useRequest', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('não faz fetch quando id é string vazia', async () => {
    const { result } = renderHook(() => useRequest(''));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(true);
    });

    expect(apiClient.get).not.toHaveBeenCalled();
  });

  it('faz fetch para /requests/{id} quando id é válido', async () => {
    vi.mocked(apiClient.get).mockResolvedValue({
      data: { id: 'req-1', title: 'Test' },
    });

    renderHook(() => useRequest('req-1'));

    await waitFor(() => {
      expect(apiClient.get).toHaveBeenCalledWith('/requests/req-1');
    });
  });

  it('trata resposta { data: {...} }', async () => {
    const mockRequest = { id: 'req-1', title: 'Test Request' };
    vi.mocked(apiClient.get).mockResolvedValue({
      data: { data: mockRequest },
    });

    const { result } = renderHook(() => useRequest('req-1'));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.request).toEqual(mockRequest);
  });

  it('trata resposta como objeto direto', async () => {
    const mockRequest = { id: 'req-2', title: 'Test Direct' };
    vi.mocked(apiClient.get).mockResolvedValue({
      data: mockRequest,
    });

    const { result } = renderHook(() => useRequest('req-2'));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.request).toEqual(mockRequest);
  });

  it('seta error ao falhar', async () => {
    vi.mocked(apiClient.get).mockRejectedValue(new Error('Not found'));

    const { result } = renderHook(() => useRequest('req-invalid'));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.error).toBe('Erro ao carregar solicitação');
  });
});
