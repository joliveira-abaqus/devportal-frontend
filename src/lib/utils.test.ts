import { describe, it, expect } from 'vitest';
import { cn, formatDate, formatRelativeDate, requestTypeLabels, requestStatusLabels } from './utils';

describe('cn', () => {
  it('combina classes simples', () => {
    expect(cn('foo', 'bar')).toBe('foo bar');
  });

  it('resolve conflitos do Tailwind', () => {
    expect(cn('px-4', 'px-2')).toBe('px-2');
  });

  it('ignora valores falsy', () => {
    expect(cn('foo', undefined, null, false, 'bar')).toBe('foo bar');
  });

  it('suporta condicionais', () => {
    const isActive = true;
    expect(cn('base', isActive && 'active')).toBe('base active');
  });
});

describe('formatDate', () => {
  it('formata data no padrão brasileiro', () => {
    const result = formatDate('2024-03-15T14:30:00Z');
    expect(result).toMatch(/15\/03\/2024/);
    expect(result).toMatch(/\d{2}:\d{2}/);
  });

  it('aceita objeto Date', () => {
    const date = new Date('2024-01-01T10:00:00Z');
    const result = formatDate(date);
    expect(result).toMatch(/01\/01\/2024/);
  });
});

describe('formatRelativeDate', () => {
  it('retorna string com sufixo "há"', () => {
    const recentDate = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    const result = formatRelativeDate(recentDate);
    expect(result).toMatch(/há/);
  });

  it('aceita objeto Date', () => {
    const date = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000);
    const result = formatRelativeDate(date);
    expect(result).toMatch(/há/);
  });
});

describe('requestTypeLabels', () => {
  it('mapeia bug_fix para Bug Fix', () => {
    expect(requestTypeLabels['bug_fix']).toBe('Bug Fix');
  });

  it('mapeia feature para Feature', () => {
    expect(requestTypeLabels['feature']).toBe('Feature');
  });

  it('mapeia migration para Migration', () => {
    expect(requestTypeLabels['migration']).toBe('Migration');
  });
});

describe('requestStatusLabels', () => {
  it('mapeia pending para Pendente', () => {
    expect(requestStatusLabels['pending']).toBe('Pendente');
  });

  it('mapeia in_progress para Em Progresso', () => {
    expect(requestStatusLabels['in_progress']).toBe('Em Progresso');
  });

  it('mapeia review para Em Revisão', () => {
    expect(requestStatusLabels['review']).toBe('Em Revisão');
  });

  it('mapeia done para Concluído', () => {
    expect(requestStatusLabels['done']).toBe('Concluído');
  });

  it('mapeia failed para Falhou', () => {
    expect(requestStatusLabels['failed']).toBe('Falhou');
  });
});
