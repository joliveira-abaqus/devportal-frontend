import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import FileUpload from '../FileUpload';

describe('FileUpload', () => {
  it('renderiza área de upload quando nenhum arquivo selecionado', () => {
    render(<FileUpload onFileSelect={vi.fn()} selectedFile={null} />);
    expect(screen.getByText(/Clique para enviar/)).toBeInTheDocument();
  });

  it('mostra nome e tamanho do arquivo quando selectedFile existe', () => {
    const file = new File(['content'], 'test.pdf', { type: 'application/pdf' });
    Object.defineProperty(file, 'size', { value: 2048 });

    render(<FileUpload onFileSelect={vi.fn()} selectedFile={file} />);
    expect(screen.getByText('test.pdf')).toBeInTheDocument();
    expect(screen.getByText('2.0 KB')).toBeInTheDocument();
  });

  it('chama onFileSelect com arquivo ao selecionar', () => {
    const onFileSelect = vi.fn();
    render(<FileUpload onFileSelect={onFileSelect} selectedFile={null} />);

    const file = new File(['content'], 'test.pdf', { type: 'application/pdf' });
    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    fireEvent.change(input, { target: { files: [file] } });

    expect(onFileSelect).toHaveBeenCalledWith(file);
  });

  it('chama onFileSelect(null) ao clicar no botão de remover', () => {
    const onFileSelect = vi.fn();
    const file = new File(['content'], 'test.pdf', { type: 'application/pdf' });

    render(<FileUpload onFileSelect={onFileSelect} selectedFile={file} />);
    const removeButton = screen.getByRole('button');
    fireEvent.click(removeButton);

    expect(onFileSelect).toHaveBeenCalledWith(null);
  });

  it('clique na área de drop abre o input file', () => {
    render(<FileUpload onFileSelect={vi.fn()} selectedFile={null} />);

    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    const clickSpy = vi.spyOn(input, 'click');

    const dropZone = screen.getByText(/Clique para enviar/).closest('div[class*="cursor-pointer"]');
    if (dropZone) {
      fireEvent.click(dropZone);
      expect(clickSpy).toHaveBeenCalled();
    }
  });

  it('chama onFileSelect(null) quando change sem arquivos', () => {
    const onFileSelect = vi.fn();
    render(<FileUpload onFileSelect={onFileSelect} selectedFile={null} />);

    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    fireEvent.change(input, { target: { files: [] } });

    expect(onFileSelect).toHaveBeenCalledWith(null);
  });
});
