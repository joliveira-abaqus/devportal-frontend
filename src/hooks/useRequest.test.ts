import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useRequest } from './useRequest';

const mockGet = vi.fn();

vi.mock('@/lib/api-client', () => ({
  default: {
    get: (...args: unknown[]) => mockGet(...args),
  },
}));

describe('useRequest', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('deve retornar estado inicial de loading', () => {
    mockGet.mockReturnValue(new Promise(() => {}));
    const { result } = renderHook(() => useRequest('1'));
    expect(result.current.isLoading).toBe(true);
    expect(result.current.request).toBeNull();
    expect(result.current.error).toBeNull();
  });

  it('deve carregar solicitação por ID', async () => {
    const mockData = {
      id: '1',
      title: 'Corrigir bug',
      description: 'Descrição do bug',
      status: 'pending',
    };
    mockGet.mockResolvedValue({ data: { data: mockData } });

    const { result } = renderHook(() => useRequest('1'));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.request).toEqual(mockData);
    expect(result.current.error).toBeNull();
    expect(mockGet).toHaveBeenCalledWith('/requests/1');
  });

  it('deve tratar erro ao carregar', async () => {
    mockGet.mockRejectedValue(new Error('Not found'));

    const { result } = renderHook(() => useRequest('999'));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.error).toBe('Erro ao carregar solicitação');
    expect(result.current.request).toBeNull();
  });

  it('não deve buscar quando ID é vazio', async () => {
    const { result } = renderHook(() => useRequest(''));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(true);
    });

    expect(mockGet).not.toHaveBeenCalled();
  });

  it('deve permitir refetch', async () => {
    mockGet.mockResolvedValue({
      data: { data: { id: '1', title: 'Original' } },
    });

    const { result } = renderHook(() => useRequest('1'));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    mockGet.mockResolvedValue({
      data: { data: { id: '1', title: 'Atualizado' } },
    });

    await result.current.refetch();

    await waitFor(() => {
      expect(result.current.request?.title).toBe('Atualizado');
    });
  });

  it('deve lidar com resposta sem wrapper data', async () => {
    const mockData = { id: '1', title: 'Direct response' };
    mockGet.mockResolvedValue({ data: mockData });

    const { result } = renderHook(() => useRequest('1'));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.request).toEqual(mockData);
  });
});
