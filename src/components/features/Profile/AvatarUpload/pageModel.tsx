import * as Yup from 'yup';

import { ValidationSchemaType } from '@/lib/utils/../validation';

// Te same granice co lib/uploads.ts na backendzie (imageFileFilter, limits.fileSize)
// — walidacja tutaj jest wygodą dla użytkownika (szybki feedback, bez
// czekania na response), NIE jedynym miejscem, które o tym decyduje.
// Backend sprawdza to samo i odrzuci plik nawet gdyby ktoś obszedł front.
export const ALLOWED_AVATAR_TYPES = ['image/png', 'image/jpeg', 'image/webp'];
export const MAX_AVATAR_SIZE = 2 * 1024 * 1024;

export const avatarValidationSchema = Yup.object({
  avatar: Yup.mixed<File>()
    .required('required')
    .test(
      'fileType',
      'Dozwolone formaty: PNG, JPEG, WebP',
      (file) => !file || ALLOWED_AVATAR_TYPES.includes(file.type)
    )
    .test(
      'fileSize',
      'Plik może mieć maksymalnie 2 MB',
      (file) => !file || file.size <= MAX_AVATAR_SIZE
    )
});

export const initialValues: ValidationSchemaType<typeof avatarValidationSchema> = {
  avatar: null as unknown as File
};
