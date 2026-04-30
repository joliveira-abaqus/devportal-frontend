import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Input from './Input';

describe('Input', () => {
  it('renderiza com label', () => {
    render(<Input id="email" label="Email" />);
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
  });

  it('renderiza sem label', () => {
    render(<Input id="field" placeholder="Digite..." />);
    expect(screen.getByPlaceholderText('Digite...')).toBeInTheDocument();
  });

  it('exibe mensagem de erro', () => {
    render(<Input id="email" label="Email" error="Email inválido" />);
    expect(screen.getByText('Email inválido')).toBeInTheDocument();
  });

  it('aplica classe de erro no input', () => {
    render(<Input id="email" label="Email" error="Obrigatório" />);
    const input = screen.getByLabelText('Email');
    expect(input.className).toContain('border-red-300');
  });

  it('aceita digitação do usuário', async () => {
    const user = userEvent.setup();
    render(<Input id="name" label="Nome" />);

    const input = screen.getByLabelText('Nome');
    await user.type(input, 'João');
    expect(input).toHaveValue('João');
  });

  it('suporta tipo password', () => {
    render(<Input id="pass" label="Senha" type="password" />);
    expect(screen.getByLabelText('Senha')).toHaveAttribute('type', 'password');
  });
});
