import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Card from './Card';

describe('Card', () => {
  it('deve renderizar filhos', () => {
    render(<Card><p>Conteúdo do card</p></Card>);
    expect(screen.getByText('Conteúdo do card')).toBeInTheDocument();
  });

  it('deve aplicar classes padrão', () => {
    render(<Card data-testid="card">Conteúdo</Card>);
    const card = screen.getByTestId('card');
    expect(card.className).toContain('rounded-lg');
    expect(card.className).toContain('bg-white');
    expect(card.className).toContain('shadow-sm');
  });

  it('deve aceitar className personalizado', () => {
    render(<Card className="custom-class" data-testid="card">Conteúdo</Card>);
    const card = screen.getByTestId('card');
    expect(card.className).toContain('custom-class');
  });
});
