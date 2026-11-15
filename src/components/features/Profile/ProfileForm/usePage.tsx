'use client';

import { FormikValues } from 'formik';
import { toast } from 'react-toastify';

import { useForm } from '@/ui/useForm';

import { useApiMutation } from '@/hooks/api/useApiMutation';

import { initialValues, profileValidationSchema } from './pageModel';

export const usePage = ({
  oldValues,
  userId,
  onSaved
}: {
  oldValues?: FormikValues;
  userId: string;
  onSaved: () => void;
}) => {
  const { mutate } = useApiMutation({
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
          onSuccess: ({ error }) => {
            if (!error) {
              toast('Profil zapisany', {
                position: 'bottom-left',
                autoClose: 3000,
                type: 'success',
                theme: 'colored'
              });
              onSaved();
            }
          }
        }
      );
    }
  });

  return { form };
};
