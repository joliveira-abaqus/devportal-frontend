import {
  CheckCircle,
  Clock,
  GitPullRequest,
  MessageSquare,
  Paperclip,
  RefreshCw,
} from 'lucide-react';
import type { RequestEvent } from '@/types';
import { formatDate } from '@/lib/utils';

interface RequestTimelineProps {
  events: RequestEvent[];
}

const eventIcons: Record<string, React.ElementType> = {
  status_change: RefreshCw,
  comment: MessageSquare,
  pr_linked: GitPullRequest,
  file_attached: Paperclip,
};

const eventColors: Record<string, string> = {
  status_change: 'bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400',
  comment: 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400',
  pr_linked: 'bg-purple-100 text-purple-600 dark:bg-purple-900/50 dark:text-purple-400',
  file_attached: 'bg-green-100 text-green-600 dark:bg-green-900/50 dark:text-green-400',
};

export default function RequestTimeline({ events }: RequestTimelineProps) {
  if (!events || events.length === 0) {
    return (
      <div className="flex items-center gap-2 py-8 text-sm text-gray-500 dark:text-gray-400">
        <Clock className="h-4 w-4" />
        <span>Nenhum evento registrado ainda.</span>
      </div>
    );
  }

  return (
    <div className="flow-root">
      <ul className="-mb-8">
        {events.map((event, idx) => {
          const Icon = eventIcons[event.type] || CheckCircle;
          const colorClass = eventColors[event.type] || 'bg-gray-100 text-gray-600';
          const isLast = idx === events.length - 1;

          return (
            <li key={event.id}>
              <div className="relative pb-8">
                {!isLast && (
                  <span
                    className="absolute left-4 top-4 -ml-px h-full w-0.5 bg-gray-200 dark:bg-gray-700"
                    aria-hidden="true"
                  />
                )}
                <div className="relative flex space-x-3">
                  <div>
                    <span
                      className={`flex h-8 w-8 items-center justify-center rounded-full ${colorClass}`}
                    >
                      <Icon className="h-4 w-4" />
                    </span>
                  </div>
                  <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                    <div>
                      <p className="text-sm text-gray-700 dark:text-gray-300">{event.description}</p>
                      {event.metadata?.prUrl && (
                        <a
                          href={event.metadata.prUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-1 inline-flex items-center gap-1 text-sm text-brand-600 hover:underline"
                        >
                          <GitPullRequest className="h-3 w-3" />
                          Ver Pull Request
                        </a>
                      )}
                    </div>
                    <div className="whitespace-nowrap text-right text-xs text-gray-500 dark:text-gray-400">
                      {formatDate(event.createdAt)}
                    </div>
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
