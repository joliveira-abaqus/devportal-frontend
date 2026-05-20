import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { cn, formatDate, formatRelativeDate, requestTypeLabels, requestStatusLabels } from '../utils';

describe('cn()', () => {
  it('mescla classes Tailwind simples', () => {
    expect(cn('px-2', 'py-1')).toBe('px-2 py-1');
  });

  it('resolve classes Tailwind conflitantes mantendo a última', () => {
    expect(cn('px-2', 'px-4')).toBe('px-4');
  });

  it('ignora strings vazias', () => {
    expect(cn('px-2', '', 'py-1')).toBe('px-2 py-1');
  });

  it('ignora valores undefined e null', () => {
    expect(cn('px-2', undefined, null, 'py-1')).toBe('px-2 py-1');
  });

  it('aceita condicionais booleanos (clsx)', () => {
    expect(cn('base', false && 'hidden', true && 'visible')).toBe('base visible');
  });
});

describe('formatDate()', () => {
  it('formata string de data no padrão brasileiro dd/MM/yyyy HH:mm', () => {
    const result = formatDate('2024-03-15T14:30:00Z');
    expect(result).toMatch(/15\/03\/2024/);
    expect(result).toMatch(/\d{2}:\d{2}/);
  });

  it('formata objeto Date no padrão brasileiro', () => {
    const date = new Date('2024-12-25T10:00:00Z');
    const result = formatDate(date);
    expect(result).toMatch(/25\/12\/2024/);
  });
});

describe('formatRelativeDate()', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('retorna formato relativo em português com sufixo "há"', () => {
    const now = new Date('2024-06-15T12:00:00Z');
    vi.setSystemTime(now);

    const twoHoursAgo = new Date('2024-06-15T10:00:00Z');
    const result = formatRelativeDate(twoHoursAgo);
    expect(result).toContain('há');
    expect(result).toMatch(/hora/);
  });

  it('funciona com string de data', () => {
    const now = new Date('2024-06-15T12:00:00Z');
    vi.setSystemTime(now);

    const result = formatRelativeDate('2024-06-14T12:00:00Z');
    expect(result).toContain('há');
    expect(result).toMatch(/dia/);
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

  it('contém exatamente 3 chaves', () => {
    expect(Object.keys(requestTypeLabels)).toHaveLength(3);
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

  it('contém exatamente 5 chaves', () => {
    expect(Object.keys(requestStatusLabels)).toHaveLength(5);
  });
});
