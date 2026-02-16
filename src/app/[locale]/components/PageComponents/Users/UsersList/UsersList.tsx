'use client';

import { Button } from '../../../Button';
import { User } from './../../../../../../interfaces';
import { usePage } from './usePage';
export const UsersList = ({ data }: { data: User[] }) => {
  const { handleDelete } = usePage();

  return (
    <div className="ml-8 mt-24 min-h-screen">
      <Button variant="tertiary" type="link" href={`/users/add`}>
        dodaj
      </Button>
      {data?.map((item: User) => (
        <div key={item.id} className="flex items-center justify-between mb-4">
          {item.name} - {item.email}
          <Button type="link" href={`/users/edit/${item.id}`}>
            edytuj
          </Button>
          <Button handleClick={() => handleDelete(item?.id)}>usuń</Button>
        </div>
      ))}
    </div>
  );
};
