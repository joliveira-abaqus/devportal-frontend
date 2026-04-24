import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Modal from './Modal';

describe('Modal', () => {
  it('não renderiza quando isOpen é false', () => {
    render(
      <Modal isOpen={false} onClose={vi.fn()} title="Título">
        Conteúdo
      </Modal>,
    );
    expect(screen.queryByText('Conteúdo')).not.toBeInTheDocument();
  });

  it('renderiza quando isOpen é true', () => {
    render(
      <Modal isOpen={true} onClose={vi.fn()} title="Meu Modal">
        Conteúdo do modal
      </Modal>,
    );
    expect(screen.getByText('Meu Modal')).toBeInTheDocument();
    expect(screen.getByText('Conteúdo do modal')).toBeInTheDocument();
  });

  it('chama onClose ao clicar no botão de fechar', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(
      <Modal isOpen={true} onClose={onClose} title="Fechar">
        Conteúdo
      </Modal>,
    );
    const closeButton = screen.getByRole('button');
    await user.click(closeButton);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('chama onClose ao pressionar Escape', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(
      <Modal isOpen={true} onClose={onClose} title="Escape">
        Conteúdo
      </Modal>,
    );
    await user.keyboard('{Escape}');
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('chama onClose ao clicar no overlay', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(
      <Modal isOpen={true} onClose={onClose} title="Overlay">
        Conteúdo
      </Modal>,
    );
    const overlay = screen.getByText('Conteúdo').closest('.fixed');
    if (overlay) {
      await user.click(overlay);
      expect(onClose).toHaveBeenCalled();
    }
  });

  it('bloqueia scroll do body quando aberto', () => {
    render(
      <Modal isOpen={true} onClose={vi.fn()} title="Scroll">
        Conteúdo
      </Modal>,
    );
    expect(document.body.style.overflow).toBe('hidden');
  });

  it('restaura scroll do body ao desmontar', () => {
    const { unmount } = render(
      <Modal isOpen={true} onClose={vi.fn()} title="Scroll">
        Conteúdo
      </Modal>,
    );
    unmount();
    expect(document.body.style.overflow).toBe('unset');
  });
});
