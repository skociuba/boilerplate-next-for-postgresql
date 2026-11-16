import * as Yup from 'yup';

import { ValidationSchemaType } from '@/lib/utils/../validation';

// Te same reguły co profileSchema w backendzie (lib/profileValidation.ts) —
// tutaj tylko po to, żeby user zobaczył błąd od razu, bez wysyłania
// formularza. Granicą bezpieczeństwa i tak jest backend.
// Bez PESEL-u: aplikacja go nie potrzebuje, więc go nie zbiera.
export const profileValidationSchema = Yup.object({
  name: Yup.string().trim().max(255, 'maksymalnie 255 znaków').required('required'),
  date_of_birth: Yup.string().test(
    'not-in-future',
    'data nie może być z przyszłości',
    (value) => !value || new Date(value) <= new Date()
  ),
  phone: Yup.string().matches(/^\+?[0-9 ()-]{6,20}$/, {
    message: 'nieprawidłowy numer telefonu',
    excludeEmptyString: true
  })
});

export const initialValues: ValidationSchemaType<typeof profileValidationSchema> = {
  name: '',
  date_of_birth: '',
  phone: ''
};
