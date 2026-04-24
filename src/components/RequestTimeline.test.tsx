import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import RequestTimeline from './RequestTimeline';
import type { RequestEvent } from '@/types';

const mockEvents: RequestEvent[] = [
  {
    id: '1',
    requestId: 'req-1',
    type: 'status_change',
    description: 'Status alterado para Em Progresso',
    createdAt: '2024-03-15T14:00:00Z',
  },
  {
    id: '2',
    requestId: 'req-1',
    type: 'comment',
    description: 'Comentário adicionado',
    createdAt: '2024-03-15T15:00:00Z',
  },
  {
    id: '3',
    requestId: 'req-1',
    type: 'pr_linked',
    description: 'Pull Request vinculado',
    metadata: { prUrl: 'https://github.com/org/repo/pull/1' },
    createdAt: '2024-03-15T16:00:00Z',
  },
  {
    id: '4',
    requestId: 'req-1',
    type: 'file_attached',
    description: 'Arquivo anexado',
    createdAt: '2024-03-15T17:00:00Z',
  },
];

describe('RequestTimeline', () => {
  it('exibe mensagem quando não há eventos', () => {
    render(<RequestTimeline events={[]} />);
    expect(screen.getByText('Nenhum evento registrado ainda.')).toBeInTheDocument();
  });

  it('exibe mensagem quando events é undefined', () => {
    render(<RequestTimeline events={undefined as unknown as RequestEvent[]} />);
    expect(screen.getByText('Nenhum evento registrado ainda.')).toBeInTheDocument();
  });

  it('renderiza todos os eventos', () => {
    render(<RequestTimeline events={mockEvents} />);
    expect(screen.getByText('Status alterado para Em Progresso')).toBeInTheDocument();
    expect(screen.getByText('Comentário adicionado')).toBeInTheDocument();
    expect(screen.getByText('Pull Request vinculado')).toBeInTheDocument();
    expect(screen.getByText('Arquivo anexado')).toBeInTheDocument();
  });

  it('renderiza link de PR quando metadata contém prUrl', () => {
    render(<RequestTimeline events={mockEvents} />);
    const prLink = screen.getByText('Ver Pull Request');
    expect(prLink).toBeInTheDocument();
    expect(prLink).toHaveAttribute('href', 'https://github.com/org/repo/pull/1');
    expect(prLink).toHaveAttribute('target', '_blank');
  });

  it('exibe datas formatadas para cada evento', () => {
    render(<RequestTimeline events={[mockEvents[0]]} />);
    expect(screen.getByText(/15\/03\/2024/)).toBeInTheDocument();
  });
});
