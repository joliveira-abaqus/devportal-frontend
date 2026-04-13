import { describe, it, expect } from 'vitest';
import { cn, formatDate, formatRelativeDate, requestTypeLabels, requestStatusLabels } from '../utils';

describe('cn()', () => {
  it('mescla classes simples', () => {
    expect(cn('foo', 'bar')).toBe('foo bar');
  });

  it('mescla classes condicionais', () => {
    expect(cn('base', false && 'hidden', 'visible')).toBe('base visible');
  });

  it('resolve conflitos do Tailwind', () => {
    expect(cn('px-2', 'px-4')).toBe('px-4');
  });

  it('retorna string vazia sem argumentos', () => {
    expect(cn()).toBe('');
  });
});

describe('formatDate()', () => {
  it('formata data no padrão dd/MM/yyyy HH:mm', () => {
    const result = formatDate('2024-06-15T14:30:00Z');
    expect(result).toMatch(/15\/06\/2024/);
  });

  it('aceita objeto Date', () => {
    const result = formatDate(new Date('2024-01-01T00:00:00Z'));
    expect(result).toMatch(/01\/2024/);
  });
});

describe('formatRelativeDate()', () => {
  it('retorna string com "há"', () => {
    const pastDate = new Date(Date.now() - 3600 * 1000).toISOString();
    const result = formatRelativeDate(pastDate);
    expect(result).toContain('há');
  });
});

describe('requestTypeLabels', () => {
  it('contém label para bug_fix', () => {
    expect(requestTypeLabels.bug_fix).toBe('Bug Fix');
  });

  it('contém label para feature', () => {
    expect(requestTypeLabels.feature).toBe('Feature');
  });

  it('contém label para migration', () => {
    expect(requestTypeLabels.migration).toBe('Migration');
  });
});

describe('requestStatusLabels', () => {
  it('contém label para pending', () => {
    expect(requestStatusLabels.pending).toBe('Pendente');
  });

  it('contém label para in_progress', () => {
    expect(requestStatusLabels.in_progress).toBe('Em Progresso');
  });

  it('contém label para review', () => {
    expect(requestStatusLabels.review).toBe('Em Revisão');
  });

  it('contém label para done', () => {
    expect(requestStatusLabels.done).toBe('Concluído');
  });

  it('contém label para failed', () => {
    expect(requestStatusLabels.failed).toBe('Falhou');
  });
});
