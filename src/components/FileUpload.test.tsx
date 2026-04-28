import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FileUpload from './FileUpload';

describe('FileUpload', () => {
  it('deve renderizar zona de upload quando não há arquivo', () => {
    render(<FileUpload onFileSelect={vi.fn()} selectedFile={null} />);
    expect(screen.getByText('Clique para enviar')).toBeInTheDocument();
    expect(screen.getByText(/PDF, PNG, JPG, ZIP até 10MB/)).toBeInTheDocument();
  });

  it('deve exibir informações do arquivo selecionado', () => {
    const file = new File(['conteúdo'], 'documento.pdf', { type: 'application/pdf' });
    Object.defineProperty(file, 'size', { value: 2048 });

    render(<FileUpload onFileSelect={vi.fn()} selectedFile={file} />);
    expect(screen.getByText('documento.pdf')).toBeInTheDocument();
    expect(screen.getByText('2.0 KB')).toBeInTheDocument();
  });

  it('deve chamar onFileSelect com null ao remover arquivo', async () => {
    const user = userEvent.setup();
    const handleFileSelect = vi.fn();
    const file = new File(['conteúdo'], 'doc.pdf', { type: 'application/pdf' });

    render(<FileUpload onFileSelect={handleFileSelect} selectedFile={file} />);
    const removeButton = screen.getByRole('button');
    await user.click(removeButton);
    expect(handleFileSelect).toHaveBeenCalledWith(null);
  });

  it('deve chamar onFileSelect ao selecionar arquivo', () => {
    const handleFileSelect = vi.fn();
    render(<FileUpload onFileSelect={handleFileSelect} selectedFile={null} />);

    const input = document.querySelector('input[type="file"]')!;
    const file = new File(['conteúdo'], 'novo.pdf', { type: 'application/pdf' });
    fireEvent.change(input, { target: { files: [file] } });

    expect(handleFileSelect).toHaveBeenCalledWith(file);
  });

  it('deve exibir label do campo', () => {
    render(<FileUpload onFileSelect={vi.fn()} selectedFile={null} />);
    expect(screen.getByText('Arquivo anexo (opcional)')).toBeInTheDocument();
  });
});
