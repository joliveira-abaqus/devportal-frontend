import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Modal from '../Modal';

describe('Modal', () => {
  const defaultProps = {
    isOpen: true,
    onClose: vi.fn(),
    title: 'Título do Modal',
    children: <p>Conteúdo</p>,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    document.body.style.overflow = '';
  });

  it('não renderiza quando isOpen=false', () => {
    render(<Modal {...defaultProps} isOpen={false} />);
    expect(screen.queryByText('Título do Modal')).not.toBeInTheDocument();
  });

  it('renderiza título e children quando isOpen=true', () => {
    render(<Modal {...defaultProps} />);
    expect(screen.getByText('Título do Modal')).toBeInTheDocument();
    expect(screen.getByText('Conteúdo')).toBeInTheDocument();
  });

  it('chama onClose ao clicar no botão X', () => {
    render(<Modal {...defaultProps} />);
    const closeButton = screen.getByRole('button');
    fireEvent.click(closeButton);
    expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
  });

  it('chama onClose ao pressionar Escape', () => {
    render(<Modal {...defaultProps} />);
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
  });

  it('chama onClose ao clicar no overlay', () => {
    render(<Modal {...defaultProps} />);
    // O overlay é o elemento fixed com bg-black/50
    const overlay = screen.getByText('Título do Modal').closest('.fixed');
    if (overlay) {
      fireEvent.click(overlay);
      expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
    }
  });

  it('bloqueia scroll do body quando aberto', () => {
    render(<Modal {...defaultProps} />);
    expect(document.body.style.overflow).toBe('hidden');
  });

  it('restaura scroll ao fechar', () => {
    const { rerender } = render(<Modal {...defaultProps} />);
    expect(document.body.style.overflow).toBe('hidden');

    rerender(<Modal {...defaultProps} isOpen={false} />);
    expect(document.body.style.overflow).toBe('unset');
  });
});
