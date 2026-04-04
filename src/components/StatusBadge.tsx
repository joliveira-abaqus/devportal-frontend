import Badge from '@/components/ui/Badge';
import type { RequestStatus } from '@/types';
import { requestStatusLabels } from '@/lib/utils';

interface StatusBadgeProps {
  status: RequestStatus;
}

const statusVariants: Record<RequestStatus, 'default' | 'success' | 'warning' | 'error' | 'info'> = {
  pending: 'default',
  in_progress: 'info',
  review: 'warning',
  done: 'success',
  failed: 'error',
};

export default function StatusBadge({ status }: StatusBadgeProps) {
  return <Badge variant={statusVariants[status]}>{requestStatusLabels[status]}</Badge>;
}
