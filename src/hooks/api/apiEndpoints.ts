export type ApiEndpointsType = {
  endpoint: string;
  method: ('GET' | 'POST' | 'PUT' | 'DELETE')[];
};

export type ApiKeysType = 'USERS' | 'USER' | 'USER_EDIT' | 'USER_ADD' | 'USER_DELETE';

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
  }
};
