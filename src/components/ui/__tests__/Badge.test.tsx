import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Badge from '../Badge';

describe('Badge', () => {
  it('renderiza children corretamente', () => {
    render(<Badge>Texto do badge</Badge>);
    expect(screen.getByText('Texto do badge')).toBeInTheDocument();
  });

  it('aplica classe da variante default por padrão', () => {
    render(<Badge>Default</Badge>);
    const badge = screen.getByText('Default');
    expect(badge).toHaveClass('bg-gray-100');
  });

  it('aplica classes corretas para variante success', () => {
    render(<Badge variant="success">Sucesso</Badge>);
    const badge = screen.getByText('Sucesso');
    expect(badge).toHaveClass('bg-green-100');
  });

  it('aplica classes corretas para variante warning', () => {
    render(<Badge variant="warning">Alerta</Badge>);
    const badge = screen.getByText('Alerta');
    expect(badge).toHaveClass('bg-yellow-100');
  });

  it('aplica classes corretas para variante error', () => {
    render(<Badge variant="error">Erro</Badge>);
    const badge = screen.getByText('Erro');
    expect(badge).toHaveClass('bg-red-100');
  });

  it('aplica classes corretas para variante info', () => {
    render(<Badge variant="info">Info</Badge>);
    const badge = screen.getByText('Info');
    expect(badge).toHaveClass('bg-blue-100');
  });

  it('aceita className customizado', () => {
    render(<Badge className="custom-class">Custom</Badge>);
    const badge = screen.getByText('Custom');
    expect(badge).toHaveClass('custom-class');
  });
});
