'use client';

import { useEffect } from 'react';

import { useAuthStore } from '@/lib/authStore';

// Jedyne miejsce, które woła rehydrate() — robi to raz, po zamontowaniu
// (czyli na pewno po stronie klienta), żeby store odczytał zapisaną sesję
// z localStorage. Patrz authStore.ts (skipHydration) po wyjaśnienie, czemu
// to w ogóle jest potrzebne.
export const AuthHydration = () => {
  useEffect(() => {
    useAuthStore.persist.rehydrate();
  }, []);

  return null;
};
