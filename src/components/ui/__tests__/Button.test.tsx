import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import Button from '../Button';

describe('Button', () => {
  it('renderiza com variante padrão primary e tamanho md', () => {
    render(<Button>Clique</Button>);
    const btn = screen.getByRole('button', { name: 'Clique' });
    expect(btn).toBeInTheDocument();
    expect(btn.className).toContain('bg-brand-600');
    expect(btn.className).toContain('px-4');
  });

  it('renderiza variante primary', () => {
    render(<Button variant="primary">Primary</Button>);
    expect(screen.getByRole('button').className).toContain('bg-brand-600');
  });

  it('renderiza variante outline', () => {
    render(<Button variant="outline">Outline</Button>);
    expect(screen.getByRole('button').className).toContain('border');
  });

  it('renderiza variante ghost', () => {
    render(<Button variant="ghost">Ghost</Button>);
    expect(screen.getByRole('button').className).toContain('hover:bg-gray-100');
  });

  it('renderiza variante danger', () => {
    render(<Button variant="danger">Danger</Button>);
    expect(screen.getByRole('button').className).toContain('bg-red-600');
  });

  it('renderiza variante secondary', () => {
    render(<Button variant="secondary">Secondary</Button>);
    expect(screen.getByRole('button').className).toContain('bg-gray-100');
  });

  it('mostra spinner e desabilita quando isLoading=true', () => {
    render(<Button isLoading>Enviar</Button>);
    const btn = screen.getByRole('button');
    expect(btn).toBeDisabled();
    expect(btn).toHaveTextContent('Carregando...');
    expect(btn.querySelector('svg')).toBeInTheDocument();
  });

  it('desabilita o botão quando disabled=true', () => {
    render(<Button disabled>Desabilitado</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('encaminha ref corretamente', () => {
    const ref = createRef<HTMLButtonElement>();
    render(<Button ref={ref}>Com Ref</Button>);
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
    expect(ref.current?.textContent).toBe('Com Ref');
  });

  it('propaga eventos de click', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Clique</Button>);
    await user.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledOnce();
  });
});
