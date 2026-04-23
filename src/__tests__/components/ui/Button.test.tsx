import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Button from '@/components/ui/Button';

describe('Button', () => {
  it('deve renderizar o texto do botão', () => {
    render(<Button>Entrar</Button>);
    expect(screen.getByRole('button', { name: 'Entrar' })).toBeInTheDocument();
  });

  it('deve chamar onClick quando clicado', async () => {
    const user = userEvent.setup();
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Clicar</Button>);

    await user.click(screen.getByRole('button', { name: 'Clicar' }));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('deve estar desabilitado quando disabled=true', () => {
    render(<Button disabled>Desabilitado</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('deve estar desabilitado quando isLoading=true', () => {
    render(<Button isLoading>Enviando</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('deve mostrar "Carregando..." quando isLoading=true', () => {
    render(<Button isLoading>Enviar</Button>);
    expect(screen.getByText('Carregando...')).toBeInTheDocument();
  });

  it('deve aplicar variante primary por padrão', () => {
    render(<Button>Primário</Button>);
    expect(screen.getByRole('button')).toHaveClass('bg-brand-600');
  });

  it('deve aplicar variante outline', () => {
    render(<Button variant="outline">Contorno</Button>);
    expect(screen.getByRole('button')).toHaveClass('border');
  });

  it('deve aplicar variante ghost', () => {
    render(<Button variant="ghost">Fantasma</Button>);
    expect(screen.getByRole('button')).toHaveClass('hover:bg-gray-100');
  });

  it('deve aplicar variante danger', () => {
    render(<Button variant="danger">Perigo</Button>);
    expect(screen.getByRole('button')).toHaveClass('bg-red-600');
  });

  it('deve aplicar tamanho sm', () => {
    render(<Button size="sm">Pequeno</Button>);
    expect(screen.getByRole('button')).toHaveClass('px-3');
  });

  it('deve aplicar tamanho lg', () => {
    render(<Button size="lg">Grande</Button>);
    expect(screen.getByRole('button')).toHaveClass('px-6');
  });

  it('deve aceitar className adicional', () => {
    render(<Button className="w-full">Botão</Button>);
    expect(screen.getByRole('button')).toHaveClass('w-full');
  });

  it('não deve chamar onClick quando desabilitado', async () => {
    const user = userEvent.setup();
    const handleClick = jest.fn();
    render(<Button disabled onClick={handleClick}>Desabilitado</Button>);

    await user.click(screen.getByRole('button'));
    expect(handleClick).not.toHaveBeenCalled();
  });
});
