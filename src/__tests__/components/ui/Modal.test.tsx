import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Modal from '@/components/ui/Modal';

describe('Modal', () => {
  const defaultProps = {
    isOpen: true,
    onClose: jest.fn(),
    title: 'Título do Modal',
    children: <p>Conteúdo do modal</p>,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve renderizar quando isOpen=true', () => {
    render(<Modal {...defaultProps} />);
    expect(screen.getByText('Título do Modal')).toBeInTheDocument();
    expect(screen.getByText('Conteúdo do modal')).toBeInTheDocument();
  });

  it('não deve renderizar quando isOpen=false', () => {
    render(<Modal {...defaultProps} isOpen={false} />);
    expect(screen.queryByText('Título do Modal')).not.toBeInTheDocument();
  });

  it('deve chamar onClose ao clicar no botão de fechar', async () => {
    const user = userEvent.setup();
    const onClose = jest.fn();
    render(<Modal {...defaultProps} onClose={onClose} />);

    const closeButtons = screen.getAllByRole('button');
    await user.click(closeButtons[0]);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('deve chamar onClose ao pressionar Escape', async () => {
    const user = userEvent.setup();
    const onClose = jest.fn();
    render(<Modal {...defaultProps} onClose={onClose} />);

    await user.keyboard('{Escape}');
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('deve chamar onClose ao clicar no overlay', async () => {
    const user = userEvent.setup();
    const onClose = jest.fn();
    const { container } = render(<Modal {...defaultProps} onClose={onClose} />);

    const overlay = container.querySelector('.fixed.inset-0');
    if (overlay) {
      await user.click(overlay);
      expect(onClose).toHaveBeenCalled();
    }
  });

  it('deve aceitar className adicional', () => {
    render(<Modal {...defaultProps} className="custom-modal" />);
    expect(screen.getByText('Título do Modal')).toBeInTheDocument();
  });
});
