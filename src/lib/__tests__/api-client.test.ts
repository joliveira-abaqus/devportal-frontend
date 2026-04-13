import { describe, it, expect, vi, beforeEach } from 'vitest';
import axios from 'axios';

vi.mock('axios', () => {
  const interceptors = {
    response: {
      use: vi.fn(),
    },
    request: {
      use: vi.fn(),
    },
  };

  const instance = {
    interceptors,
    get: vi.fn(),
    post: vi.fn(),
    defaults: {
      baseURL: '',
      withCredentials: false,
      headers: { common: {}, post: {}, get: {} },
    },
  };

  return {
    default: {
      create: vi.fn(() => instance),
    },
  };
});

describe('apiClient', () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it('configura baseURL, withCredentials e Content-Type', async () => {
    await import('../api-client');

    expect(axios.create).toHaveBeenCalledWith({
      baseURL: expect.any(String),
      withCredentials: true,
      headers: { 'Content-Type': 'application/json' },
    });
  });

  it('registra interceptor de resposta', async () => {
    const { default: apiClient } = await import('../api-client');

    expect(apiClient.interceptors.response.use).toHaveBeenCalledWith(
      expect.any(Function),
      expect.any(Function),
    );
  });

  it('redireciona para /login em status 401', async () => {
    const { default: apiClient } = await import('../api-client');

    const errorHandler = (apiClient.interceptors.response.use as ReturnType<typeof vi.fn>).mock
      .calls[0][1];

    const originalLocation = window.location;
    Object.defineProperty(window, 'location', {
      writable: true,
      value: { href: '' },
    });

    const error = { response: { status: 401 } };
    await expect(errorHandler(error)).rejects.toEqual(error);
    expect(window.location.href).toBe('/login');

    Object.defineProperty(window, 'location', {
      writable: true,
      value: originalLocation,
    });
  });

  it('rejeita promise para outros erros (ex: 500)', async () => {
    const { default: apiClient } = await import('../api-client');

    const errorHandler = (apiClient.interceptors.response.use as ReturnType<typeof vi.fn>).mock
      .calls[0][1];

    const error = { response: { status: 500 } };
    await expect(errorHandler(error)).rejects.toEqual(error);
  });
});
