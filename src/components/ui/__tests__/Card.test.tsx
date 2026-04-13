import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Card from '../Card';

describe('Card', () => {
  it('renderiza children', () => {
    render(<Card>Conteúdo do card</Card>);
    expect(screen.getByText('Conteúdo do card')).toBeInTheDocument();
  });

  it('aplica className customizado', () => {
    render(<Card className="my-custom-class">Content</Card>);
    const card = screen.getByText('Content').closest('div');
    expect(card).toHaveClass('my-custom-class');
  });

  it('passa props extras para o div', () => {
    render(<Card data-testid="custom-card">Content</Card>);
    expect(screen.getByTestId('custom-card')).toBeInTheDocument();
  });
});
