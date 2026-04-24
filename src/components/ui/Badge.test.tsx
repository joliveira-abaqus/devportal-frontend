import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Badge from './Badge';

describe('Badge', () => {
  it('renderiza conteúdo filho', () => {
    render(<Badge>Pendente</Badge>);
    expect(screen.getByText('Pendente')).toBeInTheDocument();
  });

  it('aplica variante default por padrão', () => {
    render(<Badge>Default</Badge>);
    const badge = screen.getByText('Default');
    expect(badge.className).toContain('bg-gray-100');
  });

  it('aplica variante success', () => {
    render(<Badge variant="success">Concluído</Badge>);
    const badge = screen.getByText('Concluído');
    expect(badge.className).toContain('bg-green-100');
  });

  it('aplica variante warning', () => {
    render(<Badge variant="warning">Revisão</Badge>);
    const badge = screen.getByText('Revisão');
    expect(badge.className).toContain('bg-yellow-100');
  });

  it('aplica variante error', () => {
    render(<Badge variant="error">Falhou</Badge>);
    const badge = screen.getByText('Falhou');
    expect(badge.className).toContain('bg-red-100');
  });

  it('aplica variante info', () => {
    render(<Badge variant="info">Em Progresso</Badge>);
    const badge = screen.getByText('Em Progresso');
    expect(badge.className).toContain('bg-blue-100');
  });

  it('aceita className customizado', () => {
    render(<Badge className="ml-2">Custom</Badge>);
    const badge = screen.getByText('Custom');
    expect(badge.className).toContain('ml-2');
  });
});
