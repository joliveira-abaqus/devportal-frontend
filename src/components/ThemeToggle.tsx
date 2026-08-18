import { Sun, Moon } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

export default function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <button
      onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
      className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700"
    >
      {resolvedTheme === 'dark' ? (
        <Sun className="h-5 w-5 text-gray-400" />
      ) : (
        <Moon className="h-5 w-5 text-gray-400" />
      )}
      {resolvedTheme === 'dark' ? 'Tema Claro' : 'Tema Escuro'}
    </button>
  );
}
