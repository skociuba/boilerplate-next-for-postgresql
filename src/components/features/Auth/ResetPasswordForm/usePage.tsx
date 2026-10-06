'use client';

import { useRouter } from '#/navigation';
import { useState } from 'react';
import { toast } from 'react-toastify';

import { useForm } from '@/ui/useForm';

import { fetchRequest } from '@/lib/api';

import { initialValues, resetPasswordValidationSchema } from './pageModel';

export const usePage = ({ token }: { token: string }) => {
  const router = useRouter();
  const [error, setError] = useState('');

  const form = useForm({
    initialValues,
    validationSchema: resetPasswordValidationSchema,
    onSubmit: async (values) => {
      setError('');

      const result = await fetchRequest({
        route: 'AUTH_RESET_PASSWORD',
        method: 'POST',
        values: { token, password: values.password }
      });

      if (result?.error) {
        setError(result.error);

        return;
      }

      // Backend unieważnił przy tej okazji WSZYSTKIE refresh tokeny (patrz
      // authController.resetPassword) — nawet gdybyśmy byli zalogowani w
      // tej karcie, sesja jest już martwa. Trzeba się zalogować od nowa.
      toast('Hasło zmienione — zaloguj się ponownie', {
        position: 'bottom-left',
        autoClose: 3000,
        type: 'success',
        theme: 'colored'
      });
      router.push('/login');
    }
  });

  return { form, error };
};
