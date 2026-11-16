'use client';

import { FormProps } from '#/interfaces';

import { Button } from '@/ui/Button';
import { Form } from '@/ui/Form';
import Input from '@/ui/Input';
import Textarea from '@/ui/Textarea';

import { useAuthStore } from '@/lib/authStore';

import { TagsMultiSelect } from './TagsMultiSelect';
import { usePage } from './usePage';

export const PostForm = (props: FormProps) => {
  const { form } = usePage(props);
  const user = useAuthStore((state) => state.user);

  const isEdit = Boolean(props.oldValues?.id);
  // author_id z API przychodzi jako number, id z sesji jako number — mimo
  // to porównanie przez String(), żeby nie zależeć od tego, czy to dokładnie
  // ten sam typ po obu stronach (np. gdyby author_id kiedyś przyszło jako string)
  const isOwnPost = !isEdit || String(user?.id) === String(props.oldValues?.author_id);

  if (!isOwnPost) {
    return (
      <div className="text-gray-500">
        To nie jest Twój post — możesz edytować tylko własne wpisy.
      </div>
    );
  }

  return (
    // Boczny odstęp daje już Container z Layoutu — dawne ml-8 dokładało
    // margines tylko z lewej, więc na telefonie formularz był przesunięty
    // i ucięty z prawej. max-w-2xl: na desktopie pole nie ciągnie się
    // przez cały ekran, na mobilce i tak zajmuje 100% szerokości.
    <div className="w-full max-w-2xl">
      <Form {...{ form, className: 'flex flex-col gap-4' }}>
        <Input name="title" placeholder="title" />
        {/* textarea, nie input — treść posta to zwykle kilka zdań/akapitów */}
        <Textarea name="content" placeholder="content" rows={8} />
        {/* wielokrotny wybór — cały zestaw tagów posta w jednym miejscu,
            zarówno przy tworzeniu jak i edycji (patrz usePage.tsx: submit
            zawsze wysyła PEŁNĄ, aktualną listę do PUT /posts/:id/tags) */}
        <TagsMultiSelect />

        <div className="flex flex-wrap gap-4">
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
