import * as Sentry from '@sentry/nextjs';

import { sentryOptions } from './sentry.shared';

// Next.js ładuje ten plik w przeglądarce przed resztą aplikacji
Sentry.init(sentryOptions);

// Hook nawigacji, którego plugin Sentry wymaga przy buildzie (bez niego
// wypisuje "ACTION REQUIRED"). Przy tracesSampleRate: 0 niczego nie mierzy.
export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
