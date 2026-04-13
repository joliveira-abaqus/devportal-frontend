import { vi } from 'vitest';
export const useRouter = vi.fn(() => ({
  push: vi.fn(),
  back: vi.fn(),
  refresh: vi.fn(),
  replace: vi.fn(),
}));
export const usePathname = vi.fn(() => '/dashboard');
export const useSearchParams = vi.fn(() => new URLSearchParams());
export const useParams = vi.fn(() => ({}));
export const redirect = vi.fn();
