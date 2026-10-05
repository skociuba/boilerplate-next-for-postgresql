import { CurrentUser, useAuthStore } from './authStore';

// Access token: trzymany W PAMIĘCI (zwykła zmienna modułowa), NIE
// w localStorage ani w Zustand store'ie. Zero trwałej persystencji = zero
// XSS-persystencji. Znika przy przeładowaniu strony — RequireAuth i cichy
// refresh (lib/api.ts) zawsze potrafią go odzyskać na nowo z automatu.
//
// Refresh token NIE jest tu w ogóle trzymany — leci jako httpOnly cookie
// (patrz backend), JS fizycznie nie ma do niego dostępu.
//
// Dane usera (kto jest zalogowany) żyją w lib/authStore.ts (Zustand +
// persist do localStorage) — reaktywny stan dla komponentów. Ten plik
// zajmuje się WYŁĄCZNIE akcjami: co się dzieje przy logowaniu/wylogowaniu.
let accessToken: string | null = null;

export const getAccessToken = (): string | null => accessToken;
export const setAccessToken = (token: string | null): void => {
  accessToken = token;
};

// Wywoływane po /auth/login i /auth/register.
export const setSession = ({
  accessToken: token,
  user
}: {
  accessToken: string;
  user: CurrentUser;
}) => {
  setAccessToken(token);
  useAuthStore.getState().setUser(user);
};

// Wywoływane przy wylogowaniu i gdy cichy refresh ostatecznie zawiedzie
// (refresh token też martwy — patrz lib/api.ts).
export const clearSession = () => {
  setAccessToken(null);
  useAuthStore.getState().setUser(null);
};
