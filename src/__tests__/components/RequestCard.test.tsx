import { render, screen } from '@testing-library/react';
import RequestCard from '@/components/RequestCard';
import type { Request } from '@/types';

jest.mock('next/link', () => {
  const MockLink = ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  );
  MockLink.displayName = 'MockLink';
  return MockLink;
});

const mockRequest: Request = {
  id: 'req-123',
  title: 'Corrigir bug no login',
  description: 'O botão de login não funciona corretamente',
  type: 'bug_fix',
  status: 'pending',
  userId: 'user-1',
  events: [],
  createdAt: new Date(Date.now() - 3600000).toISOString(),
  updatedAt: new Date().toISOString(),
};

describe('RequestCard', () => {
  it('deve renderizar o título da solicitação', () => {
    render(<RequestCard request={mockRequest} />);
    expect(screen.getByText('Corrigir bug no login')).toBeInTheDocument();
  });

  it('deve renderizar a descrição da solicitação', () => {
    render(<RequestCard request={mockRequest} />);
    expect(screen.getByText('O botão de login não funciona corretamente')).toBeInTheDocument();
  });

  it('deve renderizar o badge de status', () => {
    render(<RequestCard request={mockRequest} />);
    expect(screen.getByText('Pendente')).toBeInTheDocument();
  });

  it('deve renderizar o tipo da solicitação', () => {
    render(<RequestCard request={mockRequest} />);
    expect(screen.getByText('Bug Fix')).toBeInTheDocument();
  });

  it('deve renderizar link para o detalhe da solicitação', () => {
    render(<RequestCard request={mockRequest} />);
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/requests/req-123');
  });

  it('deve renderizar data relativa', () => {
    render(<RequestCard request={mockRequest} />);
    expect(screen.getByText(/há/)).toBeInTheDocument();
  });

  it('deve renderizar corretamente com status done', () => {
    render(<RequestCard request={{ ...mockRequest, status: 'done' }} />);
    expect(screen.getByText('Concluído')).toBeInTheDocument();
  });

  it('deve renderizar corretamente com tipo feature', () => {
    render(<RequestCard request={{ ...mockRequest, type: 'feature' }} />);
    expect(screen.getByText('Feature')).toBeInTheDocument();
  });

  it('deve renderizar corretamente com tipo migration', () => {
    render(<RequestCard request={{ ...mockRequest, type: 'migration' }} />);
    expect(screen.getByText('Migration')).toBeInTheDocument();
  });
});
