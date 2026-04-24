import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Button from './Button';

describe('Button', () => {
  it('renderiza com texto', () => {
    render(<Button>Clique aqui</Button>);
    expect(screen.getByRole('button', { name: 'Clique aqui' })).toBeInTheDocument();
  });

  it('aplica variante primary por padrão', () => {
    render(<Button>Enviar</Button>);
    const button = screen.getByRole('button');
    expect(button.className).toContain('bg-brand-600');
  });

  it('aplica variante secondary', () => {
    render(<Button variant="secondary">Cancelar</Button>);
    const button = screen.getByRole('button');
    expect(button.className).toContain('bg-gray-100');
  });

  it('aplica variante outline', () => {
    render(<Button variant="outline">Outline</Button>);
    const button = screen.getByRole('button');
    expect(button.className).toContain('border');
  });

  it('aplica variante ghost', () => {
    render(<Button variant="ghost">Ghost</Button>);
    const button = screen.getByRole('button');
    expect(button.className).toContain('hover:bg-gray-100');
  });

  it('aplica variante danger', () => {
    render(<Button variant="danger">Excluir</Button>);
    const button = screen.getByRole('button');
    expect(button.className).toContain('bg-red-600');
  });

  it('aplica tamanho sm', () => {
    render(<Button size="sm">Pequeno</Button>);
    const button = screen.getByRole('button');
    expect(button.className).toContain('px-3');
  });

  it('aplica tamanho lg', () => {
    render(<Button size="lg">Grande</Button>);
    const button = screen.getByRole('button');
    expect(button.className).toContain('px-6');
  });

  it('exibe estado de loading', () => {
    render(<Button isLoading>Salvando</Button>);
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    expect(screen.getByText('Carregando...')).toBeInTheDocument();
  });

  it('desabilita o botão quando disabled', () => {
    render(<Button disabled>Desabilitado</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('chama onClick ao clicar', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Clique</Button>);
    await user.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('não chama onClick quando desabilitado', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();
    render(<Button disabled onClick={handleClick}>Clique</Button>);
    await user.click(screen.getByRole('button'));
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('aceita className customizado', () => {
    render(<Button className="custom-class">Custom</Button>);
    const button = screen.getByRole('button');
    expect(button.className).toContain('custom-class');
  });
});
