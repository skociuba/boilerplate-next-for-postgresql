export type ApiEndpointsType = {
  endpoint: string;
  method: ('GET' | 'POST' | 'PUT' | 'DELETE')[];
};

export type ApiKeysType =
  | 'USERS'
  | 'USER'
  | 'USER_EDIT'
  | 'USER_ADD'
  | 'USER_DELETE'
  | 'POSTS'
  | 'POST'
  | 'POST_ADD'
  | 'POST_EDIT'
  | 'POST_DELETE'
  | 'POST_TAGS_SET'
  | 'USER_POSTS'
  | 'TAGS'
  | 'TAG_ADD'
  | 'TAG_EDIT'
  | 'TAG_DELETE'
  | 'USER_PROFILE'
  | 'USER_PROFILE_SAVE'
  | 'USER_PROFILE_DELETE'
  | 'CHILDREN'
  | 'CHILD_ADD'
  | 'AUTH_REGISTER'
  | 'AUTH_LOGIN'
  | 'AUTH_REFRESH'
  | 'AUTH_LOGOUT'
  | 'AUTH_ME';

export const API_ENDPOINTS: { [key in ApiKeysType]: ApiEndpointsType } = {
  USERS: {
    endpoint: `/users`,
    method: ['GET']
  },
  USER: {
    endpoint: `/users`,
    method: ['GET']
  },
  USER_EDIT: {
    endpoint: `/users`,
    method: ['POST']
  },
  USER_ADD: {
    endpoint: `/users`,
    method: ['POST']
  },
  USER_DELETE: {
    endpoint: `/users`,
    method: ['DELETE']
  },
  POSTS: {
    endpoint: `/posts`,
    method: ['GET']
  },
  POST: {
    endpoint: `/posts`,
    method: ['GET']
  },
  POST_ADD: {
    endpoint: `/posts`,
    method: ['POST']
  },
  POST_EDIT: {
    endpoint: `/posts`,
    method: ['PUT']
  },
  POST_DELETE: {
    endpoint: `/posts`,
    method: ['DELETE']
  },
  // {postId} podmieniany przez fetchRequest z params —
  // patrz src/lib/api.ts:generateRequestUrl. Jeden PUT ustawiający cały
  // zestaw tagów naraz (pasuje do multi-selecta z checkboxami).
  POST_TAGS_SET: {
    endpoint: `/posts/{postId}/tags`,
    method: ['PUT']
  },
  // "moje posty" — {userId} zawsze podmieniane na ID ZALOGOWANEGO usera
  // (patrz posts/page.tsx), nigdy na cudze. Backend by nie zabronił
  // podejrzenia cudzych (lista postów jest publiczna) — to front decyduje,
  // czyje ID tu wstawić.
  USER_POSTS: {
    endpoint: `/users/{userId}/posts`,
    method: ['GET']
  },
  TAGS: {
    endpoint: `/tags`,
    method: ['GET']
  },
  TAG_EDIT: {
    endpoint: `/tags`,
    method: ['PUT']
  },
  TAG_ADD: {
    endpoint: `/tags`,
    method: ['POST']
  },
  TAG_DELETE: {
    endpoint: `/tags`,
    method: ['DELETE']
  },
  // {userId} podmieniany przez params — relacja 1:1, zawsze "mój" profil
  USER_PROFILE: {
    endpoint: `/users/{userId}/profile`,
    method: ['GET']
  },
  USER_PROFILE_SAVE: {
    endpoint: `/users/{userId}/profile`,
    method: ['PUT']
  },
  USER_PROFILE_DELETE: {
    endpoint: `/users/{userId}/profile`,
    method: ['DELETE']
  },
  // GET wspiera page/limit/sortBy/order/name/user_id/minAge/maxAge jako
  // query stringi (przez `values` w useApiQuery) — patrz childController.ts
  CHILDREN: {
    endpoint: `/children`,
    method: ['GET']
  },
  CHILD_ADD: {
    endpoint: `/children`,
    method: ['POST']
  },
  // Bez {userId}/{postId} w ścieżce — auth nie operuje na konkretnym
  // zasobie, tylko na "tym kim właśnie jesteś" (albo chcesz się stać)
  AUTH_REGISTER: {
    endpoint: `/auth/register`,
    method: ['POST']
  },
  AUTH_LOGIN: {
    endpoint: `/auth/login`,
    method: ['POST']
  },
  AUTH_REFRESH: {
    endpoint: `/auth/refresh`,
    method: ['POST']
  },
  AUTH_LOGOUT: {
    endpoint: `/auth/logout`,
    method: ['POST']
  },
  // "kim jestem" — prawdziwa weryfikacja sesji (patrz RequireAuth), nie
  // tylko odczyt z localStorage
  AUTH_ME: {
    endpoint: `/auth/me`,
    method: ['GET']
  }
};
