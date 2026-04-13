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
    createdAt: '2024-06-15T14:30:00Z',
  },
  {
    id: 'evt-2',
    requestId: 'req-1',
    type: 'pr_linked',
    description: 'Pull Request vinculado',
    metadata: { prUrl: 'https://github.com/org/repo/pull/1' },
    createdAt: '2024-06-15T15:00:00Z',
  },
];

describe('RequestTimeline', () => {
  it('exibe mensagem "Nenhum evento registrado ainda." quando events é array vazio', () => {
    render(<RequestTimeline events={[]} />);
    expect(screen.getByText('Nenhum evento registrado ainda.')).toBeInTheDocument();
  });

  it('exibe mensagem quando events é undefined/null', () => {
    // @ts-expect-error - testando cenário de events undefined
    render(<RequestTimeline events={undefined} />);
    expect(screen.getByText('Nenhum evento registrado ainda.')).toBeInTheDocument();
  });

  it('renderiza lista de eventos com descrição e data formatada', () => {
    render(<RequestTimeline events={mockEvents} />);
    expect(screen.getByText('Status alterado para Em Progresso')).toBeInTheDocument();
    expect(screen.getByText('Pull Request vinculado')).toBeInTheDocument();
    const dateElements = screen.getAllByText(/15\/06\/2024/);
    expect(dateElements.length).toBeGreaterThanOrEqual(1);
  });

  it('renderiza link "Ver Pull Request" quando event.metadata.prUrl existe', () => {
    render(<RequestTimeline events={mockEvents} />);
    const prLink = screen.getByText('Ver Pull Request');
    expect(prLink).toBeInTheDocument();
    expect(prLink.closest('a')).toHaveAttribute(
      'href',
      'https://github.com/org/repo/pull/1',
    );
  });

  it('não renderiza link de PR quando metadata.prUrl não existe', () => {
    const eventsWithoutPr: RequestEvent[] = [
      {
        id: 'evt-1',
        requestId: 'req-1',
        type: 'status_change',
        description: 'Status alterado',
        createdAt: '2024-06-15T14:30:00Z',
      },
    ];
    render(<RequestTimeline events={eventsWithoutPr} />);
    expect(screen.queryByText('Ver Pull Request')).not.toBeInTheDocument();
  });
});
