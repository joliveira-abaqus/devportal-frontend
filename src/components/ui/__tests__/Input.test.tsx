import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { createRef } from 'react';
import Input from '../Input';

describe('Input', () => {
  it('renderiza sem label', () => {
    render(<Input id="test" />);
    expect(screen.queryByRole('textbox')).toBeInTheDocument();
    expect(screen.queryByText(/label/i)).not.toBeInTheDocument();
  });

  it('renderiza com label associada ao id', () => {
    render(<Input id="email" label="Email" />);
    const label = screen.getByText('Email');
    expect(label).toBeInTheDocument();
    expect(label.tagName).toBe('LABEL');
    expect(label).toHaveAttribute('for', 'email');
  });

  it('mostra mensagem de erro', () => {
    render(<Input id="test" error="Campo obrigatório" />);
    expect(screen.getByText('Campo obrigatório')).toBeInTheDocument();
  });

  it('aplica classe de erro no input', () => {
    render(<Input id="test" error="Erro" />);
    const input = screen.getByRole('textbox');
    expect(input.className).toContain('border-red-300');
  });

  it('aceita ref', () => {
    const ref = createRef<HTMLInputElement>();
    render(<Input ref={ref} id="test" />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });
});
