import * as Yup from 'yup';

import { ValidationSchemaType } from '@/lib/utils/../validation';

// Te same granice co lib/uploads.ts na backendzie (documentFileFilter,
// limits.fileSize) — patrz analogiczny komentarz w AvatarUpload/pageModel.tsx.
export const ALLOWED_DOCUMENT_TYPES = ['application/pdf', 'text/html'];
export const MAX_DOCUMENT_SIZE = 5 * 1024 * 1024;

export const documentValidationSchema = Yup.object({
  document: Yup.mixed<File>()
    .required('required')
    .test(
      'fileType',
      'Dozwolone formaty: PDF, HTML',
      (file) => !file || ALLOWED_DOCUMENT_TYPES.includes(file.type)
    )
    .test(
      'fileSize',
      'Plik może mieć maksymalnie 5 MB',
      (file) => !file || file.size <= MAX_DOCUMENT_SIZE
    )
});

export const initialValues: ValidationSchemaType<typeof documentValidationSchema> = {
  document: null as unknown as File
};
