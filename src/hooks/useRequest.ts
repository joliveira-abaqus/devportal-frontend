'use client';

import { useCallback, useEffect, useState } from 'react';
import apiClient from '@/lib/api-client';
import type { Request } from '@/types';

interface UseRequestReturn {
  request: Request | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useRequest(id: string): UseRequestReturn {
  const [request, setRequest] = useState<Request | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRequest = useCallback(async () => {
    if (!id) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await apiClient.get(`/requests/${id}`);
      const body = response.data;
      setRequest(body.data ?? body);
    } catch (err) {
      setError('Erro ao carregar solicitação');
      console.error('Erro ao buscar request:', err);
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchRequest();
  }, [fetchRequest]);

  return { request, isLoading, error, refetch: fetchRequest };
}
