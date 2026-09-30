'use client';

import { useEffect, useState } from 'react';

import { Tag, Tags } from '#/interfaces';

import { getCurrentUserId } from '@/lib/currentUser';

import { Button } from '@/ui/Button';

import { usePage } from './usePage';

export const TagsList = ({ data, refetch }: { data: Tags; refetch: () => void }) => {
  const {
    editingId,
    draftName,
    setDraftName,
    startEdit,
    cancelEdit,
    saveEdit,
    handleDelete,
    newTagName,
    setNewTagName,
    handleAdd,
    isAdding
  } = usePage({ refetch });
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsLoggedIn(Boolean(getCurrentUserId()));
  }, []);

  return (
    <div className="ml-8 mt-12 min-h-screen">
      <p className="mb-6 max-w-prose text-gray-500">
        Tagi to wspólny słownik (relacja N:M z postami) — edycja i usuwanie są dostępne dla{' '}
        <strong>każdego zalogowanego usera</strong>, nie tylko tego, kto je stworzył.
      </p>

      {isLoggedIn ? (
        <form onSubmit={handleAdd} className="mb-10 flex gap-2">
          <input
            value={newTagName}
            onChange={(event) => setNewTagName(event.target.value)}
            placeholder="nazwa nowego tagu"
            className="h-12 w-72 rounded-xs border border-cloud px-4 outline-0 focus:border-navy"
          />
          <Button type="submit" variant="tertiary" disabled={isAdding || !newTagName.trim()}>
            Dodaj tag
          </Button>
        </form>
      ) : (
        <p className="mb-10 text-gray-500">Zaloguj się, żeby dodawać i edytować tagi.</p>
      )}

      {data?.map((item: Tag) => (
        <div key={item.id} className="flex items-center mb-4 border-b pb-2">
          <div className="flex-1">
            {editingId === item.id ? (
              <input
                autoFocus
                value={draftName}
                onChange={(event) => setDraftName(event.target.value)}
                onKeyDown={(event) => event.key === 'Enter' && saveEdit(item.id as string)}
                className="h-10 rounded-xs border border-navy px-3 outline-0"
              />
            ) : (
              <>
                <span className="font-bold">{item.name}</span>
                <span className="text-gray-500 ml-2">
                  {item.posts_count} {item.posts_count === 1 ? 'post' : 'postów'}
                </span>
              </>
            )}
          </div>
          {isLoggedIn ? (
            <div className="flex gap-2">
              {editingId === item.id ? (
                <>
                  <Button handleClick={() => saveEdit(item.id as string)}>zapisz</Button>
                  <Button handleClick={cancelEdit}>anuluj</Button>
                </>
              ) : (
                <>
                  <Button handleClick={() => startEdit(item)}>edytuj</Button>
                  <Button handleClick={() => handleDelete(item)}>usuń</Button>
                </>
              )}
            </div>
          ) : null}
        </div>
      ))}
    </div>
  );
};
