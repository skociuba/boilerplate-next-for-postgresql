'use client';

import { User, Users } from '#/interfaces';

import { Button } from '@/ui/Button';

import { usePage } from './usePage';
export const UsersList = ({ data, refetch }: { data: Users; refetch: () => void }) => {
  const { handleDelete } = usePage({ refetch });

  return (
    <div>
      <Button className="mb-8" variant="tertiary" type="link" href={`/users/add`}>
        dodaj użytkownika
      </Button>
      {data?.map((item: User) => (
        // Ten sam układ co PostsList: na telefonie przyciski pod danymi.
        // break-all na emailu — adres nie ma spacji, więc bez tego jeden
        // długi email rozpychał stronę w poziomie.
        <div
          key={item.id}
          className="mb-4 flex flex-col gap-3 border-b pb-3 sm:flex-row sm:items-center"
        >
          <div className="min-w-0 flex-1">
            <span className="font-bold">{item.name}</span>
            <span className="ml-2 break-all text-gray-500">({item.email})</span>
            {item.role === 'admin' ? (
              <span className="ml-2 rounded-xs bg-black px-1.5 py-0.5 text-[10px] uppercase text-white">
                admin
              </span>
            ) : null}
          </div>
          <div className="flex gap-2">
            <Button type="link" href={`/users/edit/${item.id}`}>
              edytuj
            </Button>
            <Button handleClick={() => handleDelete(item)}>usuń</Button>
          </div>
        </div>
      ))}
    </div>
  );
};
