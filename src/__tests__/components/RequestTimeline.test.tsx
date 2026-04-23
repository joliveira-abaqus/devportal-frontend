import { render, screen } from '@testing-library/react';
import RequestTimeline from '@/components/RequestTimeline';
import type { RequestEvent } from '@/types';

const mockEvents: RequestEvent[] = [
  {
    id: '1',
    requestId: 'req-1',
    type: 'status_change',
    description: 'Status alterado para Em Progresso',
    createdAt: '2024-06-15T10:00:00Z',
  },
  {
    id: '2',
    requestId: 'req-1',
    type: 'comment',
    description: 'Comentário adicionado',
    createdAt: '2024-06-15T11:00:00Z',
  },
  {
    id: '3',
    requestId: 'req-1',
    type: 'pr_linked',
    description: 'Pull Request vinculado',
    metadata: { prUrl: 'https://github.com/org/repo/pull/1' },
    createdAt: '2024-06-15T12:00:00Z',
  },
  {
    id: '4',
    requestId: 'req-1',
    type: 'file_attached',
    description: 'Arquivo anexado',
    createdAt: '2024-06-15T13:00:00Z',
  },
];

describe('RequestTimeline', () => {
  it('deve exibir mensagem quando não há eventos', () => {
    render(<RequestTimeline events={[]} />);
    expect(screen.getByText('Nenhum evento registrado ainda.')).toBeInTheDocument();
  });

  it('deve exibir mensagem quando events é undefined', () => {
    render(<RequestTimeline events={undefined as unknown as RequestEvent[]} />);
    expect(screen.getByText('Nenhum evento registrado ainda.')).toBeInTheDocument();
  });

  it('deve renderizar todos os eventos', () => {
    render(<RequestTimeline events={mockEvents} />);
    expect(screen.getByText('Status alterado para Em Progresso')).toBeInTheDocument();
    expect(screen.getByText('Comentário adicionado')).toBeInTheDocument();
    expect(screen.getByText('Pull Request vinculado')).toBeInTheDocument();
    expect(screen.getByText('Arquivo anexado')).toBeInTheDocument();
  });

  it('deve exibir link do PR quando metadata.prUrl está presente', () => {
    render(<RequestTimeline events={mockEvents} />);
    const prLink = screen.getByText('Ver Pull Request');
    expect(prLink).toBeInTheDocument();
    expect(prLink).toHaveAttribute('href', 'https://github.com/org/repo/pull/1');
    expect(prLink).toHaveAttribute('target', '_blank');
  });

  it('deve formatar datas dos eventos', () => {
    render(<RequestTimeline events={[mockEvents[0]]} />);
    expect(screen.getByText(/15\/06\/2024/)).toBeInTheDocument();
  });
});
