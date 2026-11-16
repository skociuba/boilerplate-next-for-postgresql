'use client';

import { Link } from '#/navigation';
import { useEffect, useState } from 'react';

import { Button } from '@/ui/Button';

export const COOKIE_NOTICE_KEY = 'cookie_notice_ack';

// Informacja, nie zgoda. Aplikacja zapisuje w przeglądarce wyłącznie to, bez
// czego logowanie nie działa (cookie z refresh tokenem, dane zalogowanego
// usera w localStorage) — na takie pliki przepisy nie wymagają zgody, tylko
// poinformowania. Baner z przyciskami "akceptuj/odrzuć" sugerowałby, że jest
// analityka czy reklamy, których tu nie ma. Gdyby kiedyś doszła analityka,
// to MUSI się zmienić w prawdziwą zgodę (domyślnie wyłączoną).
export const CookieNotice = () => {
  // false do czasu odczytu localStorage po stronie klienta — na serwerze
  // localStorage nie istnieje, a renderowanie banera "na ślepo" migałoby
  // każdemu, kto już go zamknął.
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      setVisible(localStorage.getItem(COOKIE_NOTICE_KEY) !== '1');
    } catch {
      setVisible(true);
    }
  }, []);

  if (!visible) return null;

  const dismiss = () => {
    try {
      localStorage.setItem(COOKIE_NOTICE_KEY, '1');
    } catch {
      // tryb prywatny / zablokowany storage — baner po prostu wróci przy
      // następnej wizycie, nic więcej się nie psuje
    }
    setVisible(false);
  };

  return (
    <>
      {/* Odstęp w normalnym przepływie strony: baner jest fixed, więc bez
          niego zasłaniałby stopkę i paginację, do których nie dałoby się
          doscrollować, dopóki ktoś go nie zamknie. */}
      <div aria-hidden="true" className="h-40 sm:h-28" />
      <div
        role="region"
        aria-label="Informacja o plikach cookie"
        className="fixed inset-x-0 bottom-0 z-40 p-3 sm:p-4"
      >
        <div className="mx-auto flex max-w-screen-md flex-col gap-3 rounded-xs border border-slate-200 bg-white p-4 text-sm text-slate-700 shadow-lg sm:flex-row sm:items-center sm:gap-6">
          <p className="flex-1">
            Używamy wyłącznie niezbędnych plików cookie i pamięci przeglądarki, żeby utrzymać Twoją
            sesję po zalogowaniu. Bez analityki i reklam.{' '}
            <Link href="/privacy" className="font-medium text-navy underline">
              Szczegóły
            </Link>
          </p>
          <Button handleClick={dismiss} variant="tertiary" className="h-10 shrink-0 px-5 text-sm">
            Rozumiem
          </Button>
        </div>
      </div>
    </>
  );
};
