import { render, screen } from '@testing-library/react';
import Sidebar from '@/components/Sidebar';

jest.mock('next/navigation', () => ({
  usePathname: jest.fn(() => '/dashboard'),
}));

jest.mock('next/link', () => {
  const MockLink = ({ children, href, className }: { children: React.ReactNode; href: string; className?: string }) => (
    <a href={href} className={className}>{children}</a>
  );
  MockLink.displayName = 'MockLink';
  return MockLink;
});

jest.mock('next-themes', () => ({
  useTheme: jest.fn(() => ({
    resolvedTheme: 'light',
    setTheme: jest.fn(),
  })),
}));

describe('Sidebar', () => {
  it('deve renderizar o logo DevPortal', () => {
    render(<Sidebar />);
    expect(screen.getByText('DevPortal')).toBeInTheDocument();
  });

  it('deve renderizar link para Dashboard', () => {
    render(<Sidebar />);
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
  });

  it('deve renderizar link para Nova Solicitação', () => {
    render(<Sidebar />);
    expect(screen.getByText('Nova Solicitação')).toBeInTheDocument();
  });

  it('deve renderizar link para Configurações', () => {
    render(<Sidebar />);
    expect(screen.getByText('Configurações')).toBeInTheDocument();
  });

  it('deve renderizar o toggle de tema', () => {
    render(<Sidebar />);
    expect(screen.getByText('Tema Escuro')).toBeInTheDocument();
  });

  it('deve destacar o item ativo na navegação', () => {
    const { usePathname } = require('next/navigation');
    usePathname.mockReturnValue('/dashboard');

    render(<Sidebar />);
    const dashboardLink = screen.getByText('Dashboard').closest('a');
    expect(dashboardLink).toHaveClass('bg-brand-50');
  });

  it('deve destacar Nova Solicitação quando na rota /requests/new', () => {
    const { usePathname } = require('next/navigation');
    usePathname.mockReturnValue('/requests/new');

    render(<Sidebar />);
    const newRequestLink = screen.getByText('Nova Solicitação').closest('a');
    expect(newRequestLink).toHaveClass('bg-brand-50');
  });
});
