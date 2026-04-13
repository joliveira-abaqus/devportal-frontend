import { describe, it, expect } from 'vitest';
import { cn, formatDate, formatRelativeDate, requestTypeLabels, requestStatusLabels } from '../utils';

describe('cn()', () => {
  it('merge classes Tailwind corretamente', () => {
    const result = cn('px-2 py-1', 'px-4');
    expect(result).toContain('px-4');
    expect(result).toContain('py-1');
    expect(result).not.toContain('px-2');
  });

  it('lida com classes condicionais', () => {
    const isActive = true;
    const result = cn('base', isActive && 'active');
    expect(result).toContain('base');
    expect(result).toContain('active');
  });

  it('ignora valores undefined e null', () => {
    const result = cn('base', undefined, null, false);
    expect(result).toBe('base');
  });
});

describe('formatDate()', () => {
  it('formata data no padrão dd/MM/yyyy HH:mm com locale pt-BR', () => {
    const result = formatDate('2024-06-15T14:30:00Z');
    expect(result).toMatch(/15\/06\/2024/);
    expect(result).toMatch(/\d{2}:\d{2}/);
  });

  it('aceita objeto Date', () => {
    const date = new Date('2024-01-01T10:00:00Z');
    const result = formatDate(date);
    expect(result).toMatch(/01\/01\/2024/);
  });
});

describe('formatRelativeDate()', () => {
  it('retorna string relativa como "há X minutos"', () => {
    const recentDate = new Date(Date.now() - 5 * 60 * 1000).toISOString();
    const result = formatRelativeDate(recentDate);
    expect(result).toContain('há');
  });
});

describe('requestTypeLabels', () => {
  it('tem label correto para bug_fix', () => {
    expect(requestTypeLabels.bug_fix).toBe('Bug Fix');
  });

  it('tem label correto para feature', () => {
    expect(requestTypeLabels.feature).toBe('Feature');
  });

  it('tem label correto para migration', () => {
    expect(requestTypeLabels.migration).toBe('Migration');
  });
});

describe('requestStatusLabels', () => {
  it('tem label correto para pending', () => {
    expect(requestStatusLabels.pending).toBe('Pendente');
  });

  it('tem label correto para in_progress', () => {
    expect(requestStatusLabels.in_progress).toBe('Em Progresso');
  });

  it('tem label correto para review', () => {
    expect(requestStatusLabels.review).toBe('Em Revisão');
  });

  it('tem label correto para done', () => {
    expect(requestStatusLabels.done).toBe('Concluído');
  });

  it('tem label correto para failed', () => {
    expect(requestStatusLabels.failed).toBe('Falhou');
  });
});
