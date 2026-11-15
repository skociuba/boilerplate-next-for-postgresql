import * as Yup from 'yup';

import { validationSchema, ValidationSchemaType } from '@/lib/utils/../validation';

export const forgotPasswordValidationSchema = Yup.object({
  email: validationSchema.global.string
});

export const initialValues: ValidationSchemaType<typeof forgotPasswordValidationSchema> = {
  email: ''
};
