import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Select from './Select';

const options = [
  { value: 'bug_fix', label: 'Bug Fix' },
  { value: 'feature', label: 'Feature' },
  { value: 'migration', label: 'Migration' },
];

describe('Select', () => {
  it('deve renderizar com label', () => {
    render(<Select id="type" label="Tipo" options={options} />);
    expect(screen.getByLabelText('Tipo')).toBeInTheDocument();
  });

  it('deve renderizar todas as opções', () => {
    render(<Select id="type" label="Tipo" options={options} />);
    expect(screen.getByText('Bug Fix')).toBeInTheDocument();
    expect(screen.getByText('Feature')).toBeInTheDocument();
    expect(screen.getByText('Migration')).toBeInTheDocument();
  });

  it('deve exibir mensagem de erro', () => {
    render(<Select id="type" label="Tipo" options={options} error="Tipo é obrigatório" />);
    expect(screen.getByText('Tipo é obrigatório')).toBeInTheDocument();
  });

  it('deve permitir seleção de opção', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(<Select id="type" label="Tipo" options={options} onChange={handleChange} />);
    const select = screen.getByLabelText('Tipo');
    await user.selectOptions(select, 'bug_fix');
    expect(handleChange).toHaveBeenCalled();
  });
});
