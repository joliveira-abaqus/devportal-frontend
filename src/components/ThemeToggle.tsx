'use client';

import { useTheme } from 'next-themes';
import { Sun, Moon } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700"
    >
      {theme === 'dark' ? (
        <Sun className="h-5 w-5 text-gray-400" />
      ) : (
        <Moon className="h-5 w-5 text-gray-400" />
      )}
      {theme === 'dark' ? 'Tema Claro' : 'Tema Escuro'}
    </button>
  );
}
