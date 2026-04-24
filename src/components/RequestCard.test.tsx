import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import RequestCard from './RequestCard';
import type { Request } from '@/types';

vi.mock('next/link', () => ({
  default: ({ children, href, ...props }: { children: React.ReactNode; href: string }) => (
    <a href={href} {...props}>{children}</a>
  ),
}));

const mockRequest: Request = {
  id: 'req-123',
  title: 'Corrigir bug no login',
  description: 'O botão de login não funciona no Safari quando o usuário clica rapidamente',
  type: 'bug_fix',
  status: 'in_progress',
  userId: 'user-1',
  events: [],
  createdAt: new Date(Date.now() - 3600 * 1000).toISOString(),
  updatedAt: new Date().toISOString(),
};

describe('RequestCard', () => {
  it('renderiza título da solicitação', () => {
    render(<RequestCard request={mockRequest} />);
    expect(screen.getByText('Corrigir bug no login')).toBeInTheDocument();
  });

  it('renderiza descrição da solicitação', () => {
    render(<RequestCard request={mockRequest} />);
    expect(screen.getByText(/O botão de login não funciona/)).toBeInTheDocument();
  });

  it('renderiza tipo da solicitação', () => {
    render(<RequestCard request={mockRequest} />);
    expect(screen.getByText('Bug Fix')).toBeInTheDocument();
  });

  it('renderiza badge de status', () => {
    render(<RequestCard request={mockRequest} />);
    expect(screen.getByText('Em Progresso')).toBeInTheDocument();
  });

  it('renderiza data relativa', () => {
    render(<RequestCard request={mockRequest} />);
    expect(screen.getByText(/há/)).toBeInTheDocument();
  });

  it('contém link para a página de detalhes', () => {
    render(<RequestCard request={mockRequest} />);
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/requests/req-123');
  });

  it('renderiza corretamente para tipo feature', () => {
    render(<RequestCard request={{ ...mockRequest, type: 'feature', status: 'pending' }} />);
    expect(screen.getByText('Feature')).toBeInTheDocument();
    expect(screen.getByText('Pendente')).toBeInTheDocument();
  });
});
