'use client';

import { useRouter } from '#/navigation';
import { ReactNode, useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import { fetchRequest } from '@/lib/api';
import { useAuthStore } from '@/lib/authStore';
import { clearSession } from '@/lib/currentUser';

// Osłona tras. Dwuetapowa:
// 1) płytki check lokalny (store Zustand) — jeśli nawet w localStorage nie
//    ma zapisanej sesji, nie ma sensu strzelać do API. Czeka na
//    hasHydrated, bo store czyta localStorage asynchronicznie (patrz
//    authStore.ts) — bez tego potrafiłby na UŁAMEK sekundy "zobaczyć"
//    user === null i przekierować, zanim zdąży się dowiedzieć, że ktoś
//    jednak jest zalogowany.
// 2) GET /auth/me — PRAWDZIWA weryfikacja. fetchRequest ma już wbudowany
//    cichy refresh na 401 (lib/api.ts), więc jeśli access token akurat
//    wygasł, ten request sam się naprawi bez dodatkowego kodu tutaj.
//
// `adminOnly` dokłada trzeci, ODDZIELNY check: zalogowany, ale zła rola —
// to NIE jest "nie wiem kim jesteś" (login), tylko "wiem, ale nie wolno Ci"
// (autoryzacja) — dlatego przekierowanie leci na "/", nie na "/login".
//
// To nadal NIE jest granica bezpieczeństwa (middleware.js na Edge nie ma
// dostępu do localStorage/store'a) — backend i tak sprawdza to samo przy
// każdym żądaniu przez requireCurrentUser/requireAdmin. To tylko UX.
export const RequireAuth = ({
  children,
  adminOnly = false
}: {
  children: ReactNode;
  adminOnly?: boolean;
}) => {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const hasHydrated = useAuthStore((state) => state.hasHydrated);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (!hasHydrated) return;

    if (!user) {
      router.replace('/login');

      return;
    }

    if (adminOnly && user.role !== 'admin') {
      toast('Brak uprawnień — ta sekcja jest tylko dla administratorów.', {
        position: 'bottom-left',
        autoClose: 5000,
        type: 'error',
        theme: 'colored'
      });
      router.replace('/');

      return;
    }

    let cancelled = false;

    fetchRequest({ route: 'AUTH_ME', method: 'GET' }).then((result) => {
      if (cancelled) return;

      if (result?.error) {
        clearSession();
        router.replace('/login');

        return;
      }

      setChecked(true);
    });

    return () => {
      cancelled = true;
    };
  }, [hasHydrated, user, adminOnly, router]);

  if (!checked) return null;

  return <>{children}</>;
};
