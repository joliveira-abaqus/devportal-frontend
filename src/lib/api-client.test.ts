import { describe, it, expect, vi, beforeEach } from 'vitest';

describe('api-client', () => {
  let mockResponseUse: ReturnType<typeof vi.fn>;
  let mockCreate: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.resetModules();

    mockResponseUse = vi.fn();
    mockCreate = vi.fn(() => ({
      get: vi.fn(),
      post: vi.fn(),
      interceptors: {
        response: { use: mockResponseUse },
        request: { use: vi.fn() },
      },
      defaults: { baseURL: '', headers: { common: {} } },
    }));

    vi.doMock('axios', () => ({
      default: { create: mockCreate },
    }));
  });

  it('cria instância axios com configuração correta', async () => {
    await import('./api-client');

    expect(mockCreate).toHaveBeenCalledWith({
      baseURL: expect.any(String),
      withCredentials: true,
      headers: { 'Content-Type': 'application/json' },
    });
  });

  it('registra interceptor de resposta', async () => {
    await import('./api-client');
    expect(mockResponseUse).toHaveBeenCalled();
  });

  it('interceptor redireciona para /login em erro 401', async () => {
    await import('./api-client');

    const errorHandler = mockResponseUse.mock.calls[0]?.[1];

    Object.defineProperty(window, 'location', {
      value: { href: '/' },
      writable: true,
      configurable: true,
    });

    const error = { response: { status: 401 } };
    await expect(errorHandler(error)).rejects.toEqual(error);
    expect(window.location.href).toBe('/login');
  });

  it('interceptor não redireciona para outros erros', async () => {
    await import('./api-client');

    const errorHandler = mockResponseUse.mock.calls[0]?.[1];

    Object.defineProperty(window, 'location', {
      value: { href: '/dashboard' },
      writable: true,
      configurable: true,
    });

    const error = { response: { status: 500 } };
    await expect(errorHandler(error)).rejects.toEqual(error);
    expect(window.location.href).toBe('/dashboard');
  });
});
