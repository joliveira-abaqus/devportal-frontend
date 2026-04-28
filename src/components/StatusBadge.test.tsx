import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import StatusBadge from './StatusBadge';

describe('StatusBadge', () => {
  it('deve renderizar status pendente', () => {
    render(<StatusBadge status="pending" />);
    expect(screen.getByText('Pendente')).toBeInTheDocument();
  });

  it('deve renderizar status em progresso', () => {
    render(<StatusBadge status="in_progress" />);
    expect(screen.getByText('Em Progresso')).toBeInTheDocument();
  });

  it('deve renderizar status em revisão', () => {
    render(<StatusBadge status="review" />);
    expect(screen.getByText('Em Revisão')).toBeInTheDocument();
  });

  it('deve renderizar status concluído', () => {
    render(<StatusBadge status="done" />);
    expect(screen.getByText('Concluído')).toBeInTheDocument();
  });

  it('deve renderizar status falhou', () => {
    render(<StatusBadge status="failed" />);
    expect(screen.getByText('Falhou')).toBeInTheDocument();
  });
});
