import { render, screen } from '@testing-library/react';
import Badge from '@/components/ui/Badge';

describe('Badge', () => {
  it('deve renderizar o conteúdo filho', () => {
    render(<Badge>Pendente</Badge>);
    expect(screen.getByText('Pendente')).toBeInTheDocument();
  });

  it('deve aplicar variante default por padrão', () => {
    render(<Badge>Teste</Badge>);
    const badge = screen.getByText('Teste');
    expect(badge).toHaveClass('bg-gray-100');
  });

  it('deve aplicar variante success', () => {
    render(<Badge variant="success">Concluído</Badge>);
    const badge = screen.getByText('Concluído');
    expect(badge).toHaveClass('bg-green-100');
  });

  it('deve aplicar variante warning', () => {
    render(<Badge variant="warning">Em Revisão</Badge>);
    const badge = screen.getByText('Em Revisão');
    expect(badge).toHaveClass('bg-yellow-100');
  });

  it('deve aplicar variante error', () => {
    render(<Badge variant="error">Falhou</Badge>);
    const badge = screen.getByText('Falhou');
    expect(badge).toHaveClass('bg-red-100');
  });

  it('deve aplicar variante info', () => {
    render(<Badge variant="info">Em Progresso</Badge>);
    const badge = screen.getByText('Em Progresso');
    expect(badge).toHaveClass('bg-blue-100');
  });

  it('deve aceitar className adicional', () => {
    render(<Badge className="custom-class">Teste</Badge>);
    const badge = screen.getByText('Teste');
    expect(badge).toHaveClass('custom-class');
  });
});
