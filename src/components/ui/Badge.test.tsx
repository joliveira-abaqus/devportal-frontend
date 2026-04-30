import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Badge from './Badge';

describe('Badge', () => {
  it('renderiza conteúdo', () => {
    render(<Badge>Pendente</Badge>);
    expect(screen.getByText('Pendente')).toBeInTheDocument();
  });

  it('aplica variante default por padrão', () => {
    render(<Badge>Default</Badge>);
    expect(screen.getByText('Default').className).toContain('bg-gray-100');
  });

  it('aplica variante success', () => {
    render(<Badge variant="success">Sucesso</Badge>);
    expect(screen.getByText('Sucesso').className).toContain('bg-green-100');
  });

  it('aplica variante warning', () => {
    render(<Badge variant="warning">Alerta</Badge>);
    expect(screen.getByText('Alerta').className).toContain('bg-yellow-100');
  });

  it('aplica variante error', () => {
    render(<Badge variant="error">Erro</Badge>);
    expect(screen.getByText('Erro').className).toContain('bg-red-100');
  });

  it('aplica variante info', () => {
    render(<Badge variant="info">Info</Badge>);
    expect(screen.getByText('Info').className).toContain('bg-blue-100');
  });

  it('aceita className adicional', () => {
    render(<Badge className="custom-class">Custom</Badge>);
    expect(screen.getByText('Custom').className).toContain('custom-class');
  });
});
