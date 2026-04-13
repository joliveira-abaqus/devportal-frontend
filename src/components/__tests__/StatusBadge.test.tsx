import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import StatusBadge from '../StatusBadge';
import type { RequestStatus } from '@/types';

describe('StatusBadge', () => {
  const statusTests: { status: RequestStatus; label: string; variant: string }[] = [
    { status: 'pending', label: 'Pendente', variant: 'bg-gray-100' },
    { status: 'in_progress', label: 'Em Progresso', variant: 'bg-blue-100' },
    { status: 'review', label: 'Em Revisão', variant: 'bg-yellow-100' },
    { status: 'done', label: 'Concluído', variant: 'bg-green-100' },
    { status: 'failed', label: 'Falhou', variant: 'bg-red-100' },
  ];

  statusTests.forEach(({ status, label, variant }) => {
    it(`renderiza label "${label}" para status ${status}`, () => {
      render(<StatusBadge status={status} />);
      expect(screen.getByText(label)).toBeInTheDocument();
    });

    it(`usa variante correta do Badge para status ${status}`, () => {
      render(<StatusBadge status={status} />);
      const badge = screen.getByText(label);
      expect(badge).toHaveClass(variant);
    });
  });
});
