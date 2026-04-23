import { render, screen } from '@testing-library/react';
import Card from '@/components/ui/Card';

describe('Card', () => {
  it('deve renderizar o conteúdo filho', () => {
    render(<Card>Conteúdo do card</Card>);
    expect(screen.getByText('Conteúdo do card')).toBeInTheDocument();
  });

  it('deve aplicar classes base', () => {
    const { container } = render(<Card>Teste</Card>);
    const card = container.firstChild as HTMLElement;
    expect(card).toHaveClass('rounded-lg');
    expect(card).toHaveClass('bg-white');
    expect(card).toHaveClass('shadow-sm');
  });

  it('deve aceitar className adicional', () => {
    const { container } = render(<Card className="custom-class">Teste</Card>);
    const card = container.firstChild as HTMLElement;
    expect(card).toHaveClass('custom-class');
  });

  it('deve repassar props HTML adicionais', () => {
    render(<Card data-testid="meu-card">Teste</Card>);
    expect(screen.getByTestId('meu-card')).toBeInTheDocument();
  });
});
