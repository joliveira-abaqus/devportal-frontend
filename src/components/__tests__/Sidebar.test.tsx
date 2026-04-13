import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import Sidebar from '../Sidebar';

vi.mock('next/link', () => ({
  default: ({ children, href, className }: { children: React.ReactNode; href: string; className?: string }) => (
    <a href={href} className={className}>{children}</a>
  ),
}));

const mockUsePathname = vi.fn(() => '/dashboard');
vi.mock('next/navigation', () => ({
  usePathname: () => mockUsePathname(),
}));

vi.mock('next-themes', () => ({
  useTheme: vi.fn(() => ({ resolvedTheme: 'light', setTheme: vi.fn() })),
}));

describe('Sidebar', () => {
  it('renderiza links de navegação', () => {
    render(<Sidebar />);
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Nova Solicitação')).toBeInTheDocument();
  });

  it('aplica classe ativa no link correspondente ao pathname atual', () => {
    mockUsePathname.mockReturnValue('/dashboard');
    render(<Sidebar />);
    const dashboardLink = screen.getByText('Dashboard').closest('a');
    expect(dashboardLink?.className).toContain('bg-brand-50');
  });

  it('não aplica classe ativa em link que não corresponde ao pathname', () => {
    mockUsePathname.mockReturnValue('/dashboard');
    render(<Sidebar />);
    const newRequestLink = screen.getByText('Nova Solicitação').closest('a');
    expect(newRequestLink?.className).not.toContain('bg-brand-50');
  });

  it('link de Configurações está presente', () => {
    render(<Sidebar />);
    expect(screen.getByText('Configurações')).toBeInTheDocument();
  });

  it('renderiza o logo DevPortal', () => {
    render(<Sidebar />);
    expect(screen.getByText('DevPortal')).toBeInTheDocument();
  });
});
