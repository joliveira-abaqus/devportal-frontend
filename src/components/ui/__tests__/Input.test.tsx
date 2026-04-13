import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { createRef } from 'react';
import Input from '../Input';

describe('Input', () => {
  it('renderiza sem label quando label não é passado', () => {
    render(<Input id="test" />);
    expect(screen.queryByRole('textbox')).toBeInTheDocument();
    expect(screen.queryByText(/./)).toBeNull();
  });

  it('renderiza label quando passado', () => {
    render(<Input id="test" label="Nome" />);
    expect(screen.getByText('Nome')).toBeInTheDocument();
  });

  it('exibe mensagem de erro quando error é passado', () => {
    render(<Input id="test" error="Campo obrigatório" />);
    expect(screen.getByText('Campo obrigatório')).toBeInTheDocument();
  });

  it('aplica classe de erro no input quando error é passado', () => {
    render(<Input id="test" error="Erro" />);
    const input = screen.getByRole('textbox');
    expect(input).toHaveClass('border-red-300');
  });

  it('forwarda ref corretamente', () => {
    const ref = createRef<HTMLInputElement>();
    render(<Input ref={ref} id="test" />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });
});
