import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Badge from './Badge';

describe('Badge', () => {
  it('deve renderizar texto', () => {
    render(<Badge>Pendente</Badge>);
    expect(screen.getByText('Pendente')).toBeInTheDocument();
  });

  it('deve aplicar variante default por padrão', () => {
    render(<Badge>Default</Badge>);
    const badge = screen.getByText('Default');
    expect(badge.className).toContain('bg-gray-100');
  });

  it('deve aplicar variante success', () => {
    render(<Badge variant="success">Concluído</Badge>);
    const badge = screen.getByText('Concluído');
    expect(badge.className).toContain('bg-green-100');
  });

  it('deve aplicar variante warning', () => {
    render(<Badge variant="warning">Em Revisão</Badge>);
    const badge = screen.getByText('Em Revisão');
    expect(badge.className).toContain('bg-yellow-100');
  });

  it('deve aplicar variante error', () => {
    render(<Badge variant="error">Falhou</Badge>);
    const badge = screen.getByText('Falhou');
    expect(badge.className).toContain('bg-red-100');
  });

  it('deve aplicar variante info', () => {
    render(<Badge variant="info">Em Progresso</Badge>);
    const badge = screen.getByText('Em Progresso');
    expect(badge.className).toContain('bg-blue-100');
  });

  it('deve aceitar className personalizado', () => {
    render(<Badge className="extra-class">Custom</Badge>);
    const badge = screen.getByText('Custom');
    expect(badge.className).toContain('extra-class');
  });
});
