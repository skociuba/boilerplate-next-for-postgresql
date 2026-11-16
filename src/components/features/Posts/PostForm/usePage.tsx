'use client';

import { FormProps, Tag } from '#/interfaces';
import { toast } from 'react-toastify';

import { useForm } from '@/ui/useForm';

import { useApiMutation } from '@/hooks/api/useApiMutation';

import { initialValues, postValidationSchema } from './pageModel';

export const usePage = ({ oldValues, handleSubmit, ...props }: FormProps) => {
  const { mutate } = useApiMutation(props);
  // druga, niezależna mutacja — ustawienie CAŁEGO zestawu tagów posta na
  // raz (PUT, idempotentne), osobne zapytanie HTTP względem title/content
  const { mutate: setTags } = useApiMutation({
    route: 'POST_TAGS_SET',
    method: 'PUT'
  });

  const { mutate: uploadImage } = useApiMutation({
    route: 'POST_IMAGE_UPLOAD',
    method: 'PUT',
    multipart: true
  });
  const { mutate: deleteImage } = useApiMutation({
    route: 'POST_IMAGE_DELETE',
    method: 'DELETE'
  });

  const originalTagNames = (oldValues?.tags ?? []).map((tag: Tag) => tag.name);

  const form = useForm({
    initialValues: {
      ...initialValues,
      ...oldValues,
      tag_names: originalTagNames
    },
    validationSchema: postValidationSchema,
    onSubmit: async (values) => {
      // tag_names leci osobnym zapytaniem (PUT /posts/:id/tags), nie jako
      // pole title/content posta
      const { tag_names: tagNames, image, remove_image: removeImage, ...sendValues } = values;

      // Ostatni krok łańcucha: zdjęcie potrzebuje id posta, więc idzie po
      // zapisie posta i tagów — tak samo przy tworzeniu i przy edycji.
      // Błąd uploadu zostawia post zapisany (toast pokazuje useApiMutation),
      // dlatego nie przechodzimy wtedy dalej na listę.
      const saveImage = (postId: string) => {
        if (image instanceof File) {
          uploadImage(
            { params: { postId }, image },
            {
              onSuccess: ({ error }) => {
                if (!error) {
                  handleSubmit(postId);

                  return;
                }
                toast(`Post zapisany, ale zdjęcie nie: ${error}`, {
                  position: 'bottom-left',
                  autoClose: 5000,
                  type: 'error',
                  theme: 'colored'
                });
              }
            }
          );
        } else if (removeImage && oldValues?.image_url) {
          deleteImage({ params: { postId } }, { onSuccess: () => handleSubmit(postId) });
        } else {
          handleSubmit(postId);
        }
      };

      mutate(sendValues, {
        onSuccess: ({ error, id }) => {
          if (error) return;

          // przy tworzeniu id przychodzi ze świeżo utworzonego posta,
          // przy edycji z odpowiedzi UPDATE (to samo, co oldValues.id)
          const postId = id ?? oldValues?.id;

          // zawsze wysyłamy cały zestaw — pusta tablica poprawnie czyści
          // wszystkie tagi, dokładnie jak odznaczenie wszystkich checkboxów
          setTags({ params: { postId }, names: tagNames }, { onSuccess: () => saveImage(postId) });
        }
      });
    }
  });

  return {
    form
  };
};
