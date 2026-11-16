// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import qs from 'qs';

import { clearSession, getAccessToken, setAccessToken } from '@/lib/currentUser';

import { API_ENDPOINTS, ApiKeysType } from '@/hooks/api/apiEndpoints';

type fetchRequestProps = {
  route: ApiKeysType;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  getFile?: boolean;
  refresh?: boolean;
  multipart?: boolean;
  id?: string;
  params?: { [key: string]: string };
  values?: {
    [key: string]:
      | string
      | number
      | boolean
      | File
      | null
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      | { [key: string]: any }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      | { [key: string]: any }[];
  };
};

export interface PaginatedResponse<T> {
  items: T[];
  pagination: {
    current: number;
    from: number;
    last: number;
    to: number;
    total: number;
  };
}

export type Without<T, K> = Pick<T, Exclude<keyof T, K>>;

const API_BASE = `${process.env.NEXT_PUBLIC_BASE_PATH || ''}/api-proxy`;

// avatar_path z profilu to ścieżka NA BACKENDZIE (np. "/uploads/avatars/xxx.png"),
// serwowana tam statycznie, bez autoryzacji (patrz index.ts backendu). Przez
// /api-proxy leci przez ten sam rewrite co reszta API, więc nie trzeba
// osobnego CORS-a — przeglądarka widzi to jako jeden origin.
export const getUploadUrl = (uploadPath: string): string => `${API_BASE}${uploadPath}`;

const generateRequestUrl = ({
  route,
  method,
  values,
  id,
  params
}: Without<fetchRequestProps, 'token'>) => {
  const activeParams = params ? Object.keys(params) : [];
  const activeId = id || (!activeParams.includes('id') ? values?.id : null);
  let url = `${API_BASE}${API_ENDPOINTS[route].endpoint}${activeId ? `/${activeId}` : ''}`;

  if (params || values?.params) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let allParams: { [key: string]: any } = {};

    if (params) {
      allParams = { ...params };
    }

    if (values?.params && typeof values?.params === 'object') {
      allParams = { ...allParams, ...values.params };
    }

    Object.entries(allParams).forEach(([key, value]) => {
      url = url.replace(`{${key}}`, value);
    });
  }

  if (!values) {
    return url;
  }

  switch (method) {
    case 'GET':
      return (
        url +
        qs.stringify(values, {
          arrayFormat: 'indices',
          skipNulls: true,
          addQueryPrefix: true,
          encode: true,
          strictNullHandling: true,
          allowEmptyArrays: false,
          filter: (_prefix, value) => {
            if (value === '') {
              return undefined;
            }

            return value;
          },
          encoder: (value, type) => {
            if (type === 'key') {
              return value;
            }

            return encodeURIComponent(value);
          }
        })
      );
    default:
      return url;
  }
};

const generateFormData = ({ values }: Pick<fetchRequestProps, 'values'>) => {
  const form = new FormData();

  if (!values) {
    return form;
  }

  for (const [key, value] of Object.entries(values)) {
    if (value === '' || !value) {
      continue;
    }

    if (Array.isArray(value)) {
      value.map((item, index) => {
        if (typeof item === 'object' && item !== null && !(item instanceof File)) {
          for (const [itemKey, itemValue] of Object.entries(item)) {
            if (Array.isArray(itemValue)) {
              if (itemValue?.length) {
                for (const itemArrayValue of itemValue) {
                  form.append(
                    `${key.replaceAll('_', '.')}[${index}][${itemKey}][]`,
                    itemArrayValue.toString()
                  );
                }
              }
            } else if (typeof itemValue !== 'undefined') {
              form.append(
                `${key.replaceAll('_', '.')}[${index}][${itemKey}]`,
                null === itemValue
                  ? ''
                  : itemValue instanceof File
                    ? itemValue
                    : itemValue
                      ? itemValue.toString()
                      : ''
              );
            }
          }
        } else {
          form.append(`${key.replaceAll('_', '.')}[]`, item);
        }
      });
    } else {
      form.append(
        key.replaceAll('_', '.'),
        null === value ? '' : value instanceof File ? value : value.toString()
      );
    }
  }

  return form;
};

// Endpointy logowania NIE dostają Authorization (na /auth/login jeszcze go
// nie masz) i NIE wywołują cichego refreshu na 401 — 401 z /auth/login
// znaczy "złe hasło", nie "token wygasł".
const AUTH_ROUTES: ApiKeysType[] = ['AUTH_LOGIN', 'AUTH_REGISTER', 'AUTH_REFRESH'];

// Kilka równoległych zapytań może dostać 401 w tym samym momencie (np.
// strona odpala naraz 3 fetch-e tuż po wygaśnięciu/braku access tokenu —
// w pamięci, więc też zaraz po przeładowaniu strony). Bez tej zmiennej
// każde z nich odpaliłoby OSOBNE /auth/refresh — a backend ROTUJE refresh
// token przy każdym wywołaniu, więc druga i trzecia próba dostałaby już
// zużyty (odrzucony) token. Trzymając jeden wspólny Promise, wszystkie
// równoległe 401-ki czekają na TEN SAM wynik odnowienia.
let refreshPromise: Promise<string | null> | null = null;

const refreshAccessToken = (): Promise<string | null> => {
  // BEZ body — refresh token leci sam, jako httpOnly cookie (credentials:
  // 'include' niżej). JS po stronie klienta nie ma go i nie musi mieć.
  if (!refreshPromise) {
    refreshPromise = fetch(`${API_BASE}${API_ENDPOINTS.AUTH_REFRESH.endpoint}`, {
      method: 'POST',
      credentials: 'include'
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!data) {
          // refresh token martwy (wygasł/wylogowano gdzie indziej/już
          // zrotowany) — nie ma jak dalej trzymać "sesji", czyścimy ją
          clearSession();

          return null;
        }
        setAccessToken(data.accessToken);

        return data.accessToken as string;
      })
      .catch(() => {
        clearSession();

        return null;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }

  return refreshPromise;
};

export const fetchRequest = async ({
  route,
  method,
  values,
  id,
  params,
  getFile,
  multipart = false
}: fetchRequestProps) => {
  try {
    const isAuthRoute = AUTH_ROUTES.includes(route);
    const url = generateRequestUrl({ route, id, method, values, params, multipart });

    // Funkcja, nie stała — wywoływana DWA razy przy retry po cichym
    // refreshu, za każdym razem czyta accessToken na nowo (za pierwszym
    // razem stary/wygasły/brak, za drugim — świeżo odnowiony).
    const buildOptions = () => ({
      method,
      // 'include' — żeby refresh token (httpOnly cookie) w ogóle dojechał
      // do /auth/refresh i /auth/logout. Na resztę endpointów przeglądarka
      // i tak by go dorzuciła (ten sam origin przez /api-proxy), ale jawne
      // 'include' nie zależy od tego, czy ktoś kiedyś zmieni architekturę
      // na prawdziwie cross-origin.
      credentials: 'include' as const,
      headers: {
        Accept: 'application/json',
        ...(multipart ? {} : { 'Content-Type': 'application/json' }),
        ...(!isAuthRoute && getAccessToken() ? { Authorization: `Bearer ${getAccessToken()}` } : {})
      },
      body:
        method === 'GET' ? null : multipart ? generateFormData({ values }) : JSON.stringify(values)
    });

    let res = await fetch(url, buildOptions());

    if (res.status === 401 && !isAuthRoute) {
      const newAccessToken = await refreshAccessToken();
      if (newAccessToken) {
        res = await fetch(url, buildOptions());
      }
    }

    const { status } = res;

    // res.ok == status w 200-299 — NIE tylko dokładnie 200. Endpointy
    // tworzące zasób (POST /posts, POST /tags) poprawnie zwracają 201,
    // a to wcześniej traktowało 201 jak błąd (i próbowało odczytać
    // nieistniejące data.message, co samo w sobie rzucało wyjątkiem).
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      const { message, data, errors } = body;
      // Backend (errorHandler.ts) zwraca { error, details? }, nie { message }
      // — bez tego każdy błąd z API, także "hasło musi mieć minimum 8
      // znaków", kończył się ogólnym "Something went wrong". details to
      // fieldErrors z zoda ({ pole: [komunikaty] }); pierwszy konkretny
      // komunikat mówi userowi więcej niż ogólne "Nieprawidłowe dane".
      const firstDetail = body.details
        ? (Object.values(body.details).flat()[0] as string | undefined)
        : undefined;

      return {
        error:
          firstDetail ||
          body.error ||
          message ||
          data?.message ||
          'Something went wrong during fetching!',
        errors: errors || [],
        status
      };
    } else if (getFile) {
      return { data: await res.blob(), status };
    } else {
      return await res.json();
    }
  } catch {
    return { error: 'Something went wrong during fetching!' };
  }
};
