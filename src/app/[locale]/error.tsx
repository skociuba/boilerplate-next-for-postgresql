'use client';

import * as Sentry from '@sentry/nextjs';
import { useTranslations } from 'next-intl';
import { useEffect } from 'react';

import { Button } from '@/ui/Button';

type ErrorPageProps = { error: Error & { digest?: string }; reset: () => void };

// Granica błędu dla wszystkich stron: wyjątek rzucony w komponencie
// kończył się wcześniej białą stroną bez żadnego śladu. Teraz użytkownik
// widzi komunikat (navbar i stopka zostają, bo to plik wewnątrz layoutu),
// a błąd trafia do Sentry. reset() renderuje stronę jeszcze raz — pomaga,
// gdy błąd był chwilowy (np. zerwane połączenie).
export default function ErrorPage({ error, reset }: ErrorPageProps) {
  const t = useTranslations('Error');

  useEffect(() => {
    // Błąd z serwera ma digest i został już zgłoszony przez onRequestError
    // (instrumentation.ts) z pełną treścią — przeglądarka dostaje tylko
    // ogólny komunikat, więc drugie zgłoszenie byłoby duplikatem
    if (!error.digest) {
      Sentry.captureException(error);
    }
  }, [error]);

  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-4 px-5 py-20 text-center">
      <h1 className="text-2xl font-bold text-slate-900">{t('title')}</h1>
      <p className="text-slate-600">{t('content')}</p>
      <Button variant="tertiary" handleClick={() => reset()}>
        {t('retry')}
      </Button>
    </div>
  );
}
