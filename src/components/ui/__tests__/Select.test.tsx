import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { createRef } from 'react';
import Select from '../Select';

const options = [
  { value: 'opt1', label: 'Opção 1' },
  { value: 'opt2', label: 'Opção 2' },
  { value: 'opt3', label: 'Opção 3' },
];

describe('Select', () => {
  it('renderiza todas as opções', () => {
    render(<Select id="test" options={options} />);
    expect(screen.getByText('Opção 1')).toBeInTheDocument();
    expect(screen.getByText('Opção 2')).toBeInTheDocument();
    expect(screen.getByText('Opção 3')).toBeInTheDocument();
  });

  it('renderiza label quando passado', () => {
    render(<Select id="test" label="Escolha" options={options} />);
    expect(screen.getByText('Escolha')).toBeInTheDocument();
  });

  it('exibe mensagem de erro quando error é passado', () => {
    render(<Select id="test" error="Selecione uma opção" options={options} />);
    expect(screen.getByText('Selecione uma opção')).toBeInTheDocument();
  });

  it('forwarda ref corretamente', () => {
    const ref = createRef<HTMLSelectElement>();
    render(<Select ref={ref} id="test" options={options} />);
    expect(ref.current).toBeInstanceOf(HTMLSelectElement);
  });
});
