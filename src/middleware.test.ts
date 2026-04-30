import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const mockGetToken = vi.fn();

vi.mock('next-auth/jwt', () => ({
  getToken: (...args: unknown[]) => mockGetToken(...args),
}));

vi.mock('next/server', () => {
  const redirect = vi.fn((url: URL) => ({ type: 'redirect', url: url.toString() }));
  const next = vi.fn(() => ({ type: 'next' }));
  return {
    NextResponse: { redirect, next },
  };
});

describe('middleware', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.resetModules();
  });

  it('redireciona para /login quando não há token', async () => {
    mockGetToken.mockResolvedValue(null);
    const { middleware } = await import('./middleware');

    const request = {
      url: 'http://localhost:3000/dashboard',
      nextUrl: { pathname: '/dashboard', search: '' },
    } as unknown as NextRequest;

    await middleware(request);

    expect(NextResponse.redirect).toHaveBeenCalled();
    const redirectCall = vi.mocked(NextResponse.redirect).mock.calls[0][0] as URL;
    expect(redirectCall.pathname).toBe('/login');
    expect(redirectCall.searchParams.get('callbackUrl')).toBe('/dashboard');
  });

  it('permite acesso quando há token válido', async () => {
    mockGetToken.mockResolvedValue({ id: 'user-1', email: 'test@test.com' });
    const { middleware } = await import('./middleware');

    const request = {
      url: 'http://localhost:3000/dashboard',
      nextUrl: { pathname: '/dashboard', search: '' },
    } as unknown as NextRequest;

    await middleware(request);

    expect(NextResponse.next).toHaveBeenCalled();
  });

  it('inclui search params no callbackUrl', async () => {
    mockGetToken.mockResolvedValue(null);
    const { middleware } = await import('./middleware');

    const request = {
      url: 'http://localhost:3000/requests/new?ref=dashboard',
      nextUrl: { pathname: '/requests/new', search: '?ref=dashboard' },
    } as unknown as NextRequest;

    await middleware(request);

    const redirectCall = vi.mocked(NextResponse.redirect).mock.calls[0][0] as URL;
    expect(redirectCall.searchParams.get('callbackUrl')).toBe('/requests/new?ref=dashboard');
  });
});

describe('middleware config', () => {
  it('exporta matcher para rotas protegidas', async () => {
    const { config } = await import('./middleware');
    expect(config.matcher).toContain('/dashboard/:path*');
    expect(config.matcher).toContain('/requests/:path*');
  });
});
