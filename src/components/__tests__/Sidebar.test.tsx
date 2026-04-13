import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import Sidebar from '../Sidebar';

vi.mock('next/link', () => ({
  default: ({ children, href, className }: { children: React.ReactNode; href: string; className?: string }) => (
    <a href={href} className={className}>{children}</a>
  ),
}));

vi.mock('next/navigation', () => ({
  usePathname: vi.fn(),
}));

vi.mock('@/components/ThemeToggle', () => ({
  default: () => <div data-testid="theme-toggle" />,
}));

describe('Sidebar', () => {
  it('renderiza links de navegação (Dashboard, Nova Solicitação)', async () => {
    const { usePathname } = await import('next/navigation');
    (usePathname as ReturnType<typeof vi.fn>).mockReturnValue('/dashboard');

    render(<Sidebar />);
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Nova Solicitação')).toBeInTheDocument();
  });

  it('aplica classe ativa no link correspondente ao pathname /dashboard', async () => {
    const { usePathname } = await import('next/navigation');
    (usePathname as ReturnType<typeof vi.fn>).mockReturnValue('/dashboard');

    render(<Sidebar />);
    const dashboardLink = screen.getByText('Dashboard').closest('a');
    expect(dashboardLink).toHaveClass('bg-brand-50');
  });

  it('aplica classe ativa no link correspondente ao pathname /requests/new', async () => {
    const { usePathname } = await import('next/navigation');
    (usePathname as ReturnType<typeof vi.fn>).mockReturnValue('/requests/new');

    render(<Sidebar />);
    const newRequestLink = screen.getByText('Nova Solicitação').closest('a');
    expect(newRequestLink).toHaveClass('bg-brand-50');
  });
});
