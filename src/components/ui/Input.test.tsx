import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Input from './Input';

describe('Input', () => {
  it('renderiza input básico', () => {
    render(<Input placeholder="Digite aqui" />);
    expect(screen.getByPlaceholderText('Digite aqui')).toBeInTheDocument();
  });

  it('renderiza com label quando fornecido', () => {
    render(<Input id="email" label="Email" />);
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
  });

  it('não renderiza label quando não fornecido', () => {
    render(<Input id="email" />);
    expect(screen.queryByRole('label')).not.toBeInTheDocument();
  });

  it('exibe mensagem de erro', () => {
    render(<Input error="Campo obrigatório" />);
    expect(screen.getByText('Campo obrigatório')).toBeInTheDocument();
  });

  it('aplica classe de erro ao input', () => {
    render(<Input error="Inválido" placeholder="test" />);
    const input = screen.getByPlaceholderText('test');
    expect(input.className).toContain('border-red-300');
  });

  it('aceita digitação do usuário', async () => {
    const user = userEvent.setup();
    render(<Input placeholder="Nome" />);
    const input = screen.getByPlaceholderText('Nome');
    await user.type(input, 'João');
    expect(input).toHaveValue('João');
  });

  it('aceita className customizado', () => {
    render(<Input className="w-64" placeholder="test" />);
    const input = screen.getByPlaceholderText('test');
    expect(input.className).toContain('w-64');
  });
});
