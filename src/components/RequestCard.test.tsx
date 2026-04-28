import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import RequestCard from './RequestCard';
import type { Request } from '@/types';

// Mock next/link
vi.mock('next/link', () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));

const mockRequest: Request = {
  id: '1',
  title: 'Corrigir bug no login',
  description: 'O botão de login não responde em dispositivos mobile',
  type: 'bug_fix',
  status: 'pending',
  userId: '1',
  events: [],
  createdAt: '2024-01-15T10:00:00Z',
  updatedAt: '2024-01-15T10:00:00Z',
};

describe('RequestCard', () => {
  it('deve renderizar título da solicitação', () => {
    render(<RequestCard request={mockRequest} />);
    expect(screen.getByText('Corrigir bug no login')).toBeInTheDocument();
  });

  it('deve renderizar descrição', () => {
    render(<RequestCard request={mockRequest} />);
    expect(screen.getByText('O botão de login não responde em dispositivos mobile')).toBeInTheDocument();
  });

  it('deve renderizar tipo da solicitação', () => {
    render(<RequestCard request={mockRequest} />);
    expect(screen.getByText('Bug Fix')).toBeInTheDocument();
  });

  it('deve renderizar status badge', () => {
    render(<RequestCard request={mockRequest} />);
    expect(screen.getByText('Pendente')).toBeInTheDocument();
  });

  it('deve ter link para detalhes da solicitação', () => {
    render(<RequestCard request={mockRequest} />);
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/requests/1');
  });

  it('deve renderizar data relativa', () => {
    render(<RequestCard request={mockRequest} />);
    expect(screen.getByText(/há/)).toBeInTheDocument();
  });

  it('deve renderizar solicitação com status in_progress', () => {
    const inProgressRequest = { ...mockRequest, status: 'in_progress' as const };
    render(<RequestCard request={inProgressRequest} />);
    expect(screen.getByText('Em Progresso')).toBeInTheDocument();
  });
});
