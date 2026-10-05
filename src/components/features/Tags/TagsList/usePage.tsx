'use client';

import { toast } from 'react-toastify';

import { useForm } from '@/ui/useForm';

import { useApiMutation } from '@/hooks/api/useApiMutation';

import { addTagValidationSchema, initialValues } from './pageModel';

export const usePage = ({ refetch }: { refetch: () => void }) => {
  const { mutate: addMutate, isLoading: isAdding } = useApiMutation({
    route: 'TAG_ADD',
    method: 'POST'
  });

  const form = useForm({
    initialValues,
    validationSchema: addTagValidationSchema,
    clearForm: true,
    onSubmit: (values) => {
      // "sukces" mutacji w tym kliencie = zapytanie się wykonało, NIE że API
      // zwróciło 2xx — trzeba samemu sprawdzić error (np. 409 duplikat nazwy),
      // inaczej pole czyściłoby się nawet po nieudanym dodaniu
      addMutate(values, {
        onSuccess: ({ error }) => {
          if (error) {
            toast(error, {
              position: 'bottom-left',
              autoClose: 4000,
              type: 'error',
              theme: 'colored'
            });

            return;
          }
          toast('Tag dodany', {
            position: 'bottom-left',
            autoClose: 3000,
            type: 'success',
            theme: 'colored'
          });
          refetch();
        }
      });
    }
  });

  return { form, isAdding };
};
