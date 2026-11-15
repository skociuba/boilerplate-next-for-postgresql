'use client';
import dynamic from 'next/dynamic';

import { Layout } from '@/components/layout/Layout/Layout';
import { RequireAuth } from '@/components/layout/RequireAuth';

import { useApiQuery } from '@/hooks/api/useApiQuery';

const TagsList = dynamic(
  () => import('@/components/features/Tags/TagsList/TagsList').then((m) => m.TagsList),
  {
    ssr: false
  }
);

const Page = () => {
  const { data, refetch, isLoading, error } = useApiQuery({
    route: 'TAGS'
  });

  return (
    <RequireAuth>
      <Layout
        {...{
          title: 'tags.title',
          breakpoints: [{ children: 'main', href: '/' }, { children: 'tags' }],
          hideOnMobile: { title: true, subTitle: true },
          loading: isLoading,
          error: error?.message
        }}
      >
        <TagsList data={data} refetch={refetch} />
      </Layout>
    </RequireAuth>
  );
};

export default Page;
