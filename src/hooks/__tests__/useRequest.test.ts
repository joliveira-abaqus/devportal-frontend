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

  it('começa com isLoading=true, request=null, error=null', () => {
    (apiClient.get as ReturnType<typeof vi.fn>).mockReturnValue(new Promise(() => {}));

    const { result } = renderHook(() => useRequest('1'));

    expect(result.current.isLoading).toBe(true);
    expect(result.current.request).toBeNull();
    expect(result.current.error).toBeNull();
  });

  it('retorna request após fetch com sucesso (wrapper data)', async () => {
    const mockRequest = { id: '1', title: 'Test', status: 'pending' };
    (apiClient.get as ReturnType<typeof vi.fn>).mockResolvedValue({
      data: { data: mockRequest },
    });

    const { result } = renderHook(() => useRequest('1'));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.request).toEqual(mockRequest);
    expect(result.current.error).toBeNull();
  });

  it('retorna request após fetch com sucesso (sem wrapper)', async () => {
    const mockRequest = { id: '1', title: 'Test', status: 'pending' };
    (apiClient.get as ReturnType<typeof vi.fn>).mockResolvedValue({
      data: mockRequest,
    });

    const { result } = renderHook(() => useRequest('1'));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.request).toEqual(mockRequest);
  });

  it('seta error quando API falha', async () => {
    (apiClient.get as ReturnType<typeof vi.fn>).mockRejectedValue(new Error('Network error'));

    const { result } = renderHook(() => useRequest('1'));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.error).toBe('Erro ao carregar solicitação');
    expect(result.current.request).toBeNull();
  });

  it('não faz fetch quando id é vazio', async () => {
    const { result } = renderHook(() => useRequest(''));

    // Aguarda um tick para garantir que o efeito foi executado
    await waitFor(() => {
      expect(apiClient.get).not.toHaveBeenCalled();
    });

    expect(result.current.request).toBeNull();
  });

  it('refetch chama API novamente', async () => {
    const mockRequest = { id: '1', title: 'Test', status: 'pending' };
    (apiClient.get as ReturnType<typeof vi.fn>).mockResolvedValue({
      data: { data: mockRequest },
    });

    const { result } = renderHook(() => useRequest('1'));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(apiClient.get).toHaveBeenCalledTimes(1);

    await result.current.refetch();

    expect(apiClient.get).toHaveBeenCalledTimes(2);
  });
});
