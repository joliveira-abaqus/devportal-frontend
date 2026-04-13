import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Badge from '../Badge';

describe('Badge', () => {
  it('renderiza children corretamente', () => {
    render(<Badge>Teste</Badge>);
    expect(screen.getByText('Teste')).toBeInTheDocument();
  });

  it('aplica variante default por padrão', () => {
    render(<Badge>Default</Badge>);
    const badge = screen.getByText('Default');
    expect(badge.className).toContain('bg-gray-100');
  });

  it('aplica classes para variante success', () => {
    render(<Badge variant="success">Sucesso</Badge>);
    const badge = screen.getByText('Sucesso');
    expect(badge.className).toContain('bg-green-100');
  });

  it('aplica classes para variante warning', () => {
    render(<Badge variant="warning">Aviso</Badge>);
    const badge = screen.getByText('Aviso');
    expect(badge.className).toContain('bg-yellow-100');
  });

  it('aplica classes para variante error', () => {
    render(<Badge variant="error">Erro</Badge>);
    const badge = screen.getByText('Erro');
    expect(badge.className).toContain('bg-red-100');
  });

  it('aplica classes para variante info', () => {
    render(<Badge variant="info">Info</Badge>);
    const badge = screen.getByText('Info');
    expect(badge.className).toContain('bg-blue-100');
  });

  it('aceita className adicional', () => {
    render(<Badge className="extra-class">Custom</Badge>);
    const badge = screen.getByText('Custom');
    expect(badge.className).toContain('extra-class');
  });
});
