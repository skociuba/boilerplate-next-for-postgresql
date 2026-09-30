// TYMCZASOWY zamiennik prawdziwego logowania (patrz backend:
// src/middleware/currentUser.ts). "Sesja" to po prostu id usera zapisane w
// localStorage przeglądarki — fetchRequest (src/lib/api.ts) dokleja je jako
// nagłówek x-user-id do każdego zapytania. Gdy pojawi się prawdziwe
// logowanie (JWT/sesja), ten plik znika, a jego miejsce zajmie coś, co
// czyta prawdziwy token — reszta kodu (komponenty, kontrolery) zostaje.

const STORAGE_KEY = 'x-user-id';

export const getCurrentUserId = (): string | null => {
  if (typeof window === 'undefined') return null;
  try {
    return window.localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
};

export const setCurrentUserId = (id: string | null) => {
  if (typeof window === 'undefined') return;
  try {
    if (id) {
      window.localStorage.setItem(STORAGE_KEY, id);
    } else {
      window.localStorage.removeItem(STORAGE_KEY);
    }
    window.dispatchEvent(new Event('currentUserChange'));
  } catch {
    // localStorage niedostępny (np. tryb prywatny) — po prostu nie "logujemy"
  }
};
