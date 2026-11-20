import * as Sentry from '@sentry/nextjs';

import { sentryOptions } from './sentry.shared';

// Next.js woła register() raz przy starcie serwera — osobno dla runtime'u
// Node (strony, API) i edge (middleware z next-intl)
export function register() {
  Sentry.init(sentryOptions);
}

// Błędy rzucone przy renderowaniu na serwerze (server components, route
// handlers) — Next.js przekazuje je tutaj, zanim pokaże stronę błędu
export const onRequestError = Sentry.captureRequestError;
