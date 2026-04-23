import { render, screen } from '@testing-library/react';
import StatusBadge from '@/components/StatusBadge';
import type { RequestStatus } from '@/types';

describe('StatusBadge', () => {
  const statuses: { status: RequestStatus; label: string }[] = [
    { status: 'pending', label: 'Pendente' },
    { status: 'in_progress', label: 'Em Progresso' },
    { status: 'review', label: 'Em Revisão' },
    { status: 'done', label: 'Concluído' },
    { status: 'failed', label: 'Falhou' },
  ];

  statuses.forEach(({ status, label }) => {
    it(`deve renderizar label "${label}" para status "${status}"`, () => {
      render(<StatusBadge status={status} />);
      expect(screen.getByText(label)).toBeInTheDocument();
    });
  });

  it('deve aplicar variante success para status done', () => {
    render(<StatusBadge status="done" />);
    const badge = screen.getByText('Concluído');
    expect(badge).toHaveClass('bg-green-100');
  });

  it('deve aplicar variante error para status failed', () => {
    render(<StatusBadge status="failed" />);
    const badge = screen.getByText('Falhou');
    expect(badge).toHaveClass('bg-red-100');
  });

  it('deve aplicar variante info para status in_progress', () => {
    render(<StatusBadge status="in_progress" />);
    const badge = screen.getByText('Em Progresso');
    expect(badge).toHaveClass('bg-blue-100');
  });

  it('deve aplicar variante warning para status review', () => {
    render(<StatusBadge status="review" />);
    const badge = screen.getByText('Em Revisão');
    expect(badge).toHaveClass('bg-yellow-100');
  });

  it('deve aplicar variante default para status pending', () => {
    render(<StatusBadge status="pending" />);
    const badge = screen.getByText('Pendente');
    expect(badge).toHaveClass('bg-gray-100');
  });
});
