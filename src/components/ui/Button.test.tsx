import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Button from './Button';

describe('Button', () => {
  it('renderiza com texto', () => {
    render(<Button>Clique aqui</Button>);
    expect(screen.getByRole('button', { name: /clique aqui/i })).toBeInTheDocument();
  });

  it('aplica variante primary por padrão', () => {
    render(<Button>Primário</Button>);
    const btn = screen.getByRole('button');
    expect(btn.className).toContain('bg-brand-600');
  });

  it('aplica variante outline', () => {
    render(<Button variant="outline">Outline</Button>);
    const btn = screen.getByRole('button');
    expect(btn.className).toContain('border');
  });

  it('aplica variante ghost', () => {
    render(<Button variant="ghost">Ghost</Button>);
    const btn = screen.getByRole('button');
    expect(btn.className).toContain('hover:bg-gray-100');
  });

  it('aplica tamanho sm', () => {
    render(<Button size="sm">Pequeno</Button>);
    const btn = screen.getByRole('button');
    expect(btn.className).toContain('px-3');
  });

  it('aplica tamanho lg', () => {
    render(<Button size="lg">Grande</Button>);
    const btn = screen.getByRole('button');
    expect(btn.className).toContain('px-6');
  });

  it('exibe indicador de loading quando isLoading=true', () => {
    render(<Button isLoading>Enviar</Button>);
    const btn = screen.getByRole('button');
    expect(btn).toBeDisabled();
    expect(btn).toHaveTextContent('Carregando...');
  });

  it('fica desabilitado quando disabled=true', () => {
    render(<Button disabled>Desabilitado</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('chama onClick ao clicar', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Ação</Button>);

    await user.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('não chama onClick quando desabilitado', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();
    render(<Button disabled onClick={handleClick}>Desabilitado</Button>);

    await user.click(screen.getByRole('button'));
    expect(handleClick).not.toHaveBeenCalled();
  });
});
