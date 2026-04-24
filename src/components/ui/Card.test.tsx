import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Card from './Card';

describe('Card', () => {
  it('renderiza conteúdo filho', () => {
    render(<Card>Conteúdo do card</Card>);
    expect(screen.getByText('Conteúdo do card')).toBeInTheDocument();
  });

  it('aplica classes padrão de estilo', () => {
    render(<Card>Conteúdo</Card>);
    const card = screen.getByText('Conteúdo').closest('div');
    expect(card?.className).toContain('rounded-lg');
    expect(card?.className).toContain('shadow-sm');
  });

  it('aceita className customizado', () => {
    render(<Card className="mt-4">Conteúdo</Card>);
    const card = screen.getByText('Conteúdo').closest('div');
    expect(card?.className).toContain('mt-4');
  });

  it('repassa props HTML adicionais', () => {
    render(<Card data-testid="meu-card">Conteúdo</Card>);
    expect(screen.getByTestId('meu-card')).toBeInTheDocument();
  });
});
