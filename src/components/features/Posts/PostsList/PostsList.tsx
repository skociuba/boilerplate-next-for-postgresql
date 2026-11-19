'use client';

import { Post, Posts } from '#/interfaces';

import { Button } from '@/ui/Button';

import { usePage } from './usePage';

// Dane tu to ZAWSZE własne posty zalogowanego usera (patrz posts/page.tsx —
// GET /users/:id/posts z ID z sesji), więc każdy wiersz i tak jest "Twój":
// bez porównywania author_id z currentUserId, bez etykiety autora, edytuj/usuń
// zawsze widoczne.
export const PostsList = ({ data, refetch }: { data: Posts; refetch: () => void }) => {
  const { handleDelete } = usePage({ refetch });

  return (
    <div>
      <Button className="mb-8" variant="tertiary" type="link" href={`/posts/add`}>
        dodaj wpis
      </Button>

      {data?.length === 0 ? (
        <p className="text-gray-500">Nie masz jeszcze żadnych postów.</p>
      ) : null}

      {data?.map((item: Post) => (
        // Na telefonie przyciski pod tytułem (flex-col), od sm obok — w jednym
        // rzędzie długi tytuł ściskał się do kilku liter albo wypychał
        // przyciski poza ekran. min-w-0 + wrap-break-word: tytuł bez spacji też
        // się zawinie, zamiast rozpychać wiersz.
        <div
          key={item.id}
          className="mb-4 flex flex-col gap-3 border-b pb-3 sm:flex-row sm:items-center"
        >
          <div className="min-w-0 flex-1">
            <span className="wrap-break-word font-bold">{item.title}</span>
            <div className="flex flex-wrap gap-1 mt-1">
              {item.tags?.length ? (
                item.tags.map((tag) => (
                  <span
                    key={tag.id}
                    className="rounded-xs border border-cloud px-2 py-0.5 text-xs text-gray-500"
                  >
                    {tag.name}
                  </span>
                ))
              ) : (
                <span className="text-xs text-gray-400">bez tagów</span>
              )}
            </div>
          </div>
          <div className="flex gap-2">
            <Button type="link" href={`/posts/edit/${item.id}`}>
              edytuj
            </Button>
            <Button handleClick={() => handleDelete(item)}>usuń</Button>
          </div>
        </div>
      ))}
    </div>
  );
};
