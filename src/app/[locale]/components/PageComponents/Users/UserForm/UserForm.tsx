'use client';

import { User } from '../../../../../../interfaces';
import { Button } from '../../../Button';

export const UserForm = ({ data }: { data: User }) => {
  return (
    <div className="ml-8 mt-24 min-h-screen">
      {data && (
        <div key={data.id} className="flex items-center justify-between mb-4">
          {data.name} - {data.email}
          <Button type="link" href={`/users`}>
            wróć
          </Button>
        </div>
      )}
    </div>
  );
};
