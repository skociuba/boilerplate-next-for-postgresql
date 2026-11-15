import * as Yup from 'yup';

import { validationSchema, ValidationSchemaType } from '@/lib/utils/../validation';

// Dwie osobne schemy (login nie wymaga "name") zamiast jednej wspólnej —
// mode przełącza, którą z nich dostaje useForm (patrz usePage.tsx)
export const loginValidationSchema = Yup.object({
  email: validationSchema.global.string,
  password: validationSchema.global.string
});

export const registerValidationSchema = Yup.object({
  name: validationSchema.global.string,
  email: validationSchema.global.string,
  password: validationSchema.global.string
});

export const initialValues: ValidationSchemaType<typeof registerValidationSchema> = {
  name: '',
  email: '',
  password: ''
};
