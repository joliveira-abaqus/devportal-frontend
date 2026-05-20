import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';

vi.mock('next-auth/jwt', () => ({
  getToken: vi.fn(),
}));

import { getToken } from 'next-auth/jwt';
import { middleware, config } from '../middleware';

function createMockRequest(url: string): NextRequest {
  return new NextRequest(new URL(url, 'http://localhost:3000'));
}

describe('middleware', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('redireciona para /login com callbackUrl quando não há token', async () => {
    vi.mocked(getToken).mockResolvedValue(null);

    const request = createMockRequest('/dashboard');
    const response = await middleware(request);

    expect(response.status).toBe(307);
    const location = response.headers.get('location');
    expect(location).toContain('/login');
    expect(location).toContain('callbackUrl=%2Fdashboard');
  });

  it('preserva pathname + search na callbackUrl', async () => {
    vi.mocked(getToken).mockResolvedValue(null);

    const request = createMockRequest('/requests/123?tab=events');
    const response = await middleware(request);

    const location = response.headers.get('location');
    expect(location).toContain('/login');
    expect(location).toContain('callbackUrl=');
    expect(location).toContain('%2Frequests%2F123');
  });

  it('retorna NextResponse.next() quando há token válido', async () => {
    vi.mocked(getToken).mockResolvedValue({ sub: 'user-1', name: 'Test' } as never);

    const request = createMockRequest('/dashboard');
    const response = await middleware(request);

    expect(response.status).toBe(200);
  });
});

describe('middleware config.matcher', () => {
  it('cobre /dashboard/:path*', () => {
    expect(config.matcher).toContain('/dashboard/:path*');
  });

  it('cobre /requests/:path*', () => {
    expect(config.matcher).toContain('/requests/:path*');
  });
});
