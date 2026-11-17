import { hasLocale } from 'next-intl';
import { getRequestConfig } from 'next-intl/server';

import { routing } from './navigation';

// next-intl 4: locale przychodzi jako Promise (requestLocale), a nie gotowy
// string — w Next 15 parametry trasy są asynchroniczne. Nieznany locale
// spada tu na domyślny; 404 dla złego segmentu [locale] robi layout.
export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested) ? requested : routing.defaultLocale;

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default
  };
});
