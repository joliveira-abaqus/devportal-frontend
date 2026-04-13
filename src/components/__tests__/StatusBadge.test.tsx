import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import StatusBadge from '../StatusBadge';

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

  it('usa variante success para status done', () => {
    render(<StatusBadge status="done" />);
    const badge = screen.getByText('Concluído');
    expect(badge.className).toContain('bg-green-100');
  });

  it('usa variante error para status failed', () => {
    render(<StatusBadge status="failed" />);
    const badge = screen.getByText('Falhou');
    expect(badge.className).toContain('bg-red-100');
  });

  it('usa variante warning para status review', () => {
    render(<StatusBadge status="review" />);
    const badge = screen.getByText('Em Revisão');
    expect(badge.className).toContain('bg-yellow-100');
  });

  it('usa variante info para status in_progress', () => {
    render(<StatusBadge status="in_progress" />);
    const badge = screen.getByText('Em Progresso');
    expect(badge.className).toContain('bg-blue-100');
  });

  it('usa variante default para status pending', () => {
    render(<StatusBadge status="pending" />);
    const badge = screen.getByText('Pendente');
    expect(badge.className).toContain('bg-gray-100');
  });
});
