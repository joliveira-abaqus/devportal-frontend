import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Select from './Select';

const options = [
  { value: 'feature', label: 'Feature' },
  { value: 'bug_fix', label: 'Bug Fix' },
  { value: 'migration', label: 'Migration' },
];

describe('Select', () => {
  it('renderiza todas as opções', () => {
    render(<Select options={options} />);
    expect(screen.getByText('Feature')).toBeInTheDocument();
    expect(screen.getByText('Bug Fix')).toBeInTheDocument();
    expect(screen.getByText('Migration')).toBeInTheDocument();
  });

  it('renderiza com label quando fornecido', () => {
    render(<Select id="type" label="Tipo" options={options} />);
    expect(screen.getByLabelText('Tipo')).toBeInTheDocument();
  });

  it('exibe mensagem de erro', () => {
    render(<Select options={options} error="Selecione um tipo" />);
    expect(screen.getByText('Selecione um tipo')).toBeInTheDocument();
  });

  it('aplica classe de erro', () => {
    render(<Select options={options} error="Inválido" />);
    const select = screen.getByRole('combobox');
    expect(select.className).toContain('border-red-300');
  });

  it('permite seleção de opção', async () => {
    const user = userEvent.setup();
    render(<Select options={options} />);
    const select = screen.getByRole('combobox');
    await user.selectOptions(select, 'bug_fix');
    expect(select).toHaveValue('bug_fix');
  });
});
