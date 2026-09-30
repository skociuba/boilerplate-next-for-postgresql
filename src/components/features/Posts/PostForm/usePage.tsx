'use client';

import { FormProps, Tag } from '#/interfaces';

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
      const { tag_names: tagNames, ...sendValues } = values;

      mutate(sendValues, {
        onSuccess: ({ error, id }) => {
          if (error) return;

          // przy tworzeniu id przychodzi ze świeżo utworzonego posta,
          // przy edycji z odpowiedzi UPDATE (to samo, co oldValues.id)
          const postId = id ?? oldValues?.id;

          // zawsze wysyłamy cały zestaw — pusta tablica poprawnie czyści
          // wszystkie tagi, dokładnie jak odznaczenie wszystkich checkboxów
          setTags(
            { params: { postId }, names: tagNames },
            { onSuccess: () => handleSubmit(postId) }
          );
        }
      });
    }
  });

  return {
    form
  };
};
