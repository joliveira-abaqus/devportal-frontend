import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Sidebar from './Sidebar';

vi.mock('next/navigation', () => ({
  usePathname: () => '/dashboard',
}));

vi.mock('next/link', () => ({
  default: ({ children, href, className }: { children: React.ReactNode; href: string; className?: string }) => (
    <a href={href} className={className}>{children}</a>
  ),
}));

vi.mock('@/components/ThemeToggle', () => ({
  default: () => <div data-testid="theme-toggle">ThemeToggle</div>,
}));

describe('Sidebar', () => {
  it('deve renderizar logo DevPortal', () => {
    render(<Sidebar />);
    expect(screen.getByText('DevPortal')).toBeInTheDocument();
  });

  it('deve renderizar item de navegação Dashboard', () => {
    render(<Sidebar />);
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
  });

  it('deve renderizar item Nova Solicitação', () => {
    render(<Sidebar />);
    expect(screen.getByText('Nova Solicitação')).toBeInTheDocument();
  });

  it('deve renderizar link de Configurações', () => {
    render(<Sidebar />);
    expect(screen.getByText('Configurações')).toBeInTheDocument();
  });

  it('deve renderizar ThemeToggle', () => {
    render(<Sidebar />);
    expect(screen.getByTestId('theme-toggle')).toBeInTheDocument();
  });

  it('deve destacar item ativo baseado no pathname', () => {
    render(<Sidebar />);
    const dashboardLink = screen.getByText('Dashboard').closest('a');
    expect(dashboardLink?.className).toContain('bg-brand-50');
  });
});
