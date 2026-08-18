import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { User } from '@/types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
const USER_STORAGE_KEY = 'devportal:user';

interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<User>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function normalizeUser(body: unknown): User {
  const response = body as Record<string, unknown>;
  const nestedUser = response.data;
  const user =
    nestedUser && typeof nestedUser === 'object' ? (nestedUser as Record<string, unknown>) : response;

  return {
    id: String(user.id),
    email: String(user.email),
    name: String(user.name ?? user.email),
    createdAt: String(user.createdAt ?? ''),
  };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem(USER_STORAGE_KEY);
      if (storedUser) {
        setUser(JSON.parse(storedUser) as User);
      }
    } catch {
      localStorage.removeItem(USER_STORAGE_KEY);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string, password: string): Promise<User> => {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      throw new Error('Credenciais inválidas');
    }

    const authenticatedUser = normalizeUser(await response.json());
    setUser(authenticatedUser);
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(authenticatedUser));
    return authenticatedUser;
  };

  const logout = async (): Promise<void> => {
    setUser(null);
    localStorage.removeItem(USER_STORAGE_KEY);

    try {
      await fetch(`${API_URL}/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      });
    } catch {
      // O logout local permanece efetivo mesmo se a API estiver indisponível.
    }
  };

  const value = useMemo(() => ({ user, isLoading, login, logout }), [user, isLoading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider');
  }
  return context;
}

export const authStorageKey = USER_STORAGE_KEY;
