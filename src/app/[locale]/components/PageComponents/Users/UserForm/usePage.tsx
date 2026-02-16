'use client';

import { User } from '../../../../../../interfaces';
import { useApiMutation } from '../../../../hooks/api/useApiMutation';
import { useForm } from '../../../ui/useForm';
import { exampleValidationSchema, initialValues } from './pageModel';
export const usePage = ({
  oldValues,
  handleSubmit,
  ...props
}: {
  oldValues: User;
  handleSubmit: () => void;
  id: string;
}) => {
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
