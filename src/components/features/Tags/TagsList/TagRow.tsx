'use client';

import { Tag } from '#/interfaces';
import { useState } from 'react';
import * as Yup from 'yup';

import { Button } from '@/ui/Button';
import { Form } from '@/ui/Form';
import Input from '@/ui/Input';
import { useForm } from '@/ui/useForm';

import { validationSchema } from '@/lib/utils/../validation';

import { useApiMutation } from '@/hooks/api/useApiMutation';

const editTagValidationSchema = Yup.object({ name: validationSchema.global.string });

// Jeden wiersz = jeden niezależny mini-formularz Formik, odpalany dopiero
// gdy isEditing. useForm wywołane tu, wewnątrz KOMPONENTU (nie w pętli
// .map() nadrzędnego TagsList), więc zasady hooków są zachowane — każdy
// wiersz ma swój osobny stan formularza, nie jeden współdzielony na liście.
export const TagRow = ({ tag, refetch }: { tag: Tag; refetch: () => void }) => {
  const [isEditing, setIsEditing] = useState(false);
  const { mutate: editMutate } = useApiMutation({ route: 'TAG_EDIT', method: 'PUT' });
  const { mutate: deleteMutate } = useApiMutation({ route: 'TAG_DELETE', method: 'DELETE' });

  const form = useForm({
    initialValues: { name: tag.name ?? '' },
    validationSchema: editTagValidationSchema,
    onSubmit: (values) => {
      if (!tag?.id) return;

      editMutate(
        { id: tag.id, name: values.name },
        {
          onSuccess: () => {
            setIsEditing(false);
            refetch();
          }
        }
      );
    }
  });

  const handleDelete = () => {
    if (!tag?.id) return;
    deleteMutate({ id: tag.id }, { onSuccess: () => refetch() });
  };

  if (isEditing) {
    return (
      <Form form={form} className="mb-4 flex items-center gap-2 border-b pb-2">
        <div className="w-48">
          <Input name="name" />
        </div>
        <div className="flex gap-2">
          <Button type="submit">zapisz</Button>
          <Button type="button" handleClick={() => setIsEditing(false)}>
            anuluj
          </Button>
        </div>
      </Form>
    );
  }

  return (
    <div className="mb-4 flex items-center border-b pb-2">
      <div className="flex-1">
        <span className="font-bold">{tag.name}</span>
        <span className="ml-2 text-gray-500">
          {tag.posts_count} {tag.posts_count === 1 ? 'post' : 'postów'}
        </span>
      </div>
      <div className="flex gap-2">
        <Button handleClick={() => setIsEditing(true)}>edytuj</Button>
        <Button handleClick={handleDelete}>usuń</Button>
      </div>
    </div>
  );
};
