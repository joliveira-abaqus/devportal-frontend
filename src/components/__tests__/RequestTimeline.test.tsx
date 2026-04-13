import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import RequestTimeline from '../RequestTimeline';
import type { RequestEvent } from '@/types';

const mockEvents: RequestEvent[] = [
  {
    id: 'ev-1',
    requestId: 'req-1',
    type: 'status_change',
    description: 'Status alterado para Em Progresso',
    createdAt: '2024-06-15T14:30:00Z',
  },
  {
    id: 'ev-2',
    requestId: 'req-1',
    type: 'pr_linked',
    description: 'Pull Request vinculado',
    metadata: { prUrl: 'https://github.com/org/repo/pull/1' },
    createdAt: '2024-06-15T15:00:00Z',
  },
];

describe('RequestTimeline', () => {
  it('renderiza mensagem vazia quando events=[]', () => {
    render(<RequestTimeline events={[]} />);
    expect(screen.getByText('Nenhum evento registrado ainda.')).toBeInTheDocument();
  });

  it('renderiza mensagem vazia quando events=undefined', () => {
    render(<RequestTimeline events={undefined as unknown as RequestEvent[]} />);
    expect(screen.getByText('Nenhum evento registrado ainda.')).toBeInTheDocument();
  });

  it('renderiza lista de eventos com descrição', () => {
    render(<RequestTimeline events={mockEvents} />);
    expect(screen.getByText('Status alterado para Em Progresso')).toBeInTheDocument();
    expect(screen.getByText('Pull Request vinculado')).toBeInTheDocument();
  });

  it('renderiza data formatada', () => {
    render(<RequestTimeline events={mockEvents} />);
    const dates = screen.getAllByText(/15\/06\/2024/);
    expect(dates.length).toBe(2);
  });

  it('renderiza link de PR quando metadata.prUrl existe', () => {
    render(<RequestTimeline events={mockEvents} />);
    const prLink = screen.getByText('Ver Pull Request');
    expect(prLink).toBeInTheDocument();
    expect(prLink).toHaveAttribute('href', 'https://github.com/org/repo/pull/1');
    expect(prLink).toHaveAttribute('target', '_blank');
  });

  it('não mostra linha conectora no último evento', () => {
    const { container } = render(<RequestTimeline events={mockEvents} />);
    const listItems = container.querySelectorAll('li');
    const lastItem = listItems[listItems.length - 1];
    // O último item não deve ter a span com a linha conectora (aria-hidden="true")
    expect(lastItem.querySelector('span[aria-hidden="true"]')).toBeNull();
  });

  it('mostra linha conectora em eventos que não são o último', () => {
    const { container } = render(<RequestTimeline events={mockEvents} />);
    const listItems = container.querySelectorAll('li');
    const firstItem = listItems[0];
    expect(firstItem.querySelector('span[aria-hidden="true"]')).not.toBeNull();
  });
});
