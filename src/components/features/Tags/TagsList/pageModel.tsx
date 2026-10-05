import * as Yup from 'yup';

import { validationSchema, ValidationSchemaType } from '@/lib/utils/../validation';

export const addTagValidationSchema = Yup.object({
  name: validationSchema.global.string
});

export const initialValues: ValidationSchemaType<typeof addTagValidationSchema> = {
  name: ''
};
