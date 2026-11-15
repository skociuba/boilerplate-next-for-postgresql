import * as Yup from 'yup';

import { validationSchema, ValidationSchemaType } from '@/lib/utils/../validation';
export const exampleValidationSchema = Yup.object({
  name: validationSchema.global.string,
  email: validationSchema.global.string,
  role: Yup.string().oneOf(['user', 'admin']).required('required')
});

export const initialValues: ValidationSchemaType<typeof exampleValidationSchema> = {
  name: '',
  email: '',
  role: 'user'
};
