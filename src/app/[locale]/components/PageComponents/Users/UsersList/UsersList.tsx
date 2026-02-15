'use client';

import { Button } from '../../../Button';
import { User } from './../../../../../../interfaces';
export const UsersList = ({ data }: { data: User[] }) => {
  return (
    <div className="ml-8 mt-24 min-h-screen">
      {data?.map((item: User) => (
        <div key={item.id} className="flex items-center justify-between mb-4">
          {item.name} - {item.email}
          <Button type="link" href={`/users/edit/${item.id}`}>
            edytuj
          </Button>
        </div>
      ))}
    </div>
  );
};
