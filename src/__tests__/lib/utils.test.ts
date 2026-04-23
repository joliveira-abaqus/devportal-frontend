import { cn, formatDate, formatRelativeDate, requestTypeLabels, requestStatusLabels } from '@/lib/utils';

describe('cn', () => {
  it('deve mesclar classes Tailwind corretamente', () => {
    expect(cn('px-2', 'py-1')).toBe('px-2 py-1');
  });

  it('deve resolver conflitos de classes Tailwind', () => {
    expect(cn('px-2', 'px-4')).toBe('px-4');
  });

  it('deve lidar com valores condicionais', () => {
    expect(cn('base', false && 'hidden', 'extra')).toBe('base extra');
  });

  it('deve retornar string vazia para entradas vazias', () => {
    expect(cn()).toBe('');
  });

  it('deve ignorar valores undefined e null', () => {
    expect(cn('a', undefined, null, 'b')).toBe('a b');
  });
});

describe('formatDate', () => {
  it('deve formatar data no padrão brasileiro', () => {
    const result = formatDate('2024-06-15T14:30:00Z');
    expect(result).toMatch(/15\/06\/2024/);
  });

  it('deve aceitar objeto Date', () => {
    const result = formatDate(new Date('2024-01-01T10:00:00Z'));
    expect(result).toMatch(/01\/01\/2024/);
  });
});

describe('formatRelativeDate', () => {
  it('deve retornar string com sufixo "há"', () => {
    const pastDate = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    const result = formatRelativeDate(pastDate);
    expect(result).toMatch(/há/);
  });

  it('deve aceitar objeto Date', () => {
    const pastDate = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000);
    const result = formatRelativeDate(pastDate);
    expect(result).toMatch(/há/);
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
