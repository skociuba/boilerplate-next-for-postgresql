'use client';

import * as Sentry from '@sentry/nextjs';
import { useEffect } from 'react';

// Ostatnia linia obrony: błąd w samym layoucie ([locale]/layout.tsx), gdzie
// [locale]/error.tsx już nie sięga. Zastępuje cały dokument, więc musi mieć
// własne <html>/<body> i nie ma tu providerów — ani tłumaczeń, ani
// Tailwinda z globals.css, stąd tekst po polsku i style inline.
export default function GlobalError({ error }: { error: Error & { digest?: string } }) {
  useEffect(() => {
    // jw. w [locale]/error.tsx: błąd z serwera (digest) jest już zgłoszony
    if (!error.digest) {
      Sentry.captureException(error);
    }
  }, [error]);

  return (
    <html lang="pl">
      <body
        style={{
          fontFamily: 'system-ui, sans-serif',
          textAlign: 'center',
          padding: '5rem 1.25rem'
        }}
      >
        <h1>Coś poszło nie tak</h1>
        <p>Wystąpił nieoczekiwany błąd. Odśwież stronę za chwilę.</p>
      </body>
    </html>
  );
}
