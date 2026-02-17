'use client';

import { useApiMutation } from '@/hooks/api/useApiMutation';
import { FormProps } from '#/interfaces';

import { useForm } from '@/components/ui/useForm';

import { exampleValidationSchema, initialValues } from './pageModel';
export const usePage = ({ oldValues, handleSubmit, ...props }: FormProps) => {
  const { mutate } = useApiMutation(props);

  const form = useForm({
    initialValues: { ...initialValues, ...oldValues },
    validationSchema: exampleValidationSchema,
    onSubmit: async (values) => {
      const sendValues = { ...values };
      mutate(
        {
          ...sendValues
        },
        {
          onSuccess: ({ error }) => {
            if (!error) {
              handleSubmit();
            }
          }
        }
      );
    }
  });

  return {
    form
  };
};
