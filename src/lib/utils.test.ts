import { describe, it, expect } from 'vitest';
import { cn, formatDate, formatRelativeDate, requestTypeLabels, requestStatusLabels } from './utils';

describe('cn', () => {
  it('combina classes simples', () => {
    expect(cn('foo', 'bar')).toBe('foo bar');
  });

  it('resolve conflitos do Tailwind', () => {
    expect(cn('px-2', 'px-4')).toBe('px-4');
  });

  it('ignora valores falsy', () => {
    expect(cn('foo', false && 'bar', undefined, null, 'baz')).toBe('foo baz');
  });

  it('suporta condicionais com clsx', () => {
    expect(cn('base', { active: true, disabled: false })).toBe('base active');
  });

  it('retorna string vazia sem argumentos', () => {
    expect(cn()).toBe('');
  });
});

describe('formatDate', () => {
  it('formata data string no padrão brasileiro', () => {
    const result = formatDate('2024-03-15T14:30:00Z');
    expect(result).toMatch(/15\/03\/2024/);
  });

  it('formata objeto Date', () => {
    const date = new Date('2024-01-01T10:00:00Z');
    const result = formatDate(date);
    expect(result).toMatch(/01\/01\/2024/);
  });
});

describe('formatRelativeDate', () => {
  it('retorna texto relativo com sufixo', () => {
    const recentDate = new Date(Date.now() - 60 * 1000).toISOString();
    const result = formatRelativeDate(recentDate);
    expect(result).toContain('há');
  });

  it('aceita objeto Date', () => {
    const date = new Date(Date.now() - 3600 * 1000);
    const result = formatRelativeDate(date);
    expect(result).toContain('há');
  });
});

describe('requestTypeLabels', () => {
  it('contém todos os tipos esperados', () => {
    expect(requestTypeLabels).toEqual({
      bug_fix: 'Bug Fix',
      feature: 'Feature',
      migration: 'Migration',
    });
  });

  it('retorna label correto para bug_fix', () => {
    expect(requestTypeLabels['bug_fix']).toBe('Bug Fix');
  });

  it('retorna label correto para feature', () => {
    expect(requestTypeLabels['feature']).toBe('Feature');
  });

  it('retorna label correto para migration', () => {
    expect(requestTypeLabels['migration']).toBe('Migration');
  });
});

describe('requestStatusLabels', () => {
  it('contém todos os status esperados', () => {
    expect(requestStatusLabels).toEqual({
      pending: 'Pendente',
      in_progress: 'Em Progresso',
      review: 'Em Revisão',
      done: 'Concluído',
      failed: 'Falhou',
    });
  });

  it('retorna label correto para cada status', () => {
    expect(requestStatusLabels['pending']).toBe('Pendente');
    expect(requestStatusLabels['in_progress']).toBe('Em Progresso');
    expect(requestStatusLabels['review']).toBe('Em Revisão');
    expect(requestStatusLabels['done']).toBe('Concluído');
    expect(requestStatusLabels['failed']).toBe('Falhou');
  });
});
