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
  | 'TAGS'
  | 'TAG_ADD'
  | 'TAG_EDIT'
  | 'TAG_DELETE'
  | 'USER_PROFILE'
  | 'USER_PROFILE_SAVE'
  | 'USER_PROFILE_DELETE';

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
  }
};
