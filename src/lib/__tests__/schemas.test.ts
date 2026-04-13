import { describe, it, expect } from 'vitest';
import { requestSchema, loginSchema, registerSchema } from '../schemas';

describe('requestSchema', () => {
  it('falha quando título tem menos de 3 caracteres', () => {
    const result = requestSchema.safeParse({
      title: 'ab',
      description: 'Descrição válida com mais de 10 chars',
      type: 'feature',
    });
    expect(result.success).toBe(false);
  });

  it('falha quando descrição tem menos de 10 caracteres', () => {
    const result = requestSchema.safeParse({
      title: 'Título válido',
      description: 'Curta',
      type: 'feature',
    });
    expect(result.success).toBe(false);
  });

  it('falha quando type é inválido', () => {
    const result = requestSchema.safeParse({
      title: 'Título válido',
      description: 'Descrição válida com mais de 10 chars',
      type: 'invalid_type',
    });
    expect(result.success).toBe(false);
  });

  it('passa com dados válidos', () => {
    const result = requestSchema.safeParse({
      title: 'Título válido',
      description: 'Descrição válida com mais de 10 chars',
      type: 'bug_fix',
    });
    expect(result.success).toBe(true);
  });
});

describe('loginSchema', () => {
  it('falha quando email é inválido', () => {
    const result = loginSchema.safeParse({
      email: 'invalid-email',
      password: 'password123',
    });
    expect(result.success).toBe(false);
  });

  it('falha quando senha está vazia', () => {
    const result = loginSchema.safeParse({
      email: 'test@example.com',
      password: '',
    });
    expect(result.success).toBe(false);
  });

  it('passa com dados válidos', () => {
    const result = loginSchema.safeParse({
      email: 'test@example.com',
      password: 'password123',
    });
    expect(result.success).toBe(true);
  });
});

describe('registerSchema', () => {
  it('falha quando nome tem menos de 2 caracteres', () => {
    const result = registerSchema.safeParse({
      name: 'A',
      email: 'test@example.com',
      password: 'password123',
      confirmPassword: 'password123',
    });
    expect(result.success).toBe(false);
  });

  it('falha quando senha tem menos de 8 caracteres', () => {
    const result = registerSchema.safeParse({
      name: 'Test User',
      email: 'test@example.com',
      password: '1234567',
      confirmPassword: '1234567',
    });
    expect(result.success).toBe(false);
  });

  it('falha quando senhas são diferentes (refine)', () => {
    const result = registerSchema.safeParse({
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
      confirmPassword: 'different123',
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const confirmError = result.error.issues.find((i) => i.path.includes('confirmPassword'));
      expect(confirmError).toBeDefined();
    }
  });

  it('passa com dados válidos', () => {
    const result = registerSchema.safeParse({
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
      confirmPassword: 'password123',
    });
    expect(result.success).toBe(true);
  });
});
