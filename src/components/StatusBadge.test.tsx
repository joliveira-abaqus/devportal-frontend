import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import StatusBadge from './StatusBadge';

describe('StatusBadge', () => {
  it('renderiza label "Pendente" para status pending', () => {
    render(<StatusBadge status="pending" />);
    expect(screen.getByText('Pendente')).toBeInTheDocument();
  });

  it('renderiza label "Em Progresso" para status in_progress', () => {
    render(<StatusBadge status="in_progress" />);
    expect(screen.getByText('Em Progresso')).toBeInTheDocument();
  });

  it('renderiza label "Em Revisão" para status review', () => {
    render(<StatusBadge status="review" />);
    expect(screen.getByText('Em Revisão')).toBeInTheDocument();
  });

  it('renderiza label "Concluído" para status done', () => {
    render(<StatusBadge status="done" />);
    expect(screen.getByText('Concluído')).toBeInTheDocument();
  });

  it('renderiza label "Falhou" para status failed', () => {
    render(<StatusBadge status="failed" />);
    expect(screen.getByText('Falhou')).toBeInTheDocument();
  });
});
