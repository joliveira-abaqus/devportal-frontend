import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FileUpload from './FileUpload';

describe('FileUpload', () => {
  it('renderiza zona de upload quando nenhum arquivo selecionado', () => {
    render(<FileUpload onFileSelect={vi.fn()} selectedFile={null} />);
    expect(screen.getByText('Clique para enviar')).toBeInTheDocument();
    expect(screen.getByText(/PDF, PNG, JPG, ZIP até 10MB/)).toBeInTheDocument();
  });

  it('exibe informações do arquivo quando selecionado', () => {
    const file = new File(['conteúdo'], 'documento.pdf', { type: 'application/pdf' });
    Object.defineProperty(file, 'size', { value: 2048 });

    render(<FileUpload onFileSelect={vi.fn()} selectedFile={file} />);
    expect(screen.getByText('documento.pdf')).toBeInTheDocument();
    expect(screen.getByText('2.0 KB')).toBeInTheDocument();
  });

  it('chama onFileSelect(null) ao remover arquivo', async () => {
    const user = userEvent.setup();
    const onFileSelect = vi.fn();
    const file = new File(['conteúdo'], 'foto.png', { type: 'image/png' });

    render(<FileUpload onFileSelect={onFileSelect} selectedFile={file} />);
    const removeButton = screen.getByRole('button');
    await user.click(removeButton);
    expect(onFileSelect).toHaveBeenCalledWith(null);
  });

  it('chama onFileSelect com arquivo ao selecionar via input', async () => {
    const user = userEvent.setup();
    const onFileSelect = vi.fn();

    render(<FileUpload onFileSelect={onFileSelect} selectedFile={null} />);
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    const file = new File(['dados'], 'arquivo.zip', { type: 'application/zip' });

    await user.upload(fileInput, file);
    expect(onFileSelect).toHaveBeenCalledWith(file);
  });

  it('exibe label "Arquivo anexo (opcional)"', () => {
    render(<FileUpload onFileSelect={vi.fn()} selectedFile={null} />);
    expect(screen.getByText('Arquivo anexo (opcional)')).toBeInTheDocument();
  });
});
