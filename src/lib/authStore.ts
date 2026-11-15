import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

// Reaktywny stan "kto jest zalogowany" — zastępuje ręcznie pisany event-bus
// (window.dispatchEvent(new Event('currentUserChange')) + addEventListener
// w trzech różnych komponentach). Komponenty po prostu subskrybują
// useAuthStore(s => s.user) i re-renderują się same przy zmianie.
//
// Tylko dane usera (id/name/email) — bez wartości bezpieczeństwa same
// w sobie, więc bezpiecznie trzymać w store'ie widocznym w devtoolsach
// Zustand i zserializowanym do localStorage.
//
// Access token CELOWO zostaje POZA tym store'em — patrz lib/currentUser.ts.
// Zustand z `persist` domyślnie pisze cały stan do localStorage; token
// musiałby być z tego jawnie wykluczany (partialize), więc prościej i
// bezpieczniej w ogóle go tu nie wpuszczać, niż pilnować wykluczenia.
export type CurrentUser = { id: number; name: string; email: string; role: 'user' | 'admin' };

type AuthState = {
  user: CurrentUser | null;
  // Next.js renderuje konsumentów tego store'a (Navbar, RequireAuth...)
  // też na serwerze, gdzie localStorage nie istnieje — stąd skipHydration
  // niżej i ten flag: dopóki false, store nie zdążył jeszcze odczytać
  // zapisanej sesji, więc żaden komponent (zwłaszcza RequireAuth) nie
  // powinien na tej podstawie podejmować decyzji (np. przekierować na
  // /login, bo "user === null", choć w localStorage ktoś jednak jest).
  hasHydrated: boolean;
  setUser: (user: CurrentUser | null) => void;
  setHasHydrated: (value: boolean) => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      hasHydrated: false,
      setUser: (user) => set({ user }),
      setHasHydrated: (value) => set({ hasHydrated: value })
    }),
    {
      name: 'current_user',
      storage: createJSONStorage(() => localStorage),
      // Wyłącza automatyczny odczyt przy starcie store'a (który próbowałby
      // odwołać się do localStorage także podczas SSR). Zamiast tego
      // AuthHydration (providers/AuthHydration.tsx) woła rehydrate()
      // jawnie, w efekcie — czyli wyłącznie po stronie klienta.
      skipHydration: true,
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      }
    }
  )
);
