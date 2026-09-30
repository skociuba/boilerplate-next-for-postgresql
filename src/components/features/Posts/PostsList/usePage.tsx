'use client';

import { Post } from '#/interfaces';

import { useApiMutation } from '@/hooks/api/useApiMutation';

export const usePage = ({ refetch }: { refetch: () => void }) => {
  const { mutate } = useApiMutation({
    route: 'POST_DELETE',
    method: 'DELETE'
  });

  const handleDelete = (post: Post) => {
    if (!post?.id) return;
    mutate({ id: post?.id }, { onSuccess: () => refetch() });
  };

  return {
    handleDelete
  };
};
