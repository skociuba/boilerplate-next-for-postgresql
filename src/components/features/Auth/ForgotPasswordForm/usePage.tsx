'use client';

import { useState } from 'react';

import { useForm } from '@/ui/useForm';

import { fetchRequest } from '@/lib/api';

import { forgotPasswordValidationSchema, initialValues } from './pageModel';

const DEFAULT_MESSAGE = 'Jeśli to konto istnieje, wysłaliśmy na nie link do resetu hasła.';

export const usePage = () => {
  const [message, setMessage] = useState('');

  const form = useForm({
    initialValues,
    validationSchema: forgotPasswordValidationSchema,
    onSubmit: async (values) => {
      // Backend ZAWSZE odpowiada sukcesem (patrz authController.forgotPassword
      // na backendzie — generyczna odpowiedź niezależnie od tego, czy email
      // istnieje, żeby nie dało się po odpowiedzi sprawdzać, które konta są
      // zarejestrowane). Front nie ma tu żadnej ścieżki błędu do obsłużenia.
      const result = await fetchRequest({
        route: 'AUTH_FORGOT_PASSWORD',
        method: 'POST',
        values
      });

      setMessage(result?.message || DEFAULT_MESSAGE);
    }
  });

  return { form, message };
};
