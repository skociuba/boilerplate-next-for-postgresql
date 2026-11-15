'use client';
import dynamic from 'next/dynamic';

import { Layout } from '@/components/layout/Layout/Layout';
import { RequireAuth } from '@/components/layout/RequireAuth';

import { useAuthStore } from '@/lib/authStore';

import { useApiQuery } from '@/hooks/api/useApiQuery';

const PostsList = dynamic(
  () => import('@/components/features/Posts/PostsList/PostsList').then((m) => m.PostsList),
  {
    ssr: false
  }
);

const Page = () => {
  // USER_POSTS (GET /users/:id/posts), nie POSTS (GET /posts, wszystkie) —
  // "moje posty" to wybór KTÓRY endpoint front wywołuje, z ID zalogowanego
  // usera, a nie coś co JWT robi samo z siebie
  const user = useAuthStore((state) => state.user);
  const userId = user ? String(user.id) : '';
  const { data, refetch, isLoading, error } = useApiQuery({
    route: 'USER_POSTS',
    params: { userId },
    enabled: Boolean(userId)
  });

  return (
    <RequireAuth>
      <Layout
        {...{
          title: 'posts.title',
          breakpoints: [{ children: 'main', href: '/' }, { children: 'posts' }],
          hideOnMobile: { title: true, subTitle: true },
          loading: isLoading,
          error: error?.message
        }}
      >
        <PostsList data={data} refetch={refetch} />
      </Layout>
    </RequireAuth>
  );
};

export default Page;
