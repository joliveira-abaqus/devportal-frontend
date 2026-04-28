import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Input from './Input';

describe('Input', () => {
  it('deve renderizar com label', () => {
    render(<Input id="email" label="Email" />);
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
  });

  it('deve renderizar sem label', () => {
    render(<Input id="name" placeholder="Digite seu nome" />);
    expect(screen.getByPlaceholderText('Digite seu nome')).toBeInTheDocument();
  });

  it('deve exibir mensagem de erro', () => {
    render(<Input id="email" label="Email" error="Email inválido" />);
    expect(screen.getByText('Email inválido')).toBeInTheDocument();
  });

  it('deve aplicar classe de erro no input', () => {
    render(<Input id="email" label="Email" error="Obrigatório" />);
    const input = screen.getByLabelText('Email');
    expect(input.className).toContain('border-red-300');
  });

  it('deve aceitar digitação', async () => {
    const user = userEvent.setup();
    render(<Input id="test" label="Teste" />);
    const input = screen.getByLabelText('Teste');
    await user.type(input, 'Hello');
    expect(input).toHaveValue('Hello');
  });

  it('deve propagar atributos HTML', () => {
    render(<Input id="email" type="email" placeholder="seu@email.com" />);
    const input = screen.getByPlaceholderText('seu@email.com');
    expect(input).toHaveAttribute('type', 'email');
  });
});
