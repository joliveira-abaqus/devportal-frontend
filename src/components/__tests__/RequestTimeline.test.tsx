import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import RequestTimeline from '../RequestTimeline';
import type { RequestEvent } from '@/types';

const mockEvents: RequestEvent[] = [
  {
    id: 'evt-1',
    requestId: 'req-1',
    type: 'status_change',
    description: 'Status alterado para Em Progresso',
    createdAt: '2024-06-15T10:00:00Z',
  },
  {
    id: 'evt-2',
    requestId: 'req-1',
    type: 'pr_linked',
    description: 'Pull Request vinculado',
    metadata: { prUrl: 'https://github.com/org/repo/pull/1' },
    createdAt: '2024-06-15T11:00:00Z',
  },
  {
    id: 'evt-3',
    requestId: 'req-1',
    type: 'comment',
    description: 'Comentário adicionado',
    createdAt: '2024-06-15T12:00:00Z',
  },
];

describe('RequestTimeline', () => {
  it('mostra mensagem quando events é array vazio', () => {
    render(<RequestTimeline events={[]} />);
    expect(screen.getByText('Nenhum evento registrado ainda.')).toBeInTheDocument();
  });

  it('mostra mensagem quando events é undefined', () => {
    render(<RequestTimeline events={undefined as unknown as RequestEvent[]} />);
    expect(screen.getByText('Nenhum evento registrado ainda.')).toBeInTheDocument();
  });

  it('renderiza cada evento com descrição', () => {
    render(<RequestTimeline events={mockEvents} />);
    expect(screen.getByText('Status alterado para Em Progresso')).toBeInTheDocument();
    expect(screen.getByText('Pull Request vinculado')).toBeInTheDocument();
    expect(screen.getByText('Comentário adicionado')).toBeInTheDocument();
  });

  it('renderiza link do PR quando metadata.prUrl existe', () => {
    render(<RequestTimeline events={mockEvents} />);
    const prLink = screen.getByText('Ver Pull Request');
    expect(prLink).toBeInTheDocument();
    expect(prLink).toHaveAttribute('href', 'https://github.com/org/repo/pull/1');
    expect(prLink).toHaveAttribute('target', '_blank');
  });

  it('renderiza a quantidade correta de eventos', () => {
    const { container } = render(<RequestTimeline events={mockEvents} />);
    const items = container.querySelectorAll('li');
    expect(items).toHaveLength(3);
  });
});
