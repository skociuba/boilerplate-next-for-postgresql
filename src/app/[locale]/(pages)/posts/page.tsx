'use client';
import dynamic from 'next/dynamic';

import { Layout } from '@/components/layout/Layout/Layout';

import { useApiQuery } from '@/hooks/api/useApiQuery';

const PostsList = dynamic(
  () => import('@/components/features/Posts/PostsList/PostsList').then((m) => m.PostsList),
  {
    ssr: false
  }
);

const Page = () => {
  const { data, refetch, isLoading, error } = useApiQuery({
    route: 'POSTS'
  });

  return (
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
  );
};

export default Page;
