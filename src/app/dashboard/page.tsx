'use client';

import { useState } from 'react';
import Link from 'next/link';
import { PlusCircle, Search } from 'lucide-react';
import Button from '@/components/ui/Button';
import Select from '@/components/ui/Select';
import RequestCard from '@/components/RequestCard';
import { useRequests } from '@/hooks/useRequests';
import type { RequestStatus, RequestType } from '@/types';

export default function DashboardPage() {
  const [statusFilter, setStatusFilter] = useState<RequestStatus | ''>('');
  const [typeFilter, setTypeFilter] = useState<RequestType | ''>('');

  const { requests, isLoading, error } = useRequests({
    status: statusFilter || undefined,
    type: typeFilter || undefined,
  });

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Minhas Solicitações</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Gerencie suas solicitações de desenvolvimento
          </p>
        </div>
        <Link href="/requests/new">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Nova Solicitação
          </Button>
        </Link>
      </div>

      <div className="mb-6 flex flex-wrap items-center gap-4 rounded-lg bg-white p-4 shadow-sm dark:bg-gray-800">
        <Search className="h-4 w-4 text-gray-400" />
        <Select
          id="status-filter"
          options={[
            { value: '', label: 'Todos os status' },
            { value: 'pending', label: 'Pendente' },
            { value: 'in_progress', label: 'Em Progresso' },
            { value: 'review', label: 'Em Revisão' },
            { value: 'done', label: 'Concluído' },
            { value: 'failed', label: 'Falhou' },
          ]}
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as RequestStatus | '')}
          className="w-48"
        />
        <Select
          id="type-filter"
          options={[
            { value: '', label: 'Todos os tipos' },
            { value: 'bug_fix', label: 'Bug Fix' },
            { value: 'feature', label: 'Feature' },
            { value: 'migration', label: 'Migration' },
          ]}
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value as RequestType | '')}
          className="w-48"
        />
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 animate-pulse rounded-lg bg-white shadow-sm dark:bg-gray-800" />
          ))}
        </div>
      ) : error ? (
        <div className="rounded-lg bg-red-50 p-6 text-center dark:bg-red-900/30">
          <p className="text-red-700 dark:text-red-400">{error}</p>
        </div>
      ) : requests.length === 0 ? (
        <div className="rounded-lg bg-white p-12 text-center shadow-sm dark:bg-gray-800">
          <p className="text-gray-500 dark:text-gray-400">Nenhuma solicitação encontrada.</p>
          <Link href="/requests/new" className="mt-4 inline-block">
            <Button variant="outline">
              <PlusCircle className="mr-2 h-4 w-4" />
              Criar primeira solicitação
            </Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {requests.map((request) => (
            <RequestCard key={request.id} request={request} />
          ))}
        </div>
      )}
    </div>
  );
}
