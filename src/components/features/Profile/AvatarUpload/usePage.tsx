'use client';

import { toast } from 'react-toastify';

import { useForm } from '@/ui/useForm';

import { useApiMutation } from '@/hooks/api/useApiMutation';

import { avatarValidationSchema, initialValues } from './pageModel';

export const usePage = ({ userId, onSaved }: { userId: string; onSaved: () => void }) => {
  const { mutate, isLoading } = useApiMutation({
    route: 'USER_PROFILE_AVATAR_UPLOAD',
    method: 'PUT',
    multipart: true
  });

  const form = useForm({
    initialValues,
    validationSchema: avatarValidationSchema,
    clearForm: true,
    onSubmit: (values) => {
      mutate(
        { params: { userId }, ...values },
        {
          onSuccess: ({ error }) => {
            if (error) return;
            toast('Avatar zapisany', {
              position: 'bottom-left',
              autoClose: 3000,
              type: 'success',
              theme: 'colored'
            });
            onSaved();
          }
        }
      );
    }
  });

  return { form, isLoading };
};
