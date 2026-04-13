import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';

vi.mock('next-auth/jwt', () => ({
  getToken: vi.fn(),
}));

import { getToken } from 'next-auth/jwt';
import { middleware, config } from '../middleware';

describe('middleware', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('retorna NextResponse.next() quando token existe', async () => {
    (getToken as ReturnType<typeof vi.fn>).mockResolvedValue({ id: '1' });

    const request = new NextRequest(new URL('http://localhost:3000/dashboard'));
    const response = await middleware(request);

    expect(response.headers.get('x-middleware-next')).toBe('1');
  });

  it('redireciona para /login quando token é null', async () => {
    (getToken as ReturnType<typeof vi.fn>).mockResolvedValue(null);

    const request = new NextRequest(new URL('http://localhost:3000/dashboard'));
    const response = await middleware(request);

    expect(response.status).toBe(307);
    const location = response.headers.get('location');
    expect(location).toContain('/login');
    expect(location).toContain('callbackUrl');
  });

  it('inclui callbackUrl correto no redirect', async () => {
    (getToken as ReturnType<typeof vi.fn>).mockResolvedValue(null);

    const request = new NextRequest(new URL('http://localhost:3000/dashboard/settings'));
    const response = await middleware(request);

    const location = response.headers.get('location');
    expect(location).toContain('callbackUrl=%2Fdashboard%2Fsettings');
  });

  it('preserva query params no callbackUrl', async () => {
    (getToken as ReturnType<typeof vi.fn>).mockResolvedValue(null);

    const request = new NextRequest(new URL('http://localhost:3000/requests?status=pending'));
    const response = await middleware(request);

    const location = response.headers.get('location');
    expect(location).toContain('callbackUrl');
  });
});

describe('config', () => {
  it('matcher inclui /dashboard/:path*', () => {
    expect(config.matcher).toContain('/dashboard/:path*');
  });

  it('matcher inclui /requests/:path*', () => {
    expect(config.matcher).toContain('/requests/:path*');
  });
});
