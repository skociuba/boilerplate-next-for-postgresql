'use client';

import { useRouter } from '#/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

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

      // AUTH_LOGIN i AUTH_REGISTER NIE zwracają już tego samego kształtu —
      // rejestracja nie loguje od razu (patrz authController.register na
      // backendzie: konto czeka na potwierdzenie maila, login() dopiero
      // potem wpuszcza). AUTH_REGISTER wraca z { user, message }, bez tokenów.
      const result = await fetchRequest({
        route: mode === 'login' ? 'AUTH_LOGIN' : 'AUTH_REGISTER',
        method: 'POST',
        // Jawna lista pól zamiast całego `values` — confirmPassword jest
        // tylko do walidacji na froncie i nie ma po co lecieć do API.
        values:
          mode === 'login'
            ? { email: values.email, password: values.password }
            : { name: values.name, email: values.email, password: values.password }
      });

      if (result?.error) {
        setError(result.error);

        return;
      }

      if (mode === 'register') {
        toast(result.message || 'Konto utworzone — sprawdź maila, aby je aktywować.', {
          position: 'bottom-left',
          autoClose: 6000,
          type: 'success',
          theme: 'colored'
        });
        setMode('login');

        return;
      }

      setSession({ accessToken: result.accessToken, user: result.user });
      router.push('/');
    }
  });

  return { mode, setMode, form, error };
};
