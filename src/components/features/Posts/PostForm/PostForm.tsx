'use client';

import { useEffect, useState } from 'react';

import { FormProps } from '#/interfaces';

import { getCurrentUserId } from '@/lib/currentUser';

import { Button } from '@/ui/Button';
import { Form } from '@/ui/Form';
import Input from '@/ui/Input';

import { TagsMultiSelect } from './TagsMultiSelect';
import { usePage } from './usePage';

export const PostForm = (props: FormProps) => {
  const { form } = usePage(props);
  const [currentUserId, setCurrentUserId] = useState<string | null>('');

  // sprawdzane po mount, bo localStorage nie istnieje przy SSR;
  // '' jako stan startowy odróżnia "jeszcze nie sprawdziłem" od "gość"
  useEffect(() => {
    setCurrentUserId(getCurrentUserId());
  }, []);

  const isEdit = Boolean(props.oldValues?.id);
  // author_id z API przychodzi jako number, currentUserId z localStorage
  // jako string — porównanie musi ujednolicić typy, inaczej zawsze false
  const isOwnPost = !isEdit || currentUserId === String(props.oldValues?.author_id);

  if (currentUserId === '') return null; // pierwszy render po SSR — bez migotania

  if (!currentUserId) {
    return (
      <div className="ml-8 mt-24 min-h-screen text-gray-500">
        Musisz być &quot;zalogowany&quot; (wybierz kogoś w prawym górnym rogu), żeby pisać albo
        edytować posty.
      </div>
    );
  }

  if (!isOwnPost) {
    return (
      <div className="ml-8 mt-24 min-h-screen text-gray-500">
        To nie jest Twój post — możesz edytować tylko własne wpisy.
      </div>
    );
  }

  return (
    <div className="ml-8 mt-24 min-h-screen">
      <Form {...{ form, className: 'flex flex-col gap-4' }}>
        <Input name="title" placeholder="title" />
        <Input name="content" placeholder="content" />
        {/* wielokrotny wybór — cały zestaw tagów posta w jednym miejscu,
            zarówno przy tworzeniu jak i edycji (patrz usePage.tsx: submit
            zawsze wysyła PEŁNĄ, aktualną listę do PUT /posts/:id/tags) */}
        <TagsMultiSelect />

        <div className="flex gap-4">
          <Button variant="tertiary" type="link" href={`/posts`}>
            Cancel
          </Button>
          <Button variant="primary" type="submit">
            Submit
          </Button>
        </div>
      </Form>
    </div>
  );
};
