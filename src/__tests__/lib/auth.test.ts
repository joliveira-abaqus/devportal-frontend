import { authOptions } from '@/lib/auth';

describe('authOptions', () => {
  it('deve configurar CredentialsProvider', () => {
    expect(authOptions.providers).toHaveLength(1);
    expect(authOptions.providers[0].name).toBe('Credentials');
  });

  it('deve configurar estratégia JWT para sessão', () => {
    expect(authOptions.session?.strategy).toBe('jwt');
  });

  it('deve configurar maxAge de 24 horas', () => {
    expect(authOptions.session?.maxAge).toBe(24 * 60 * 60);
  });

  it('deve configurar página de login como /login', () => {
    expect(authOptions.pages?.signIn).toBe('/login');
  });

  it('deve ter callback jwt configurado', () => {
    expect(authOptions.callbacks?.jwt).toBeDefined();
  });

  it('deve ter callback session configurado', () => {
    expect(authOptions.callbacks?.session).toBeDefined();
  });

  describe('authorize', () => {
    let authorize: Function;

    beforeEach(() => {
      const provider = authOptions.providers[0] as { options?: { authorize?: Function } };
      authorize = provider.options?.authorize as Function;
    });

    it('deve retornar null quando credenciais estão vazias', async () => {
      const result = await authorize({ email: '', password: '' });
      expect(result).toBeNull();
    });

    it('deve retornar null quando credenciais são undefined', async () => {
      const result = await authorize(undefined);
      expect(result).toBeNull();
    });

    it('deve retornar null quando email está faltando', async () => {
      const result = await authorize({ password: 'test123' });
      expect(result).toBeNull();
    });

    it('deve retornar null quando senha está faltando', async () => {
      const result = await authorize({ email: 'test@test.com' });
      expect(result).toBeNull();
    });

    it('deve retornar usuário quando login é bem-sucedido', async () => {
      const mockUser = { id: '1', email: 'test@test.com', name: 'Test' };
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ data: mockUser }),
      });

      const result = await authorize({ email: 'test@test.com', password: 'password123' });
      expect(result).toEqual(mockUser);
    });

    it('deve retornar null quando API retorna erro', async () => {
      global.fetch = jest.fn().mockResolvedValue({
        ok: false,
      });

      const result = await authorize({ email: 'test@test.com', password: 'wrong' });
      expect(result).toBeNull();
    });

    it('deve retornar null quando fetch falha', async () => {
      global.fetch = jest.fn().mockRejectedValue(new Error('Network error'));

      const result = await authorize({ email: 'test@test.com', password: 'test' });
      expect(result).toBeNull();
    });
  });

  describe('callbacks', () => {
    it('jwt callback deve adicionar dados do usuário ao token', async () => {
      const jwt = authOptions.callbacks?.jwt;
      if (!jwt) return;

      const token = { sub: '1' };
      const user = { id: '1', email: 'test@test.com', name: 'Test' };
      const result = await jwt({ token, user } as Parameters<typeof jwt>[0]);

      expect(result.id).toBe('1');
      expect(result.email).toBe('test@test.com');
      expect(result.name).toBe('Test');
    });

    it('jwt callback deve manter token existente sem user', async () => {
      const jwt = authOptions.callbacks?.jwt;
      if (!jwt) return;

      const token = { sub: '1', id: '1', email: 'existing@test.com', name: 'Existing' };
      const result = await jwt({ token, user: undefined } as unknown as Parameters<typeof jwt>[0]);

      expect(result.email).toBe('existing@test.com');
    });

    it('session callback deve adicionar dados do token à sessão', async () => {
      const sessionCb = authOptions.callbacks?.session;
      if (!sessionCb) return;

      const session = { user: { name: '', email: '' }, expires: '' };
      const token = { name: 'Test', email: 'test@test.com' };
      const result = await sessionCb({ session, token } as Parameters<typeof sessionCb>[0]);

      expect(result.user?.name).toBe('Test');
      expect(result.user?.email).toBe('test@test.com');
    });
  });
});
