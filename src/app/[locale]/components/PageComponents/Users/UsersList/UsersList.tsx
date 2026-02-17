'use client';

import { User, Users } from '#/interfaces';

import { Button } from '@/components/Button';

import { usePage } from './usePage';
export const UsersList = ({ data, refetch }: { data: Users; refetch: () => void }) => {
  const { handleDelete } = usePage({ refetch });

  return (
    <div className="ml-8 mt-12 min-h-screen">
      <Button className="mb-12" variant="tertiary" type="link" href={`/users/add`}>
        dodaj
      </Button>
      {data?.map((item: User) => (
        <div key={item.id} className="flex items-center mb-4 border-b pb-2">
          <div className="flex-1">
            <span className="font-bold">{item.name}</span>
            <span className="text-gray-500 ml-2">({item.email})</span>
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
