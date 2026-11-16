import * as Yup from 'yup';

import { validationSchema, ValidationSchemaType } from '@/lib/utils/../validation';

export const resetPasswordValidationSchema = Yup.object({
  password: validationSchema.auth.password,
  confirmPassword: validationSchema.auth.confirmPassword
});

export const initialValues: ValidationSchemaType<typeof resetPasswordValidationSchema> = {
  password: '',
  confirmPassword: ''
};
