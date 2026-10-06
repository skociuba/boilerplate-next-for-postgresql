import * as Yup from 'yup';

import { validationSchema, ValidationSchemaType } from '@/lib/utils/../validation';

export const resetPasswordValidationSchema = Yup.object({
  password: validationSchema.global.string
});

export const initialValues: ValidationSchemaType<typeof resetPasswordValidationSchema> = {
  password: ''
};
