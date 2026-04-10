'use client';

import { signOut, useSession } from 'next-auth/react';
import { LogOut, User } from 'lucide-react';
import Button from '@/components/ui/Button';

export default function Header() {
  const { data: session } = useSession();

  return (
    <header className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-6 dark:border-gray-700 dark:bg-gray-800">
      <div>
        <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100">DevPortal</h1>
      </div>

      <div className="flex items-center gap-4">
        {session?.user && (
          <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
            <User className="h-4 w-4" />
            <span>{session.user.name || session.user.email}</span>
          </div>
        )}

        <Button
          variant="ghost"
          size="sm"
          onClick={() => signOut({ callbackUrl: '/login' })}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sair
        </Button>
      </div>
    </header>
  );
}
