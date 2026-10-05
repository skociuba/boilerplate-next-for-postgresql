'use client';

import { useRouter } from '#/navigation';
import { useEffect, useState } from 'react';

import { useForm } from '@/ui/useForm';

import { fetchRequest } from '@/lib/api';
import { useAuthStore } from '@/lib/authStore';
import { setSession } from '@/lib/currentUser';

import { initialValues, loginValidationSchema, registerValidationSchema } from './pageModel';

export type AuthMode = 'login' | 'register';

export const usePage = () => {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const [mode, setMode] = useState<AuthMode>('login');
  const [error, setError] = useState('');

  // Zalogowany user, który trafi na /login (np. wpisze URL wprost) —
  // od razu z powrotem na stronę główną, nie ma tu dla niego nic do zrobienia
  useEffect(() => {
    if (user) {
      router.replace('/');
    }
  }, [user, router]);

  const form = useForm({
    initialValues,
    validationSchema: mode === 'login' ? loginValidationSchema : registerValidationSchema,
    onSubmit: async (values) => {
      setError('');

      // AUTH_LOGIN i AUTH_REGISTER zwracają dokładnie ten sam kształt:
      // { user, accessToken } — jeden handler wystarcza na oba tryby
      const result = await fetchRequest({
        route: mode === 'login' ? 'AUTH_LOGIN' : 'AUTH_REGISTER',
        method: 'POST',
        values: mode === 'login' ? { email: values.email, password: values.password } : values
      });

      if (result?.error) {
        setError(result.error);

        return;
      }

      setSession({ accessToken: result.accessToken, user: result.user });
      router.push('/');
    }
  });

  return { mode, setMode, form, error };
};
