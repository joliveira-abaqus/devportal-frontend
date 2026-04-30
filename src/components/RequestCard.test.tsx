import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import RequestCard from './RequestCard';
import type { Request } from '@/types';

vi.mock('next/link', () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));

const mockRequest: Request = {
  id: 'req-123',
  title: 'Corrigir bug de login',
  description: 'Usuários não conseguem fazer login com email válido',
  type: 'bug_fix',
  status: 'pending',
  userId: 'user-1',
  events: [],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

describe('RequestCard', () => {
  it('renderiza título da solicitação', () => {
    render(<RequestCard request={mockRequest} />);
    expect(screen.getByText('Corrigir bug de login')).toBeInTheDocument();
  });

  it('renderiza descrição da solicitação', () => {
    render(<RequestCard request={mockRequest} />);
    expect(screen.getByText('Usuários não conseguem fazer login com email válido')).toBeInTheDocument();
  });

  it('renderiza label do tipo', () => {
    render(<RequestCard request={mockRequest} />);
    expect(screen.getByText('Bug Fix')).toBeInTheDocument();
  });

  it('renderiza badge de status', () => {
    render(<RequestCard request={mockRequest} />);
    expect(screen.getByText('Pendente')).toBeInTheDocument();
  });

  it('cria link para a página de detalhes', () => {
    render(<RequestCard request={mockRequest} />);
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/requests/req-123');
  });

  it('exibe data relativa', () => {
    render(<RequestCard request={mockRequest} />);
    expect(screen.getByText(/há/)).toBeInTheDocument();
  });
});
