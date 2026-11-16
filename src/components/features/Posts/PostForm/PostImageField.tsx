'use client';

import { useFormikContext } from 'formik';
import { ImageIcon } from 'lucide-react';
import { useEffect, useMemo } from 'react';

import { Button } from '@/ui/Button';
import FileInput from '@/ui/FileInput';

import { getUploadUrl } from '@/lib/api';

import { ALLOWED_IMAGE_TYPES } from './pageModel';

type PostImageValues = {
  image: File | null;
  remove_image: boolean;
  image_url?: string | null;
};

// Zdjęcie posta w formularzu: podgląd + wybór/zmiana + usunięcie. Sam plik
// nie leci z title/content — usePage wysyła go osobnym PUT /posts/:id/image
// po zapisie posta (multipart, bo JSON nie przeniesie pliku).
export const PostImageField = () => {
  const { values, setFieldValue } = useFormikContext<PostImageValues>();

  // Nowo wybrany plik ma pierwszeństwo przed zapisanym na serwerze, żeby
  // było widać zmianę przed zapisem. URL.createObjectURL trzyma plik w
  // pamięci, dopóki się go nie zwolni — stąd revokeObjectURL niżej.
  const localUrl = useMemo(
    () => (values.image instanceof File ? URL.createObjectURL(values.image) : null),
    [values.image]
  );
  useEffect(() => () => (localUrl ? URL.revokeObjectURL(localUrl) : undefined), [localUrl]);

  const savedUrl = values.image_url && !values.remove_image ? getUploadUrl(values.image_url) : null;
  const previewUrl = localUrl ?? savedUrl;

  const removeImage = () => {
    setFieldValue('image', null);
    // remove_image tylko gdy coś jest zapisane — samo odrzucenie wybranego,
    // jeszcze niewysłanego pliku nie wymaga zapytania do API
    if (values.image_url) setFieldValue('remove_image', true);
  };

  return (
    <div className="flex flex-col gap-3">
      <span className="text-sm font-medium text-slate-700">Zdjęcie (opcjonalnie)</span>
      {previewUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={previewUrl}
          alt="Podgląd zdjęcia posta"
          className="aspect-video w-full rounded-xs border border-slate-200 bg-slate-50 object-cover"
        />
      ) : (
        <div className="flex aspect-video w-full flex-col items-center justify-center gap-2 rounded-xs border border-dashed border-slate-300 bg-slate-50 text-sm text-slate-500">
          <ImageIcon aria-hidden="true" className="h-8 w-8 text-slate-400" />
          PNG, JPEG albo WebP, do 5 MB
        </div>
      )}
      <div className="flex flex-wrap items-start gap-3">
        <FileInput
          name="image"
          label={previewUrl ? 'postImageChange' : 'postImage'}
          accept={ALLOWED_IMAGE_TYPES.join(',')}
        />
        {previewUrl ? (
          <Button
            type="button"
            variant="noStyling"
            handleClick={removeImage}
            className="h-12 px-4 text-sm text-error underline"
          >
            Usuń zdjęcie
          </Button>
        ) : null}
      </div>
    </div>
  );
};
