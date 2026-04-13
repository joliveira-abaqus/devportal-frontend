import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import RequestCard from '../RequestCard';
import type { Request } from '@/types';

vi.mock('next/link', () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));

vi.mock('next/navigation', () => ({
  usePathname: vi.fn(() => '/dashboard'),
}));

const mockRequest: Request = {
  id: 'req-1',
  title: 'Fix login bug',
  description: 'There is a bug in the login flow that needs to be fixed.',
  type: 'bug_fix',
  status: 'pending',
  userId: 'user-1',
  events: [],
  createdAt: new Date(Date.now() - 3600 * 1000).toISOString(),
  updatedAt: new Date().toISOString(),
};

describe('RequestCard', () => {
  it('renderiza título', () => {
    render(<RequestCard request={mockRequest} />);
    expect(screen.getByText('Fix login bug')).toBeInTheDocument();
  });

  it('renderiza descrição', () => {
    render(<RequestCard request={mockRequest} />);
    expect(screen.getByText(/There is a bug/)).toBeInTheDocument();
  });

  it('renderiza status badge', () => {
    render(<RequestCard request={mockRequest} />);
    expect(screen.getByText('Pendente')).toBeInTheDocument();
  });

  it('renderiza tipo', () => {
    render(<RequestCard request={mockRequest} />);
    expect(screen.getByText('Bug Fix')).toBeInTheDocument();
  });

  it('renderiza data relativa', () => {
    render(<RequestCard request={mockRequest} />);
    expect(screen.getByText(/há/)).toBeInTheDocument();
  });

  it('link aponta para /requests/{id}', () => {
    render(<RequestCard request={mockRequest} />);
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/requests/req-1');
  });
});
