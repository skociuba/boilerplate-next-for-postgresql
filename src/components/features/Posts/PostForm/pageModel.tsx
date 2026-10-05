import * as Yup from 'yup';

import { validationSchema, ValidationSchemaType } from '@/lib/utils/../validation';

// Bez user_id — autora ustala backend z req.currentUserId (zdekodowany
// JWT z nagłówka Authorization, patrz src/lib/currentUser.ts), nie z pola
// formularza.
// tag_names to tablica (relacja N:M, wielokrotny wybór) — wysyłana w
// jednym PUT /posts/:id/tags po zapisie title/content, patrz usePage.tsx.
export const postValidationSchema = Yup.object({
  title: validationSchema.global.string,
  content: Yup.string(),
  tag_names: Yup.array().of(Yup.string())
});

export const initialValues: ValidationSchemaType<typeof postValidationSchema> = {
  title: '',
  content: '',
  tag_names: []
};
