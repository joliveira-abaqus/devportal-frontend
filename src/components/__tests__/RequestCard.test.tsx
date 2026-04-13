import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import RequestCard from '../RequestCard';
import type { Request } from '@/types';

vi.mock('next/link', () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));

const mockRequest: Request = {
  id: 'req-123',
  title: 'Corrigir bug no login',
  description: 'O login não funciona quando o email tem caracteres especiais',
  type: 'bug_fix',
  status: 'pending',
  userId: 'user-1',
  events: [],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

describe('RequestCard', () => {
  it('renderiza título da request', () => {
    render(<RequestCard request={mockRequest} />);
    expect(screen.getByText('Corrigir bug no login')).toBeInTheDocument();
  });

  it('renderiza descrição da request', () => {
    render(<RequestCard request={mockRequest} />);
    expect(
      screen.getByText('O login não funciona quando o email tem caracteres especiais'),
    ).toBeInTheDocument();
  });

  it('renderiza label do tipo (requestTypeLabels)', () => {
    render(<RequestCard request={mockRequest} />);
    expect(screen.getByText('Bug Fix')).toBeInTheDocument();
  });

  it('renderiza data relativa (formatRelativeDate)', () => {
    render(<RequestCard request={mockRequest} />);
    const timeElement = screen.getByText(/há/);
    expect(timeElement).toBeInTheDocument();
  });

  it('link aponta para /requests/{id}', () => {
    render(<RequestCard request={mockRequest} />);
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/requests/req-123');
  });
});
