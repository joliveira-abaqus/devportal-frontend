import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import DashboardPage from './page';
import type { Request } from '@/types';

const mockRequests: Request[] = [
  {
    id: '1',
    title: 'Bug no login',
    description: 'Erro ao fazer login com email válido',
    type: 'bug_fix',
    status: 'pending',
    userId: 'user-1',
    events: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'Adicionar feature',
    description: 'Implementar nova funcionalidade',
    type: 'feature',
    status: 'in_progress',
    userId: 'user-1',
    events: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const mockUseRequests = vi.fn();

vi.mock('@/hooks/useRequests', () => ({
  useRequests: (...args: unknown[]) => mockUseRequests(...args),
}));

vi.mock('next/link', () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));

describe('DashboardPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renderiza título "Minhas Solicitações"', () => {
    mockUseRequests.mockReturnValue({
      requests: [],
      isLoading: false,
      error: null,
      refetch: vi.fn(),
    });
    render(<DashboardPage />);
    expect(screen.getByText('Minhas Solicitações')).toBeInTheDocument();
  });

  it('renderiza link "Nova Solicitação"', () => {
    mockUseRequests.mockReturnValue({
      requests: [],
      isLoading: false,
      error: null,
      refetch: vi.fn(),
    });
    render(<DashboardPage />);
    expect(screen.getByText('Nova Solicitação')).toBeInTheDocument();
  });

  it('exibe skeletons durante loading', () => {
    mockUseRequests.mockReturnValue({
      requests: [],
      isLoading: true,
      error: null,
      refetch: vi.fn(),
    });
    const { container } = render(<DashboardPage />);
    const skeletons = container.querySelectorAll('.animate-pulse');
    expect(skeletons.length).toBe(3);
  });

  it('exibe mensagem de erro', () => {
    mockUseRequests.mockReturnValue({
      requests: [],
      isLoading: false,
      error: 'Erro ao carregar solicitações',
      refetch: vi.fn(),
    });
    render(<DashboardPage />);
    expect(screen.getByText('Erro ao carregar solicitações')).toBeInTheDocument();
  });

  it('exibe mensagem quando não há solicitações', () => {
    mockUseRequests.mockReturnValue({
      requests: [],
      isLoading: false,
      error: null,
      refetch: vi.fn(),
    });
    render(<DashboardPage />);
    expect(screen.getByText('Nenhuma solicitação encontrada.')).toBeInTheDocument();
  });

  it('renderiza lista de solicitações', () => {
    mockUseRequests.mockReturnValue({
      requests: mockRequests,
      isLoading: false,
      error: null,
      refetch: vi.fn(),
    });
    render(<DashboardPage />);
    expect(screen.getByText('Bug no login')).toBeInTheDocument();
    expect(screen.getByText('Adicionar feature')).toBeInTheDocument();
  });

  it('renderiza filtros de status e tipo', () => {
    mockUseRequests.mockReturnValue({
      requests: [],
      isLoading: false,
      error: null,
      refetch: vi.fn(),
    });
    render(<DashboardPage />);
    expect(screen.getByText('Todos os status')).toBeInTheDocument();
    expect(screen.getByText('Todos os tipos')).toBeInTheDocument();
  });
});
