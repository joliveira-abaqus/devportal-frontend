import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Modal from './Modal';

describe('Modal', () => {
  it('não deve renderizar quando isOpen é false', () => {
    render(
      <Modal isOpen={false} onClose={vi.fn()} title="Título">
        <p>Conteúdo</p>
      </Modal>
    );
    expect(screen.queryByText('Título')).not.toBeInTheDocument();
  });

  it('deve renderizar quando isOpen é true', () => {
    render(
      <Modal isOpen={true} onClose={vi.fn()} title="Meu Modal">
        <p>Conteúdo do modal</p>
      </Modal>
    );
    expect(screen.getByText('Meu Modal')).toBeInTheDocument();
    expect(screen.getByText('Conteúdo do modal')).toBeInTheDocument();
  });

  it('deve chamar onClose ao clicar no botão de fechar', async () => {
    const user = userEvent.setup();
    const handleClose = vi.fn();
    render(
      <Modal isOpen={true} onClose={handleClose} title="Modal">
        <p>Conteúdo</p>
      </Modal>
    );
    const closeButton = screen.getByRole('button');
    await user.click(closeButton);
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('deve chamar onClose ao pressionar Escape', () => {
    const handleClose = vi.fn();
    render(
      <Modal isOpen={true} onClose={handleClose} title="Modal">
        <p>Conteúdo</p>
      </Modal>
    );
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('deve chamar onClose ao clicar no overlay', () => {
    const handleClose = vi.fn();
    const { container } = render(
      <Modal isOpen={true} onClose={handleClose} title="Modal">
        <p>Conteúdo</p>
      </Modal>
    );
    const overlay = container.querySelector('.fixed')!;
    fireEvent.click(overlay);
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('deve bloquear scroll do body quando aberto', () => {
    render(
      <Modal isOpen={true} onClose={vi.fn()} title="Modal">
        <p>Conteúdo</p>
      </Modal>
    );
    expect(document.body.style.overflow).toBe('hidden');
  });

  it('deve aceitar className personalizado', () => {
    const { container } = render(
      <Modal isOpen={true} onClose={vi.fn()} title="Modal" className="custom-class">
        <p>Conteúdo</p>
      </Modal>
    );
    const modalContent = container.querySelector('.custom-class');
    expect(modalContent).toBeInTheDocument();
  });
});
