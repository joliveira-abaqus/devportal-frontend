import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';

vi.mock('next-auth/jwt', () => ({
  getToken: vi.fn(),
}));

describe('middleware', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
  });

  it('redireciona para /login quando token é null', async () => {
    const { getToken } = await import('next-auth/jwt');
    (getToken as ReturnType<typeof vi.fn>).mockResolvedValueOnce(null);

    const { middleware } = await import('../middleware');

    const request = new NextRequest(new URL('http://localhost:3000/dashboard'));
    const response = await middleware(request);

    expect(response.status).toBe(307);
    const location = response.headers.get('location');
    expect(location).toContain('/login');
  });

  it('inclui callbackUrl com pathname + search no redirect', async () => {
    const { getToken } = await import('next-auth/jwt');
    (getToken as ReturnType<typeof vi.fn>).mockResolvedValueOnce(null);

    const { middleware } = await import('../middleware');

    const request = new NextRequest(new URL('http://localhost:3000/dashboard?page=1'));
    const response = await middleware(request);

    const location = response.headers.get('location');
    expect(location).toContain('callbackUrl');
    expect(location).toContain('%2Fdashboard');
  });

  it('retorna NextResponse.next() quando token existe', async () => {
    const { getToken } = await import('next-auth/jwt');
    (getToken as ReturnType<typeof vi.fn>).mockResolvedValueOnce({ id: '1', email: 'test@test.com' });

    const { middleware } = await import('../middleware');

    const request = new NextRequest(new URL('http://localhost:3000/dashboard'));
    const response = await middleware(request);

    expect(response.status).toBe(200);
  });

  it('matcher config inclui /dashboard/:path* e /requests/:path*', async () => {
    const { config } = await import('../middleware');

    expect(config.matcher).toContain('/dashboard/:path*');
    expect(config.matcher).toContain('/requests/:path*');
  });
});
