import { describe, it, expect } from 'vitest';
import { cn, formatDate, formatRelativeDate, requestTypeLabels, requestStatusLabels } from './utils';

describe('cn', () => {
  it('deve combinar classes simples', () => {
    expect(cn('foo', 'bar')).toBe('foo bar');
  });

  it('deve lidar com valores condicionais', () => {
    expect(cn('base', false && 'hidden', 'visible')).toBe('base visible');
  });

  it('deve mesclar classes Tailwind conflitantes', () => {
    expect(cn('px-2', 'px-4')).toBe('px-4');
  });

  it('deve retornar string vazia sem argumentos', () => {
    expect(cn()).toBe('');
  });

  it('deve ignorar valores undefined e null', () => {
    expect(cn('base', undefined, null, 'extra')).toBe('base extra');
  });
});

describe('formatDate', () => {
  it('deve formatar data no padrão brasileiro', () => {
    const result = formatDate('2024-01-15T10:30:00Z');
    expect(result).toMatch(/15\/01\/2024/);
  });

  it('deve aceitar objeto Date', () => {
    const result = formatDate(new Date('2024-06-20T14:00:00Z'));
    expect(result).toMatch(/20\/06\/2024/);
  });
});

describe('formatRelativeDate', () => {
  it('deve retornar uma string com "há"', () => {
    const pastDate = new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString();
    const result = formatRelativeDate(pastDate);
    expect(result).toContain('há');
  });
});

describe('requestTypeLabels', () => {
  it('deve ter label para bug_fix', () => {
    expect(requestTypeLabels['bug_fix']).toBe('Bug Fix');
  });

  it('deve ter label para feature', () => {
    expect(requestTypeLabels['feature']).toBe('Feature');
  });

  it('deve ter label para migration', () => {
    expect(requestTypeLabels['migration']).toBe('Migration');
  });
});

describe('requestStatusLabels', () => {
  it('deve ter label para pending', () => {
    expect(requestStatusLabels['pending']).toBe('Pendente');
  });

  it('deve ter label para in_progress', () => {
    expect(requestStatusLabels['in_progress']).toBe('Em Progresso');
  });

  it('deve ter label para review', () => {
    expect(requestStatusLabels['review']).toBe('Em Revisão');
  });

  it('deve ter label para done', () => {
    expect(requestStatusLabels['done']).toBe('Concluído');
  });

  it('deve ter label para failed', () => {
    expect(requestStatusLabels['failed']).toBe('Falhou');
  });
});
