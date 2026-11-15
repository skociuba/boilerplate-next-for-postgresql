'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

import { fetchRequest } from '@/lib/api';

type Status = 'pending' | 'success' | 'error';

const MISSING_TOKEN_MESSAGE =
  'Brak tokena w linku — sprawdź, czy skopiowałeś/aś cały link z maila.';

export const usePage = () => {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const [status, setStatus] = useState<Status>(token ? 'pending' : 'error');
  const [message, setMessage] = useState(token ? '' : MISSING_TOKEN_MESSAGE);

  useEffect(() => {
    if (!token) return;

    fetchRequest({
      route: 'AUTH_VERIFY_EMAIL',
      method: 'POST',
      values: { token }
    }).then((result) => {
      if (result?.error) {
        setStatus('error');
        setMessage(result.error);

        return;
      }

      setStatus('success');
      setMessage(result?.message || 'Email potwierdzony');
    });
    // token z URL-a nie zmienia się w trakcie życia tej strony — ma
    // wystartować RAZ, przy wejściu (kliknięciu linku z maila), nie przy
    // każdym renderze
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { status, message };
};
