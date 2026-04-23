import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FileUpload from '@/components/FileUpload';

describe('FileUpload', () => {
  it('deve renderizar área de upload quando nenhum arquivo está selecionado', () => {
    render(<FileUpload onFileSelect={jest.fn()} selectedFile={null} />);
    expect(screen.getByText('Clique para enviar')).toBeInTheDocument();
    expect(screen.getByText(/PDF, PNG, JPG, ZIP até 10MB/)).toBeInTheDocument();
  });

  it('deve exibir informações do arquivo quando selecionado', () => {
    const file = new File(['conteúdo'], 'documento.pdf', { type: 'application/pdf' });
    Object.defineProperty(file, 'size', { value: 2048 });

    render(<FileUpload onFileSelect={jest.fn()} selectedFile={file} />);
    expect(screen.getByText('documento.pdf')).toBeInTheDocument();
    expect(screen.getByText('2.0 KB')).toBeInTheDocument();
  });

  it('deve chamar onFileSelect com null ao remover arquivo', async () => {
    const user = userEvent.setup();
    const onFileSelect = jest.fn();
    const file = new File(['conteúdo'], 'documento.pdf', { type: 'application/pdf' });

    render(<FileUpload onFileSelect={onFileSelect} selectedFile={file} />);

    const removeButton = screen.getByRole('button');
    await user.click(removeButton);
    expect(onFileSelect).toHaveBeenCalledWith(null);
  });

  it('deve exibir label "Arquivo anexo (opcional)"', () => {
    render(<FileUpload onFileSelect={jest.fn()} selectedFile={null} />);
    expect(screen.getByText('Arquivo anexo (opcional)')).toBeInTheDocument();
  });
});
