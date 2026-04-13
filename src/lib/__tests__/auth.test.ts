import { describe, it, expect, vi, beforeEach } from 'vitest';
import { authOptions } from '../auth';
import type { Session } from 'next-auth';
import type { JWT } from 'next-auth/jwt';

describe('authOptions', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  describe('configuração', () => {
    it('usa strategy jwt', () => {
      expect(authOptions.session?.strategy).toBe('jwt');
    });

    it('define signIn page como /login', () => {
      expect(authOptions.pages?.signIn).toBe('/login');
    });
  });

  describe('authorize()', () => {
    const getAuthorize = () => {
      const provider = authOptions.providers[0] as unknown as {
        options: { authorize: (credentials: Record<string, string>, req: never) => Promise<unknown> };
      };
      return provider.options.authorize;
    };

    it('retorna null quando credentials são vazias', async () => {
      const authorize = getAuthorize();
      const result = await authorize({}, {} as never);
      expect(result).toBeNull();
    });

    it('retorna null quando email está faltando', async () => {
      const authorize = getAuthorize();
      const result = await authorize({ password: '123' }, {} as never);
      expect(result).toBeNull();
    });

    it('retorna null quando password está faltando', async () => {
      const authorize = getAuthorize();
      const result = await authorize({ email: 'a@b.com' }, {} as never);
      expect(result).toBeNull();
    });

    it('retorna user quando fetch retorna ok', async () => {
      const authorize = getAuthorize();
      const mockUser = { id: '1', email: 'test@test.com', name: 'Test' };

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ data: mockUser }),
      });

      const result = await authorize(
        { email: 'test@test.com', password: 'password123' },
        {} as never,
      );

      expect(result).toEqual({
        id: '1',
        email: 'test@test.com',
        name: 'Test',
      });
    });

    it('retorna user quando resposta não tem wrapper data', async () => {
      const authorize = getAuthorize();
      const mockUser = { id: '1', email: 'test@test.com', name: 'Test' };

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockUser),
      });

      const result = await authorize(
        { email: 'test@test.com', password: 'password123' },
        {} as never,
      );

      expect(result).toEqual({
        id: '1',
        email: 'test@test.com',
        name: 'Test',
      });
    });

    it('retorna null quando fetch retorna não-ok', async () => {
      const authorize = getAuthorize();

      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
      });

      const result = await authorize(
        { email: 'test@test.com', password: 'wrong' },
        {} as never,
      );

      expect(result).toBeNull();
    });

    it('retorna null quando fetch lança exceção', async () => {
      const authorize = getAuthorize();

      global.fetch = vi.fn().mockRejectedValue(new Error('Network error'));

      const result = await authorize(
        { email: 'test@test.com', password: 'password123' },
        {} as never,
      );

      expect(result).toBeNull();
    });
  });

  describe('callbacks', () => {
    it('jwt callback adiciona dados do user ao token', async () => {
      const jwtCallback = authOptions.callbacks!.jwt!;
      const user = { id: '1', email: 'a@b.com', name: 'Test' };
      const token = {} as JWT;

      const result = await jwtCallback({
        token,
        user,
        account: null,
        trigger: 'signIn',
      } as Parameters<typeof jwtCallback>[0]);

      expect(result.id).toBe('1');
      expect(result.email).toBe('a@b.com');
      expect(result.name).toBe('Test');
    });

    it('jwt callback retorna token sem alterações quando user não existe', async () => {
      const jwtCallback = authOptions.callbacks!.jwt!;
      const token = { id: '1', email: 'a@b.com', name: 'Test' } as JWT;

      const result = await jwtCallback({
        token,
        account: null,
        trigger: 'update',
      } as Parameters<typeof jwtCallback>[0]);

      expect(result).toEqual(token);
    });

    it('session callback popula session.user com dados do token', async () => {
      const sessionCallback = authOptions.callbacks!.session!;
      const session = { user: { name: '', email: '' }, expires: '' } as Session;
      const token = { name: 'Test', email: 'a@b.com' } as JWT;

      const result = await sessionCallback({
        session,
        token,
        trigger: 'update',
      } as Parameters<typeof sessionCallback>[0]);

      expect(result.user!.name).toBe('Test');
      expect(result.user!.email).toBe('a@b.com');
    });
  });
});
