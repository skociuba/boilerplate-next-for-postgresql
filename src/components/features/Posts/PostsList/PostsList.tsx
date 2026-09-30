'use client';

import { useEffect, useState } from 'react';

import { Post, Posts } from '#/interfaces';

import { getCurrentUserId } from '@/lib/currentUser';

import { Button } from '@/ui/Button';

import { usePage } from './usePage';

export const PostsList = ({ data, refetch }: { data: Posts; refetch: () => void }) => {
  const { handleDelete } = usePage({ refetch });
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    setCurrentUserId(getCurrentUserId());
  }, []);

  return (
    <div className="ml-8 mt-12 min-h-screen">
      {currentUserId ? (
        <Button className="mb-12" variant="tertiary" type="link" href={`/posts/add`}>
          dodaj wpis
        </Button>
      ) : (
        <p className="mb-12 text-gray-500">
          Przeglądasz jako gość — zaloguj się (prawy górny róg), żeby pisać posty.
        </p>
      )}
      {data?.map((item: Post) => {
        // author_id z API to number, currentUserId z localStorage to string
        const isOwnPost = currentUserId !== null && currentUserId === String(item.author_id);

        return (
          <div key={item.id} className="flex items-center mb-4 border-b pb-2">
            <div className="flex-1">
              <div>
                <span className="font-bold">{item.title}</span>
                <span className="text-gray-500 ml-2">autor: {item.author_name}</span>
              </div>
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
            {isOwnPost ? (
              <div className="flex gap-2">
                <Button type="link" href={`/posts/edit/${item.id}`}>
                  edytuj
                </Button>
                <Button handleClick={() => handleDelete(item)}>usuń</Button>
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
};
