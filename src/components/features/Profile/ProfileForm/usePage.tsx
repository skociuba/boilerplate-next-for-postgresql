'use client';

import { FormikValues } from 'formik';
import { toast } from 'react-toastify';

import { useForm } from '@/ui/useForm';

import { useAuthStore } from '@/lib/authStore';

import { useApiMutation } from '@/hooks/api/useApiMutation';

import { initialValues, profileValidationSchema } from './pageModel';

const notify = (message: string, type: 'success' | 'error') =>
  toast(message, { position: 'bottom-left', autoClose: 3000, type, theme: 'colored' });

export const usePage = ({
  oldValues,
  userId,
  onSaved
}: {
  oldValues?: FormikValues;
  userId: string;
  onSaved: () => void;
}) => {
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);

  const { mutate, isLoading } = useApiMutation({
    route: 'USER_PROFILE_SAVE',
    method: 'PUT'
  });

  const form = useForm({
    initialValues: { ...initialValues, ...oldValues },
    validationSchema: profileValidationSchema,
    onSubmit: (values) => {
      // params.userId podmienia {userId} w /users/{userId}/profile —
      // zawsze WŁASNE id, backend i tak by odrzucił cudze (403)
      mutate(
        { params: { userId }, ...values },
        {
          // profil to singleton (relacja 1:1), nie lista jak users/posts —
          // nie ma dokąd zrobić redirectu po zapisie, więc zamiast tego
          // dajemy potwierdzenie przez toast (i odświeżamy dane na miejscu)
          onSuccess: (data) => {
            if (data?.error) {
              notify(data.error, 'error');

              return;
            }
            // Nazwa w nawigacji pochodzi z authStore (localStorage), nie z
            // API — bez tego navbar pokazywałby stare imię do następnego
            // logowania.
            if (user && data?.name) setUser({ ...user, name: data.name });
            notify('Profil zapisany', 'success');
            onSaved();
          }
        }
      );
    }
  });

  return { form, isLoading };
};
