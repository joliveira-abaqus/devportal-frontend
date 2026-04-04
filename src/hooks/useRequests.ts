'use client';

import { useCallback, useEffect, useState } from 'react';
import apiClient from '@/lib/api-client';
import type { Request, RequestStatus, RequestType } from '@/types';

interface UseRequestsOptions {
  status?: RequestStatus;
  type?: RequestType;
}

interface UseRequestsReturn {
  requests: Request[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useRequests(options: UseRequestsOptions = {}): UseRequestsReturn {
  const [requests, setRequests] = useState<Request[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRequests = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      if (options.status) params.append('status', options.status);
      if (options.type) params.append('type', options.type);

      const response = await apiClient.get(`/requests?${params.toString()}`);
      const body = response.data;
      setRequests(Array.isArray(body) ? body : body.data ?? []);
    } catch (err) {
      setError('Erro ao carregar solicitações');
      console.error('Erro ao buscar requests:', err);
    } finally {
      setIsLoading(false);
    }
  }, [options.status, options.type]);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  return { requests, isLoading, error, refetch: fetchRequests };
}
