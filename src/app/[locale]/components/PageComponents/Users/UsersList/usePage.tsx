'use client';

import { useApiMutation } from '../../../../hooks/api/useApiMutation';

export const usePage = () => {
  const { mutate } = useApiMutation({
    route: 'USER',
    method: 'DELETE'
  });

  const handleDelete = (id: string) => {
    mutate({ id: id });
  };

  return {
    handleDelete
  };
};
