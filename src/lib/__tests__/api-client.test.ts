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
    put: vi.fn(),
    delete: vi.fn(),
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

  it('cria instância axios com configurações corretas', async () => {
    await import('../api-client');

    expect(axios.create).toHaveBeenCalledWith({
      baseURL: expect.any(String),
      withCredentials: true,
      headers: { 'Content-Type': 'application/json' },
    });
  });

  it('registra interceptor de resposta', async () => {
    await import('../api-client');

    const instance = (axios.create as ReturnType<typeof vi.fn>).mock.results[0].value;
    expect(instance.interceptors.response.use).toHaveBeenCalled();
  });

  it('interceptor redireciona para /login em erro 401', async () => {
    await import('../api-client');

    const instance = (axios.create as ReturnType<typeof vi.fn>).mock.results[0].value;
    const errorHandler = instance.interceptors.response.use.mock.calls[0][1];

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

  it('interceptor rejeita erros não-401 normalmente', async () => {
    await import('../api-client');

    const instance = (axios.create as ReturnType<typeof vi.fn>).mock.results[0].value;
    const errorHandler = instance.interceptors.response.use.mock.calls[0][1];

    const error = { response: { status: 500 } };
    await expect(errorHandler(error)).rejects.toEqual(error);
  });

  it('interceptor de sucesso retorna resposta diretamente', async () => {
    await import('../api-client');

    const instance = (axios.create as ReturnType<typeof vi.fn>).mock.results[0].value;
    const successHandler = instance.interceptors.response.use.mock.calls[0][0];

    const response = { data: 'test' };
    expect(successHandler(response)).toEqual(response);
  });
});
