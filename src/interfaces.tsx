import { FormikValues } from 'formik';

import { UseApiMutationProps } from './app/[locale]/hooks/api/useApiMutation';

export type User = {
  id?: string;
  name?: string;
  email?: string;
};

export type Users = User[];

export type FormProps = {
  oldValues?: FormikValues;
  handleSubmit: () => void;
  handleClose?: () => void;
} & UseApiMutationProps;
