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
    <div className="ml-8 mt-12 min-h-screen">
      <Button className="mb-12" variant="tertiary" type="link" href={`/posts/add`}>
        dodaj wpis
      </Button>

      {data?.length === 0 ? (
        <p className="text-gray-500">Nie masz jeszcze żadnych postów.</p>
      ) : null}

      {data?.map((item: Post) => (
        <div key={item.id} className="flex items-center mb-4 border-b pb-2">
          <div className="flex-1">
            <span className="font-bold">{item.title}</span>
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
