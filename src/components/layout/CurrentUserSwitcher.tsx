'use client';

import { useEffect, useState } from 'react';

import { User } from '#/interfaces';

import { getCurrentUserId, setCurrentUserId } from '@/lib/currentUser';

import { Button } from '@/ui/Button';

import { useApiQuery } from '@/hooks/api/useApiQuery';

// TYMCZASOWY zamiennik ekranu logowania — patrz src/lib/currentUser.ts
// i backendowe src/middleware/currentUser.ts. Do zastąpienia prawdziwym
// /login, gdy dojdziemy do kroku "logowanie" w kursie.
export const CurrentUserSwitcher = () => {
  const { data: users } = useApiQuery({ route: 'USERS' });
  const [selected, setSelected] = useState<string>('');

  useEffect(() => {
    setSelected(getCurrentUserId() ?? '');
  }, []);

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setSelected(value);
    setCurrentUserId(value || null);
  };

  return (
    <div className="flex items-center gap-2 text-sm">
      <span className="text-gray-500">zalogowany jako:</span>
      <select
        value={selected}
        onChange={handleChange}
        className="h-9 rounded-xs border border-cloud px-2 outline-0 focus:border-navy"
      >
        <option value="">— niezalogowany —</option>
        {users?.map((user: User) => (
          <option key={user.id} value={user.id}>
            {user.name} (id: {user.id})
          </option>
        ))}
      </select>
      {selected ? (
        <Button type="link" href="/profile" variant="secondary" className="h-9">
          Profil
        </Button>
      ) : null}
    </div>
  );
};
