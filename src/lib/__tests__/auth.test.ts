import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockFetch = vi.fn();
global.fetch = mockFetch;

describe('authOptions', () => {
  beforeEach(() => {
    vi.resetModules();
    mockFetch.mockReset();
  });

  async function getAuthorize() {
    const { authOptions } = await import('../auth');
    const credentialsProvider = authOptions.providers[0];
    // @ts-expect-error - accessing internal authorize function
    return credentialsProvider.options.authorize;
  }

  async function getCallbacks() {
    const { authOptions } = await import('../auth');
    return authOptions.callbacks!;
  }

  describe('authorize()', () => {
    it('retorna null quando credentials.email está vazio', async () => {
      const authorize = await getAuthorize();
      const result = await authorize({ email: '', password: 'password123' }, {} as never);
      expect(result).toBeNull();
    });

    it('retorna null quando credentials.password está vazio', async () => {
      const authorize = await getAuthorize();
      const result = await authorize({ email: 'test@example.com', password: '' }, {} as never);
      expect(result).toBeNull();
    });

    it('retorna null quando backend retorna status não-ok', async () => {
      mockFetch.mockResolvedValueOnce({ ok: false });
      const authorize = await getAuthorize();
      const result = await authorize(
        { email: 'test@example.com', password: 'password123' },
        {} as never,
      );
      expect(result).toBeNull();
    });

    it('retorna { id, email, name } quando backend retorna sucesso', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          data: { id: '1', email: 'test@example.com', name: 'Test User' },
        }),
      });
      const authorize = await getAuthorize();
      const result = await authorize(
        { email: 'test@example.com', password: 'password123' },
        {} as never,
      );
      expect(result).toEqual({
        id: '1',
        email: 'test@example.com',
        name: 'Test User',
      });
    });

    it('retorna null quando fetch lança exceção', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));
      const authorize = await getAuthorize();
      const result = await authorize(
        { email: 'test@example.com', password: 'password123' },
        {} as never,
      );
      expect(result).toBeNull();
    });
  });

  describe('callbacks', () => {
    it('jwt: popula token.id, token.email, token.name quando user está presente', async () => {
      const callbacks = await getCallbacks();
      const token = {};
      const user = { id: '1', email: 'test@example.com', name: 'Test' };
      // @ts-expect-error - simplified callback params
      const result = await callbacks.jwt!({ token, user });
      expect(result).toEqual(
        expect.objectContaining({ id: '1', email: 'test@example.com', name: 'Test' }),
      );
    });

    it('jwt: retorna token inalterado quando user não está presente', async () => {
      const callbacks = await getCallbacks();
      const token = { id: '1', email: 'test@example.com', name: 'Test' };
      // @ts-expect-error - simplified callback params
      const result = await callbacks.jwt!({ token, user: undefined });
      expect(result).toEqual(token);
    });

    it('session: popula session.user.name e session.user.email a partir do token', async () => {
      const callbacks = await getCallbacks();
      const session = { user: { name: '', email: '' }, expires: '' };
      const token = { name: 'Test', email: 'test@example.com' };
      // @ts-expect-error - simplified callback params
      const result = await callbacks.session!({ session, token });
      expect(result.user.name).toBe('Test');
      expect(result.user.email).toBe('test@example.com');
    });
  });
});
