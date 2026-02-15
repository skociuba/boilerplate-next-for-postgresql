export type ApiEndpointsType = {
  endpoint: string;
  method: ('GET' | 'POST' | 'PUT' | 'DELETE')[];
};

export type ApiKeysType = 'USERS' | 'USER';

export const API_ENDPOINTS: { [key in ApiKeysType]: ApiEndpointsType } = {
  USERS: {
    endpoint: `/users`,
    method: ['GET']
  },
  USER: {
    endpoint: `/users`,
    method: ['GET']
  }
};
