import { vi } from 'vitest';
export const useSession = vi.fn(() => ({ data: null, status: 'unauthenticated' }));
export const signIn = vi.fn();
export const signOut = vi.fn();
export const SessionProvider = ({ children }: { children: React.ReactNode }) => children;
