'use client';

import { Button } from '@/ui/Button';

import { fetchRequest } from '@/lib/api';
import { useAuthStore } from '@/lib/authStore';
import { clearSession } from '@/lib/currentUser';

// Link do /login gdy nikt nie jest zalogowany, imię + wylogowanie gdy jest.
// Reaktywne przez useAuthStore — żadnego ręcznego nasłuchiwania na zmiany.
export const CurrentUserSwitcher = () => {
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
      <Button type="link" href="/login" variant="secondary" className="h-9">
        Zaloguj się
      </Button>
    );
  }

  return (
    <div className="flex items-center gap-2 text-sm">
      <span className="text-gray-500">zalogowany jako:</span>
      <span className="font-medium">{user.name}</span>
      {user.role === 'admin' ? (
        <span className="rounded-xs bg-black px-1.5 py-0.5 text-[10px] uppercase text-white">
          admin
        </span>
      ) : null}
      <Button type="link" href="/profile" variant="secondary" className="h-9">
        Profil
      </Button>
      <Button handleClick={handleLogout} variant="secondary" className="h-9">
        Wyloguj
      </Button>
    </div>
  );
};
