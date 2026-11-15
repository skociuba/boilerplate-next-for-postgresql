import * as Yup from 'yup';

import { ValidationSchemaType } from '@/lib/utils/../validation';

// PESEL: sama forma (11 cyfr), bez prawdziwej sumy kontrolnej — to samo co
// CHECK w migracji user_profiles, tylko sprawdzone też po stronie klienta
export const profileValidationSchema = Yup.object({
  pesel: Yup.string()
    .matches(/^[0-9]{11}$/, 'PESEL musi mieć dokładnie 11 cyfr')
    .required('required'),
  date_of_birth: Yup.string().required('required'),
  phone: Yup.string()
});

export const initialValues: ValidationSchemaType<typeof profileValidationSchema> = {
  pesel: '',
  date_of_birth: '',
  phone: ''
};
