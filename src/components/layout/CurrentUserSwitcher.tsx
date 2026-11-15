'use client';

import { Button } from '@/ui/Button';

import { fetchRequest } from '@/lib/api';
import { useAuthStore } from '@/lib/authStore';
import { clearSession } from '@/lib/currentUser';
import { cn } from '@/lib/utils/cn';

// Link do /login gdy nikt nie jest zalogowany, imię + wylogowanie gdy jest.
// Reaktywne przez useAuthStore — żadnego ręcznego nasłuchiwania na zmiany.
// stacked: wersja pionowa do menu mobilnego, gdzie rząd przycisków się nie mieści.
export const CurrentUserSwitcher = ({ stacked = false }: { stacked?: boolean }) => {
  const user = useAuthStore((state) => state.user);

  const handleLogout = async () => {
    // BEZ body — refresh token backend czyta z httpOnly cookie. Best-effort:
    // nawet jeśli to zapytanie samo dostanie błąd, i tak czyścimy lokalną
    // sesję niżej.
    await fetchRequest({ route: 'AUTH_LOGOUT', method: 'POST' });
    clearSession();
  };

  if (!user) {
    return (
      <Button type="link" href="/login" variant="tertiary" className="h-9 px-4 text-sm">
        Zaloguj się
      </Button>
    );
  }

  return (
    <div className={cn('flex gap-2 text-sm', stacked ? 'flex-col items-stretch' : 'items-center')}>
      <span className="flex min-w-0 items-center gap-2">
        <span className="truncate font-medium text-slate-800">{user.name}</span>
        {user.role === 'admin' ? (
          <span className="rounded-xs bg-navy px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">
            admin
          </span>
        ) : null}
      </span>
      <Button type="link" href="/profile" variant="secondary" className="h-9 px-4 text-sm">
        Profil
      </Button>
      <Button handleClick={handleLogout} variant="secondary" className="h-9 px-4 text-sm">
        Wyloguj
      </Button>
    </div>
  );
};
