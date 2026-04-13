import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Card from '../Card';

describe('Card', () => {
  it('renderiza children', () => {
    render(<Card>Conteúdo</Card>);
    expect(screen.getByText('Conteúdo')).toBeInTheDocument();
  });

  it('aplica className adicional', () => {
    render(<Card className="custom-class">Card</Card>);
    const card = screen.getByText('Card').closest('div');
    expect(card?.className).toContain('custom-class');
  });

  it('passa props extras para o div', () => {
    render(<Card data-testid="my-card">Props</Card>);
    expect(screen.getByTestId('my-card')).toBeInTheDocument();
  });
});
