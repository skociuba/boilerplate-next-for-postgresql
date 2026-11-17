import { createNavigation } from 'next-intl/navigation';
import { defineRouting } from 'next-intl/routing';

// Jedno miejsce z konfiguracją języków (next-intl 4): czyta je middleware,
// nawigacja i getRequestConfig, więc lista locale nie rozjedzie się
// między plikami.
export const routing = defineRouting({
  locales: ['pl', 'en'],
  defaultLocale: 'pl',
  localePrefix: 'as-needed',
  localeDetection: false
});

export const { locales, localePrefix } = routing;

export const { Link, redirect, usePathname, useRouter } = createNavigation(routing);
