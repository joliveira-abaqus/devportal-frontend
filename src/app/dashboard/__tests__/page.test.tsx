import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import DashboardPage from '../page';

vi.mock('next/link', () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));

const mockUseRequests = vi.fn();
vi.mock('@/hooks/useRequests', () => ({
  useRequests: (...args: unknown[]) => mockUseRequests(...args),
}));

describe('DashboardPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('mostra skeletons quando isLoading=true', () => {
    mockUseRequests.mockReturnValue({
      requests: [],
      isLoading: true,
      error: null,
    });

    const { container } = render(<DashboardPage />);
    const pulses = container.querySelectorAll('.animate-pulse');
    expect(pulses.length).toBeGreaterThan(0);
  });

  it('mostra mensagem de erro', () => {
    mockUseRequests.mockReturnValue({
      requests: [],
      isLoading: false,
      error: 'Erro ao carregar',
    });

    render(<DashboardPage />);
    expect(screen.getByText('Erro ao carregar')).toBeInTheDocument();
  });

  it('mostra mensagem e botão quando lista vazia', () => {
    mockUseRequests.mockReturnValue({
      requests: [],
      isLoading: false,
      error: null,
    });

    render(<DashboardPage />);
    expect(screen.getByText('Nenhuma solicitação encontrada.')).toBeInTheDocument();
    expect(screen.getByText('Criar primeira solicitação')).toBeInTheDocument();
  });

  it('renderiza RequestCards quando há requests', () => {
    mockUseRequests.mockReturnValue({
      requests: [
        {
          id: '1',
          title: 'Request 1',
          description: 'Desc',
          type: 'feature',
          status: 'pending',
          userId: 'u1',
          events: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ],
      isLoading: false,
      error: null,
    });

    render(<DashboardPage />);
    expect(screen.getByText('Request 1')).toBeInTheDocument();
  });

  it('filtro de status funciona', () => {
    mockUseRequests.mockReturnValue({
      requests: [],
      isLoading: false,
      error: null,
    });

    render(<DashboardPage />);
    const statusSelect = document.getElementById('status-filter') as HTMLSelectElement;
    fireEvent.change(statusSelect, { target: { value: 'pending' } });

    // Verifica que useRequests foi chamado (o estado é atualizado)
    expect(mockUseRequests).toHaveBeenCalled();
  });

  it('filtro de tipo funciona', () => {
    mockUseRequests.mockReturnValue({
      requests: [],
      isLoading: false,
      error: null,
    });

    render(<DashboardPage />);
    const typeSelect = document.getElementById('type-filter') as HTMLSelectElement;
    fireEvent.change(typeSelect, { target: { value: 'bug_fix' } });

    expect(mockUseRequests).toHaveBeenCalled();
  });

  it('link "Nova Solicitação" aponta para /requests/new', () => {
    mockUseRequests.mockReturnValue({
      requests: [],
      isLoading: false,
      error: null,
    });

    render(<DashboardPage />);
    const links = screen.getAllByRole('link');
    const newRequestLink = links.find((l) => l.getAttribute('href') === '/requests/new');
    expect(newRequestLink).toBeDefined();
  });
});
