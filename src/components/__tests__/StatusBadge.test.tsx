import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import StatusBadge from '../StatusBadge';
import { requestStatusLabels } from '@/lib/utils';
import type { RequestStatus } from '@/types';

const statusVariantMap: Record<RequestStatus, string> = {
  pending: 'bg-gray-100',
  in_progress: 'bg-blue-100',
  review: 'bg-yellow-100',
  done: 'bg-green-100',
  failed: 'bg-red-100',
};

describe('StatusBadge', () => {
  const statuses: RequestStatus[] = ['pending', 'in_progress', 'review', 'done', 'failed'];

  statuses.forEach((status) => {
    it(`renderiza label correto para status "${status}"`, () => {
      render(<StatusBadge status={status} />);
      expect(screen.getByText(requestStatusLabels[status])).toBeInTheDocument();
    });
  });

  statuses.forEach((status) => {
    it(`mapeia status "${status}" para variante de Badge correta`, () => {
      const { container } = render(<StatusBadge status={status} />);
      const badge = container.querySelector('span');
      expect(badge?.className).toContain(statusVariantMap[status]);
    });
  });
});
