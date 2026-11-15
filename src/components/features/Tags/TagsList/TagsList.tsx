'use client';

import { Tags } from '#/interfaces';

import { Button } from '@/ui/Button';
import { Form } from '@/ui/Form';
import Input from '@/ui/Input';

import { TagRow } from './TagRow';
import { usePage } from './usePage';

// Strona /tags jest za RequireAuth, więc to, co tu renderujemy, zawsze
// dzieje się z sesją — nie trzeba już osobno sprawdzać "czy zalogowany".
export const TagsList = ({ data, refetch }: { data: Tags; refetch: () => void }) => {
  const { form, isAdding } = usePage({ refetch });

  return (
    <div className="ml-8 mt-12 min-h-screen">
      <p className="mb-6 max-w-prose text-gray-500">
        Tagi to wspólny słownik (relacja N:M z postami) — edycja i usuwanie są dostępne dla{' '}
        <strong>każdego zalogowanego usera</strong>, nie tylko tego, kto je stworzył.
      </p>

      <Form form={form} className="mb-10 flex items-start gap-2">
        <div className="w-72">
          <Input name="name" placeholder="newTagName" />
        </div>
        <Button type="submit" variant="tertiary" disabled={isAdding}>
          Dodaj tag
        </Button>
      </Form>

      {data?.map((tag) => <TagRow key={tag.id} tag={tag} refetch={refetch} />)}
    </div>
  );
};
