import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Select from '@/components/ui/Select';

const mockOptions = [
  { value: 'feature', label: 'Feature' },
  { value: 'bug_fix', label: 'Bug Fix' },
  { value: 'migration', label: 'Migration' },
];

describe('Select', () => {
  it('deve renderizar o select com opções', () => {
    render(<Select id="tipo" options={mockOptions} />);
    const select = screen.getByRole('combobox');
    expect(select).toBeInTheDocument();
    expect(screen.getByText('Feature')).toBeInTheDocument();
    expect(screen.getByText('Bug Fix')).toBeInTheDocument();
    expect(screen.getByText('Migration')).toBeInTheDocument();
  });

  it('deve renderizar label quando fornecido', () => {
    render(<Select id="tipo" label="Tipo" options={mockOptions} />);
    expect(screen.getByText('Tipo')).toBeInTheDocument();
  });

  it('deve associar label ao select pelo id', () => {
    render(<Select id="tipo" label="Tipo" options={mockOptions} />);
    expect(screen.getByLabelText('Tipo')).toBeInTheDocument();
  });

  it('deve exibir mensagem de erro quando fornecida', () => {
    render(<Select id="tipo" error="Tipo é obrigatório" options={mockOptions} />);
    expect(screen.getByText('Tipo é obrigatório')).toBeInTheDocument();
  });

  it('deve permitir seleção de opção', async () => {
    const user = userEvent.setup();
    render(<Select id="tipo" label="Tipo" options={mockOptions} />);

    const select = screen.getByLabelText('Tipo');
    await user.selectOptions(select, 'bug_fix');
    expect(select).toHaveValue('bug_fix');
  });

  it('deve aplicar classe de erro quando error está presente', () => {
    render(<Select id="tipo" error="Obrigatório" options={mockOptions} />);
    expect(screen.getByRole('combobox')).toHaveClass('border-red-300');
  });

  it('não deve renderizar label quando não fornecido', () => {
    const { container } = render(<Select id="tipo" options={mockOptions} />);
    expect(container.querySelector('label')).not.toBeInTheDocument();
  });

  it('deve aceitar className adicional', () => {
    render(<Select id="tipo" className="w-48" options={mockOptions} />);
    expect(screen.getByRole('combobox')).toHaveClass('w-48');
  });
});
