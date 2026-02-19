'use client';

import { User } from '#/interfaces';

import { useApiMutation } from '@/hooks/api/useApiMutation';
export const usePage = ({ refetch }: { refetch: () => void }) => {
  const { mutate } = useApiMutation({
    route: 'USER',
    method: 'DELETE'
  });

  const handleDelete = (user: User) => {
    if (!user?.id) return;
    mutate({ id: user?.id }, { onSuccess: () => refetch() });
  };

  return {
    handleDelete
  };
};
