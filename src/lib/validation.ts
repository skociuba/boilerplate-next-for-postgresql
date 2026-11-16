import * as Yup from 'yup';

export type ValidationSchemaType<Y extends Yup.AnySchema> = Yup.InferType<Y>;

export const validationSchema = {
  global: {
    string: Yup.string().required('required'),
    required: Yup.string().required('required'),
    boolean: Yup.boolean().required('required'),
    number: Yup.number().min(0.01, 'min').required('required'),
    array: Yup.object()
  },
  // Te same reguły co registerSchema/resetPasswordSchema na backendzie
  // (authValidation.ts, min. 8 znaków). Backend i tak to sprawdza, ale bez
  // tego user dowiadywał się o regule dopiero po wysłaniu formularza.
  auth: {
    password: Yup.string().min(8, 'Hasło musi mieć minimum 8 znaków').required('required'),
    // Pole tylko na froncie — backend go nie dostaje. Chroni przed literówką
    // w haśle, którego user nie widzi (type="password").
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password')], 'Hasła nie są takie same')
      .required('required')
  }
};
