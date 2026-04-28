import { describe, it, expect } from 'vitest';
import { z } from 'zod';

// Schemas de validação extraídos da aplicação para teste

const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(1, 'Senha é obrigatória'),
});

const registerSchema = z
  .object({
    name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
    email: z.string().email('Email inválido'),
    password: z.string().min(8, 'Senha deve ter pelo menos 8 caracteres'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Senhas não coincidem',
    path: ['confirmPassword'],
  });

const requestSchema = z.object({
  title: z.string().min(3, 'Título deve ter pelo menos 3 caracteres'),
  description: z.string().min(10, 'Descrição deve ter pelo menos 10 caracteres'),
  type: z.enum(['bug_fix', 'feature', 'migration']),
});

describe('loginSchema', () => {
  it('deve validar dados corretos', () => {
    const result = loginSchema.safeParse({
      email: 'dev@devportal.local',
      password: 'DevPortal123!',
    });
    expect(result.success).toBe(true);
  });

  it('deve rejeitar email inválido', () => {
    const result = loginSchema.safeParse({
      email: 'invalido',
      password: 'senha123',
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('Email inválido');
    }
  });

  it('deve rejeitar senha vazia', () => {
    const result = loginSchema.safeParse({
      email: 'dev@devportal.local',
      password: '',
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('Senha é obrigatória');
    }
  });
});

describe('registerSchema', () => {
  it('deve validar dados corretos', () => {
    const result = registerSchema.safeParse({
      name: 'Dev User',
      email: 'dev@devportal.local',
      password: 'DevPortal123!',
      confirmPassword: 'DevPortal123!',
    });
    expect(result.success).toBe(true);
  });

  it('deve rejeitar nome com menos de 2 caracteres', () => {
    const result = registerSchema.safeParse({
      name: 'A',
      email: 'dev@devportal.local',
      password: 'DevPortal123!',
      confirmPassword: 'DevPortal123!',
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('Nome deve ter pelo menos 2 caracteres');
    }
  });

  it('deve rejeitar senha com menos de 8 caracteres', () => {
    const result = registerSchema.safeParse({
      name: 'Dev User',
      email: 'dev@devportal.local',
      password: '1234567',
      confirmPassword: '1234567',
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('Senha deve ter pelo menos 8 caracteres');
    }
  });

  it('deve rejeitar quando senhas não coincidem', () => {
    const result = registerSchema.safeParse({
      name: 'Dev User',
      email: 'dev@devportal.local',
      password: 'DevPortal123!',
      confirmPassword: 'OutraSenha123!',
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const confirmError = result.error.issues.find((i) => i.path.includes('confirmPassword'));
      expect(confirmError?.message).toBe('Senhas não coincidem');
    }
  });

  it('deve rejeitar email inválido', () => {
    const result = registerSchema.safeParse({
      name: 'Dev User',
      email: 'nao-email',
      password: 'DevPortal123!',
      confirmPassword: 'DevPortal123!',
    });
    expect(result.success).toBe(false);
  });
});

describe('requestSchema', () => {
  it('deve validar dados corretos', () => {
    const result = requestSchema.safeParse({
      title: 'Corrigir bug no login',
      description: 'O botão de login não responde ao clicar em mobile',
      type: 'bug_fix',
    });
    expect(result.success).toBe(true);
  });

  it('deve rejeitar título com menos de 3 caracteres', () => {
    const result = requestSchema.safeParse({
      title: 'AB',
      description: 'Descrição com pelo menos dez caracteres',
      type: 'feature',
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('Título deve ter pelo menos 3 caracteres');
    }
  });

  it('deve rejeitar descrição com menos de 10 caracteres', () => {
    const result = requestSchema.safeParse({
      title: 'Título válido',
      description: 'Curta',
      type: 'feature',
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('Descrição deve ter pelo menos 10 caracteres');
    }
  });

  it('deve rejeitar tipo inválido', () => {
    const result = requestSchema.safeParse({
      title: 'Título válido',
      description: 'Descrição com pelo menos dez caracteres',
      type: 'invalid_type',
    });
    expect(result.success).toBe(false);
  });

  it('deve aceitar tipo bug_fix', () => {
    const result = requestSchema.safeParse({
      title: 'Fix login',
      description: 'Corrigir problema no login do sistema',
      type: 'bug_fix',
    });
    expect(result.success).toBe(true);
  });

  it('deve aceitar tipo feature', () => {
    const result = requestSchema.safeParse({
      title: 'Novo recurso',
      description: 'Adicionar nova funcionalidade ao sistema',
      type: 'feature',
    });
    expect(result.success).toBe(true);
  });

  it('deve aceitar tipo migration', () => {
    const result = requestSchema.safeParse({
      title: 'Migração DB',
      description: 'Migrar banco de dados para nova versão',
      type: 'migration',
    });
    expect(result.success).toBe(true);
  });
});
