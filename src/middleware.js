import createMiddleware from 'next-intl/middleware';

import { locales, localePrefix } from './navigation';

export default createMiddleware({
  // A list of all locales that are supported
  locales,
  localePrefix,
  // Used when no locale matches
  defaultLocale: 'pl'
});

export const config = {
  // Ten matcher wyłapuje wszystko poza plikami statycznymi, api i _next
  matcher: [
    // Dopasuj wszystkie ścieżki, które powinny być zlokalizowane
    '/((?!api|_next|_vercel|.*\\..*).*)',
    // Opcjonalnie: dopasuj stronę główną
    '/'
  ]
};
