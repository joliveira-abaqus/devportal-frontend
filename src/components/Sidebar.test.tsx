import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import Sidebar from './Sidebar';

vi.mock('next/link', () => ({
  default: ({ children, href, ...props }: { children: React.ReactNode; href: string; className?: string }) => (
    <a href={href} {...props}>{children}</a>
  ),
}));

vi.mock('next/navigation', () => ({
  usePathname: () => '/dashboard',
}));

vi.mock('@/components/ThemeToggle', () => ({
  default: () => <div data-testid="theme-toggle">ThemeToggle</div>,
}));

describe('Sidebar', () => {
  it('renderiza logo DevPortal', () => {
    render(<Sidebar />);
    expect(screen.getByText('DevPortal')).toBeInTheDocument();
  });

  it('renderiza links de navegação', () => {
    render(<Sidebar />);
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Nova Solicitação')).toBeInTheDocument();
  });

  it('renderiza link de configurações', () => {
    render(<Sidebar />);
    expect(screen.getByText('Configurações')).toBeInTheDocument();
  });

  it('renderiza componente ThemeToggle', () => {
    render(<Sidebar />);
    expect(screen.getByTestId('theme-toggle')).toBeInTheDocument();
  });

  it('link Dashboard aponta para /dashboard', () => {
    render(<Sidebar />);
    const link = screen.getByText('Dashboard').closest('a');
    expect(link).toHaveAttribute('href', '/dashboard');
  });

  it('link Nova Solicitação aponta para /requests/new', () => {
    render(<Sidebar />);
    const link = screen.getByText('Nova Solicitação').closest('a');
    expect(link).toHaveAttribute('href', '/requests/new');
  });
});
