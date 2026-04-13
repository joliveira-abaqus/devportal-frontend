import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import RequestDetailPage from '../page';

vi.mock('next/link', () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));

vi.mock('next/navigation', () => ({
  useParams: () => ({ id: 'req-1' }),
}));

vi.mock('@/components/Sidebar', () => ({
  default: () => <div data-testid="sidebar">Sidebar</div>,
}));

vi.mock('@/components/Header', () => ({
  default: () => <div data-testid="header">Header</div>,
}));

const mockUseRequest = vi.fn();
vi.mock('@/hooks/useRequest', () => ({
  useRequest: (...args: unknown[]) => mockUseRequest(...args),
}));

describe('RequestDetailPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('mostra skeletons quando isLoading=true', () => {
    mockUseRequest.mockReturnValue({
      request: null,
      isLoading: true,
      error: null,
    });

    const { container } = render(<RequestDetailPage />);
    const pulses = container.querySelectorAll('.animate-pulse');
    expect(pulses.length).toBeGreaterThan(0);
  });

  it('mostra mensagem de erro', () => {
    mockUseRequest.mockReturnValue({
      request: null,
      isLoading: false,
      error: 'Erro ao carregar solicitação',
    });

    render(<RequestDetailPage />);
    expect(screen.getByText('Erro ao carregar solicitação')).toBeInTheDocument();
  });

  it('mostra título, descrição, status, tipo, data quando carregado', () => {
    mockUseRequest.mockReturnValue({
      request: {
        id: 'req-1',
        title: 'Fix login bug',
        description: 'Detailed description here',
        type: 'bug_fix',
        status: 'pending',
        userId: 'u1',
        events: [],
        createdAt: '2024-06-15T14:30:00Z',
        updatedAt: '2024-06-15T14:30:00Z',
      },
      isLoading: false,
      error: null,
    });

    render(<RequestDetailPage />);
    expect(screen.getByText('Fix login bug')).toBeInTheDocument();
    expect(screen.getByText('Detailed description here')).toBeInTheDocument();
    expect(screen.getByText('Pendente')).toBeInTheDocument();
    expect(screen.getByText('Bug Fix')).toBeInTheDocument();
    expect(screen.getByText(/15\/06\/2024/)).toBeInTheDocument();
  });

  it('mostra timeline', () => {
    mockUseRequest.mockReturnValue({
      request: {
        id: 'req-1',
        title: 'Test',
        description: 'Desc',
        type: 'feature',
        status: 'pending',
        userId: 'u1',
        events: [],
        createdAt: '2024-06-15T14:30:00Z',
        updatedAt: '2024-06-15T14:30:00Z',
      },
      isLoading: false,
      error: null,
    });

    render(<RequestDetailPage />);
    expect(screen.getByText('Timeline')).toBeInTheDocument();
    expect(screen.getByText('Nenhum evento registrado ainda.')).toBeInTheDocument();
  });

  it('mostra link de PR quando prUrl existe', () => {
    mockUseRequest.mockReturnValue({
      request: {
        id: 'req-1',
        title: 'Test',
        description: 'Desc',
        type: 'feature',
        status: 'pending',
        userId: 'u1',
        prUrl: 'https://github.com/org/repo/pull/1',
        events: [],
        createdAt: '2024-06-15T14:30:00Z',
        updatedAt: '2024-06-15T14:30:00Z',
      },
      isLoading: false,
      error: null,
    });

    render(<RequestDetailPage />);
    expect(screen.getByText('Pull Request')).toBeInTheDocument();
    const prLink = screen.getByText('https://github.com/org/repo/pull/1');
    expect(prLink).toHaveAttribute('href', 'https://github.com/org/repo/pull/1');
  });

  it('mostra link de download quando attachmentUrl existe', () => {
    mockUseRequest.mockReturnValue({
      request: {
        id: 'req-1',
        title: 'Test',
        description: 'Desc',
        type: 'feature',
        status: 'pending',
        userId: 'u1',
        attachmentUrl: 'https://s3.example.com/file.pdf',
        attachmentName: 'file.pdf',
        events: [],
        createdAt: '2024-06-15T14:30:00Z',
        updatedAt: '2024-06-15T14:30:00Z',
      },
      isLoading: false,
      error: null,
    });

    render(<RequestDetailPage />);
    expect(screen.getByText('Arquivo Anexo')).toBeInTheDocument();
    const downloadLink = screen.getByText('file.pdf');
    expect(downloadLink).toHaveAttribute('href', 'https://s3.example.com/file.pdf');
  });

  it('mostra "Download" quando attachmentName não existe', () => {
    mockUseRequest.mockReturnValue({
      request: {
        id: 'req-1',
        title: 'Test',
        description: 'Desc',
        type: 'feature',
        status: 'pending',
        userId: 'u1',
        attachmentUrl: 'https://s3.example.com/file.pdf',
        events: [],
        createdAt: '2024-06-15T14:30:00Z',
        updatedAt: '2024-06-15T14:30:00Z',
      },
      isLoading: false,
      error: null,
    });

    render(<RequestDetailPage />);
    expect(screen.getByText('Download')).toBeInTheDocument();
  });

  it('link "Voltar ao Dashboard" está presente', () => {
    mockUseRequest.mockReturnValue({
      request: null,
      isLoading: true,
      error: null,
    });

    render(<RequestDetailPage />);
    const backLink = screen.getByText('Voltar ao Dashboard');
    expect(backLink.closest('a')).toHaveAttribute('href', '/dashboard');
  });

  it('não renderiza conteúdo quando request é null e não está carregando', () => {
    mockUseRequest.mockReturnValue({
      request: null,
      isLoading: false,
      error: null,
    });

    render(<RequestDetailPage />);
    expect(screen.queryByText('Timeline')).not.toBeInTheDocument();
  });
});
