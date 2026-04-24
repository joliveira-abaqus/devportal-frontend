import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useRequests } from './useRequests';

vi.mock('@/lib/api-client', () => ({
  default: {
    get: vi.fn(),
  },
}));

import apiClient from '@/lib/api-client';

const mockRequests = [
  {
    id: 'req-1',
    title: 'Bug fix 1',
    description: 'Descrição',
    type: 'bug_fix',
    status: 'pending',
    userId: 'user-1',
    events: [],
    createdAt: '2024-03-15T14:00:00Z',
    updatedAt: '2024-03-15T14:00:00Z',
  },
  {
    id: 'req-2',
    title: 'Feature 1',
    description: 'Descrição',
    type: 'feature',
    status: 'in_progress',
    userId: 'user-1',
    events: [],
    createdAt: '2024-03-16T14:00:00Z',
    updatedAt: '2024-03-16T14:00:00Z',
  },
];

describe('useRequests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('busca e retorna lista de requests', async () => {
    vi.mocked(apiClient.get).mockResolvedValueOnce({
      data: { data: mockRequests },
    });

    const { result } = renderHook(() => useRequests());

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.requests).toEqual(mockRequests);
    expect(result.current.error).toBeNull();
  });

  it('trata resposta como array direto', async () => {
    vi.mocked(apiClient.get).mockResolvedValueOnce({
      data: mockRequests,
    });

    const { result } = renderHook(() => useRequests());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.requests).toEqual(mockRequests);
  });

  it('envia filtro de status como query param', async () => {
    vi.mocked(apiClient.get).mockResolvedValueOnce({
      data: { data: [mockRequests[0]] },
    });

    renderHook(() => useRequests({ status: 'pending' }));

    await waitFor(() => {
      expect(apiClient.get).toHaveBeenCalledWith(expect.stringContaining('status=pending'));
    });
  });

  it('envia filtro de type como query param', async () => {
    vi.mocked(apiClient.get).mockResolvedValueOnce({
      data: { data: [mockRequests[1]] },
    });

    renderHook(() => useRequests({ type: 'feature' }));

    await waitFor(() => {
      expect(apiClient.get).toHaveBeenCalledWith(expect.stringContaining('type=feature'));
    });
  });

  it('retorna erro ao falhar a busca', async () => {
    vi.mocked(apiClient.get).mockRejectedValueOnce(new Error('Erro'));

    const { result } = renderHook(() => useRequests());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.error).toBe('Erro ao carregar solicitações');
    expect(result.current.requests).toEqual([]);
  });

  it('refetch recarrega dados', async () => {
    vi.mocked(apiClient.get)
      .mockResolvedValueOnce({ data: { data: mockRequests } })
      .mockResolvedValueOnce({ data: { data: [] } });

    const { result } = renderHook(() => useRequests());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.requests).toHaveLength(2);

    await result.current.refetch();

    await waitFor(() => {
      expect(result.current.requests).toHaveLength(0);
    });

    expect(apiClient.get).toHaveBeenCalledTimes(2);
  });
});
