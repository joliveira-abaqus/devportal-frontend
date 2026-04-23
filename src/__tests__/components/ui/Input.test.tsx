import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Input from '@/components/ui/Input';

describe('Input', () => {
  it('deve renderizar o input', () => {
    render(<Input id="test" />);
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('deve renderizar o label quando fornecido', () => {
    render(<Input id="email" label="Email" />);
    expect(screen.getByText('Email')).toBeInTheDocument();
  });

  it('deve associar label ao input pelo id', () => {
    render(<Input id="email" label="Email" />);
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
  });

  it('deve exibir mensagem de erro quando fornecida', () => {
    render(<Input id="email" error="Email inválido" />);
    expect(screen.getByText('Email inválido')).toBeInTheDocument();
  });

  it('deve aplicar classe de erro quando error está presente', () => {
    render(<Input id="email" error="Obrigatório" />);
    expect(screen.getByRole('textbox')).toHaveClass('border-red-300');
  });

  it('deve aceitar digitação do usuário', async () => {
    const user = userEvent.setup();
    render(<Input id="nome" label="Nome" />);

    const input = screen.getByLabelText('Nome');
    await user.type(input, 'João');
    expect(input).toHaveValue('João');
  });

  it('deve aplicar placeholder', () => {
    render(<Input id="email" placeholder="seu@email.com" />);
    expect(screen.getByPlaceholderText('seu@email.com')).toBeInTheDocument();
  });

  it('deve aplicar tipo password', () => {
    render(<Input id="senha" type="password" label="Senha" />);
    const input = screen.getByLabelText('Senha');
    expect(input).toHaveAttribute('type', 'password');
  });

  it('não deve renderizar label quando não fornecido', () => {
    const { container } = render(<Input id="test" />);
    expect(container.querySelector('label')).not.toBeInTheDocument();
  });

  it('não deve renderizar erro quando não fornecido', () => {
    const { container } = render(<Input id="test" />);
    const errorP = container.querySelector('p.text-red-600, p.text-sm.text-red-600');
    expect(errorP).not.toBeInTheDocument();
  });
});
