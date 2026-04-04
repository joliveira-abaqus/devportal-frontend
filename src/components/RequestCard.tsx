'use client';

import Link from 'next/link';
import { Calendar, ArrowRight } from 'lucide-react';
import Card from '@/components/ui/Card';
import StatusBadge from '@/components/StatusBadge';
import type { Request } from '@/types';
import { formatRelativeDate, requestTypeLabels } from '@/lib/utils';

interface RequestCardProps {
  request: Request;
}

export default function RequestCard({ request }: RequestCardProps) {
  return (
    <Link href={`/requests/${request.id}`}>
      <Card className="transition-shadow hover:shadow-md">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold text-gray-900">{request.title}</h3>
              <StatusBadge status={request.status} />
            </div>

            <p className="mt-1 line-clamp-2 text-sm text-gray-500">{request.description}</p>

            <div className="mt-3 flex items-center gap-4 text-xs text-gray-400">
              <span className="inline-flex items-center gap-1 rounded bg-gray-100 px-2 py-0.5 font-medium text-gray-600">
                {requestTypeLabels[request.type]}
              </span>
              <span className="inline-flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {formatRelativeDate(request.createdAt)}
              </span>
            </div>
          </div>

          <ArrowRight className="ml-4 h-5 w-5 flex-shrink-0 text-gray-400" />
        </div>
      </Card>
    </Link>
  );
}
