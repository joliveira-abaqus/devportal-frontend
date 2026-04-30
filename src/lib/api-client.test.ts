import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import axios from 'axios';

vi.mock('axios', () => {
  const interceptors = {
    response: { use: vi.fn() },
    request: { use: vi.fn() },
  };
  const instance = {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
    interceptors,
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

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('cria instância axios com configuração correta', async () => {
    await import('./api-client');

    expect(axios.create).toHaveBeenCalledWith({
      baseURL: 'http://localhost:3001',
      withCredentials: true,
      headers: { 'Content-Type': 'application/json' },
    });
  });

  it('registra interceptor de resposta', async () => {
    await import('./api-client');
    const instance = axios.create();
    expect(instance.interceptors.response.use).toHaveBeenCalled();
  });

  it('redireciona para /login em erro 401', async () => {
    const instance = axios.create();
    const useCall = vi.mocked(instance.interceptors.response.use);

    await import('./api-client');

    const errorHandler = useCall.mock.calls[0][1] as Function;

    const originalHref = window.location.href;
    Object.defineProperty(window, 'location', {
      value: { href: originalHref },
      writable: true,
    });

    const apiError = { response: { status: 401 } };
    await expect(errorHandler(apiError)).rejects.toEqual(apiError);
    expect(window.location.href).toBe('/login');
  });

  it('propaga erros não-401 sem redirecionar', async () => {
    const instance = axios.create();
    const useCall = vi.mocked(instance.interceptors.response.use);

    await import('./api-client');

    const errorHandler = useCall.mock.calls[0][1] as Function;

    const apiError = { response: { status: 500 } };
    await expect(errorHandler(apiError)).rejects.toEqual(apiError);
  });
});
