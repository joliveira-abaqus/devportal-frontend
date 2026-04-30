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
    mockGet.mockReset();
  });

  it('retorna estado inicial de loading', () => {
    mockGet.mockReturnValue(new Promise(() => {}));
    const { result } = renderHook(() => useRequest('abc'));
    expect(result.current.isLoading).toBe(true);
    expect(result.current.request).toBeNull();
    expect(result.current.error).toBeNull();
  });

  it('carrega solicitação por ID (formato direto)', async () => {
    const mockData = { id: 'abc', title: 'Test Request', status: 'pending' };
    mockGet.mockResolvedValue({ data: mockData });

    const { result } = renderHook(() => useRequest('abc'));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.request).toEqual(mockData);
    expect(result.current.error).toBeNull();
    expect(mockGet).toHaveBeenCalledWith('/requests/abc');
  });

  it('carrega solicitação por ID (formato com data wrapper)', async () => {
    const mockData = { id: 'abc', title: 'Wrapped Request' };
    mockGet.mockResolvedValue({ data: { data: mockData } });

    const { result } = renderHook(() => useRequest('abc'));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.request).toEqual(mockData);
  });

  it('trata erro de requisição', async () => {
    mockGet.mockRejectedValue(new Error('Not found'));

    const { result } = renderHook(() => useRequest('invalid'));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.error).toBe('Erro ao carregar solicitação');
    expect(result.current.request).toBeNull();
  });

  it('não faz fetch quando id é vazio', async () => {
    const { result } = renderHook(() => useRequest(''));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(true);
    });

    expect(mockGet).not.toHaveBeenCalled();
  });

  it('refetch recarrega os dados', async () => {
    mockGet.mockResolvedValue({ data: { id: 'abc', title: 'V1' } });

    const { result } = renderHook(() => useRequest('abc'));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    mockGet.mockResolvedValue({ data: { id: 'abc', title: 'V2' } });
    await result.current.refetch();

    await waitFor(() => {
      expect(result.current.request).toEqual({ id: 'abc', title: 'V2' });
    });
  });
});
