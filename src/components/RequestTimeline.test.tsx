import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import RequestTimeline from './RequestTimeline';
import type { RequestEvent } from '@/types';

const mockEvents: RequestEvent[] = [
  {
    id: 'evt-1',
    requestId: '1',
    type: 'status_change',
    description: 'Status alterado para Pendente',
    createdAt: '2024-01-15T10:00:00Z',
  },
  {
    id: 'evt-2',
    requestId: '1',
    type: 'comment',
    description: 'Comentário adicionado pelo desenvolvedor',
    createdAt: '2024-01-15T11:00:00Z',
  },
  {
    id: 'evt-3',
    requestId: '1',
    type: 'pr_linked',
    description: 'Pull Request vinculado',
    metadata: { prUrl: 'https://github.com/org/repo/pull/1' },
    createdAt: '2024-01-15T12:00:00Z',
  },
];

describe('RequestTimeline', () => {
  it('deve exibir mensagem quando não há eventos', () => {
    render(<RequestTimeline events={[]} />);
    expect(screen.getByText('Nenhum evento registrado ainda.')).toBeInTheDocument();
  });

  it('deve renderizar eventos', () => {
    render(<RequestTimeline events={mockEvents} />);
    expect(screen.getByText('Status alterado para Pendente')).toBeInTheDocument();
    expect(screen.getByText('Comentário adicionado pelo desenvolvedor')).toBeInTheDocument();
    expect(screen.getByText('Pull Request vinculado')).toBeInTheDocument();
  });

  it('deve exibir link do PR quando metadata contém prUrl', () => {
    render(<RequestTimeline events={mockEvents} />);
    const prLink = screen.getByText('Ver Pull Request');
    expect(prLink).toBeInTheDocument();
    expect(prLink).toHaveAttribute('href', 'https://github.com/org/repo/pull/1');
    expect(prLink).toHaveAttribute('target', '_blank');
  });

  it('deve formatar datas dos eventos', () => {
    render(<RequestTimeline events={[mockEvents[0]]} />);
    expect(screen.getByText(/15\/01\/2024/)).toBeInTheDocument();
  });
});
