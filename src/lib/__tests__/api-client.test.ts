import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

describe('apiClient', () => {
  const originalLocation = window.location;

  beforeEach(() => {
    vi.resetModules();
    Object.defineProperty(window, 'location', {
      writable: true,
      value: { ...originalLocation, href: '' },
    });
  });

  afterEach(() => {
    Object.defineProperty(window, 'location', {
      writable: true,
      value: originalLocation,
    });
  });

  it('redireciona para /login ao receber erro 401', async () => {
    const { default: apiClient } = await import('../api-client');

    const mockAdapter = vi.fn().mockRejectedValue({
      response: { status: 401, data: {} },
      config: {},
      isAxiosError: true,
    });
    apiClient.defaults.adapter = mockAdapter;

    await expect(apiClient.get('/test')).rejects.toBeTruthy();
    expect(window.location.href).toBe('/login');
  });

  it('propaga erro 403 sem redirecionar', async () => {
    const { default: apiClient } = await import('../api-client');

    const error403 = {
      response: { status: 403, data: {} },
      config: {},
      isAxiosError: true,
    };
    const mockAdapter = vi.fn().mockRejectedValue(error403);
    apiClient.defaults.adapter = mockAdapter;

    await expect(apiClient.get('/test')).rejects.toBeTruthy();
    expect(window.location.href).not.toBe('/login');
  });

  it('propaga erro 500 sem redirecionar', async () => {
    const { default: apiClient } = await import('../api-client');

    const error500 = {
      response: { status: 500, data: {} },
      config: {},
      isAxiosError: true,
    };
    const mockAdapter = vi.fn().mockRejectedValue(error500);
    apiClient.defaults.adapter = mockAdapter;

    await expect(apiClient.get('/test')).rejects.toBeTruthy();
    expect(window.location.href).not.toBe('/login');
  });

  it('permite respostas de sucesso passarem normalmente', async () => {
    const { default: apiClient } = await import('../api-client');

    const mockAdapter = vi.fn().mockResolvedValue({
      data: { message: 'ok' },
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {},
    });
    apiClient.defaults.adapter = mockAdapter;

    const response = await apiClient.get('/test');
    expect(response.data).toEqual({ message: 'ok' });
  });
});
