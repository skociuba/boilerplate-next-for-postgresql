import * as Yup from 'yup';

import { validationSchema, ValidationSchemaType } from '@/lib/utils/../validation';

// Bez user_id — autora ustala backend z req.currentUserId (zdekodowany
// JWT z nagłówka Authorization, patrz src/lib/currentUser.ts), nie z pola
// formularza.
// tag_names to tablica (relacja N:M, wielokrotny wybór) — wysyłana w
// jednym PUT /posts/:id/tags po zapisie title/content, patrz usePage.tsx.
// Te same granice co uploadPostImage w backendzie (lib/uploads.ts) — tutaj
// tylko dla szybkiego komunikatu, backend sprawdza to samo.
export const ALLOWED_IMAGE_TYPES = ['image/png', 'image/jpeg', 'image/webp'];
export const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

// image: nowy plik do wysłania (null = bez zmian), remove_image: user
// kliknął "Usuń zdjęcie" przy istniejącym. Oba lecą osobnymi zapytaniami
// po zapisie posta, nie w JSON-ie title/content.
export const postValidationSchema = Yup.object({
  title: validationSchema.global.string,
  content: Yup.string(),
  tag_names: Yup.array().of(Yup.string()),
  image: Yup.mixed<File>()
    .nullable()
    .test(
      'fileType',
      'Dozwolone formaty: PNG, JPEG, WebP',
      (file) => !file || ALLOWED_IMAGE_TYPES.includes(file.type)
    )
    .test(
      'fileSize',
      'Zdjęcie może mieć maksymalnie 5 MB',
      (file) => !file || file.size <= MAX_IMAGE_SIZE
    ),
  remove_image: Yup.boolean()
});

export const initialValues: ValidationSchemaType<typeof postValidationSchema> = {
  title: '',
  content: '',
  tag_names: [],
  image: null,
  remove_image: false
};
