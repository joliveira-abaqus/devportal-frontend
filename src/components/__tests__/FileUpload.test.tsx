import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FileUpload from '../FileUpload';

describe('FileUpload', () => {
  it('exibe área de upload quando selectedFile é null', () => {
    render(<FileUpload onFileSelect={vi.fn()} selectedFile={null} />);
    expect(screen.getByText(/Clique para enviar/)).toBeInTheDocument();
  });

  it('exibe nome e tamanho do arquivo quando selectedFile está presente', () => {
    const file = new File(['conteúdo do arquivo'], 'teste.pdf', { type: 'application/pdf' });
    Object.defineProperty(file, 'size', { value: 2048 });

    render(<FileUpload onFileSelect={vi.fn()} selectedFile={file} />);
    expect(screen.getByText('teste.pdf')).toBeInTheDocument();
    expect(screen.getByText('2.0 KB')).toBeInTheDocument();
  });

  it('chama onFileSelect(file) quando arquivo é selecionado via input', async () => {
    const user = userEvent.setup();
    const onFileSelect = vi.fn();
    render(<FileUpload onFileSelect={onFileSelect} selectedFile={null} />);

    const file = new File(['conteúdo'], 'documento.pdf', { type: 'application/pdf' });
    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    await user.upload(input, file);

    expect(onFileSelect).toHaveBeenCalledWith(file);
  });

  it('chama onFileSelect(null) quando botão de remover é clicado', async () => {
    const user = userEvent.setup();
    const onFileSelect = vi.fn();
    const file = new File(['conteúdo'], 'teste.pdf', { type: 'application/pdf' });

    render(<FileUpload onFileSelect={onFileSelect} selectedFile={file} />);

    const removeButton = screen.getByRole('button');
    await user.click(removeButton);

    expect(onFileSelect).toHaveBeenCalledWith(null);
  });
});
