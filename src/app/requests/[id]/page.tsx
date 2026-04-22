'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Download, ExternalLink } from 'lucide-react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import Card from '@/components/ui/Card';
import StatusBadge from '@/components/StatusBadge';
import RequestTimeline from '@/components/RequestTimeline';
import { useRequest } from '@/hooks/useRequest';
import { formatDate, requestTypeLabels } from '@/lib/utils';

export default function RequestDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const { request, isLoading, error } = useRequest(id);

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto bg-ivory p-6">
          <div className="mx-auto max-w-3xl">
            <Link
              href="/dashboard"
              className="mb-4 inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"
            >
              <ArrowLeft className="h-4 w-4" />
              Voltar ao Dashboard
            </Link>

            {isLoading ? (
              <div className="space-y-4">
                <div className="h-48 animate-pulse rounded-lg bg-white shadow-sm" />
                <div className="h-64 animate-pulse rounded-lg bg-white shadow-sm" />
              </div>
            ) : error ? (
              <div className="rounded-lg bg-red-50 p-6 text-center">
                <p className="text-red-700">{error}</p>
              </div>
            ) : request ? (
              <div className="space-y-6">
                <Card>
                  <div className="flex items-start justify-between">
                    <div>
                      <h1 className="text-xl font-bold text-gray-900">{request.title}</h1>
                      <div className="mt-2 flex items-center gap-3">
                        <StatusBadge status={request.status} />
                        <span className="text-sm text-gray-500">
                          {requestTypeLabels[request.type]}
                        </span>
                        <span className="text-sm text-gray-400">
                          Criado em {formatDate(request.createdAt)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4">
                    <h2 className="text-sm font-medium text-gray-700">Descrição</h2>
                    <p className="mt-1 whitespace-pre-wrap text-sm text-gray-600">
                      {request.description}
                    </p>
                  </div>

                  {request.prUrl && (
                    <div className="mt-4">
                      <h2 className="text-sm font-medium text-gray-700">Pull Request</h2>
                      <a
                        href={request.prUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-1 inline-flex items-center gap-1 text-sm text-brand-600 hover:underline"
                      >
                        <ExternalLink className="h-3 w-3" />
                        {request.prUrl}
                      </a>
                    </div>
                  )}

                  {request.attachmentUrl && (
                    <div className="mt-4">
                      <h2 className="text-sm font-medium text-gray-700">Arquivo Anexo</h2>
                      <a
                        href={request.attachmentUrl}
                        download={request.attachmentName}
                        className="mt-1 inline-flex items-center gap-1 text-sm text-brand-600 hover:underline"
                      >
                        <Download className="h-3 w-3" />
                        {request.attachmentName || 'Download'}
                      </a>
                    </div>
                  )}
                </Card>

                <Card>
                  <h2 className="mb-4 text-lg font-semibold text-gray-900">Timeline</h2>
                  <RequestTimeline events={request.events} />
                </Card>
              </div>
            ) : null}
          </div>
        </main>
      </div>
    </div>
  );
}
