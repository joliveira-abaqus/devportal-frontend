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
  it('renderiza com label e opções', () => {
    render(<Select id="type" label="Tipo" options={options} />);
    expect(screen.getByLabelText('Tipo')).toBeInTheDocument();
    expect(screen.getByText('Feature')).toBeInTheDocument();
    expect(screen.getByText('Bug Fix')).toBeInTheDocument();
    expect(screen.getByText('Migration')).toBeInTheDocument();
  });

  it('renderiza sem label', () => {
    render(<Select id="type" options={options} />);
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  it('exibe mensagem de erro', () => {
    render(<Select id="type" label="Tipo" options={options} error="Campo obrigatório" />);
    expect(screen.getByText('Campo obrigatório')).toBeInTheDocument();
  });

  it('permite seleção de opção', async () => {
    const user = userEvent.setup();
    render(<Select id="type" label="Tipo" options={options} />);

    const select = screen.getByLabelText('Tipo');
    await user.selectOptions(select, 'bug_fix');
    expect(select).toHaveValue('bug_fix');
  });
});
