import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { createRef } from 'react';
import Select from '../Select';

const options = [
  { value: 'a', label: 'Opção A' },
  { value: 'b', label: 'Opção B' },
  { value: 'c', label: 'Opção C' },
];

describe('Select', () => {
  it('renderiza opções corretamente', () => {
    render(<Select id="test" options={options} />);
    expect(screen.getByText('Opção A')).toBeInTheDocument();
    expect(screen.getByText('Opção B')).toBeInTheDocument();
    expect(screen.getByText('Opção C')).toBeInTheDocument();
  });

  it('renderiza com label', () => {
    render(<Select id="test" label="Tipo" options={options} />);
    const label = screen.getByText('Tipo');
    expect(label).toBeInTheDocument();
    expect(label.tagName).toBe('LABEL');
    expect(label).toHaveAttribute('for', 'test');
  });

  it('mostra mensagem de erro', () => {
    render(<Select id="test" options={options} error="Selecione uma opção" />);
    expect(screen.getByText('Selecione uma opção')).toBeInTheDocument();
  });

  it('aplica classe de erro no select', () => {
    render(<Select id="test" options={options} error="Erro" />);
    const select = screen.getByRole('combobox');
    expect(select.className).toContain('border-red-300');
  });

  it('aceita ref', () => {
    const ref = createRef<HTMLSelectElement>();
    render(<Select ref={ref} id="test" options={options} />);
    expect(ref.current).toBeInstanceOf(HTMLSelectElement);
  });
});
