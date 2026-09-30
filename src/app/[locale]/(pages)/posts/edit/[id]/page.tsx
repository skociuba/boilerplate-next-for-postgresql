'use client';
import { useRouter } from '#/navigation';
import dynamic from 'next/dynamic';

import { Layout } from '@/components/layout/Layout/Layout';

import { useApiQuery } from '@/hooks/api/useApiQuery';

const PostForm = dynamic(
  () => import('@/components/features/Posts/PostForm/PostForm').then((m) => m.PostForm),
  {
    ssr: false
  }
);

const Page = ({ params }: { params: { id: string } }) => {
  const { data, isLoading, error } = useApiQuery({
    route: 'POST',
    id: params.id
  });
  const router = useRouter();

  return (
    <Layout
      {...{
        title: 'posts.title',
        breakpoints: [
          { children: 'main', href: '/' },
          { children: 'posts', href: '/posts' },
          { children: 'edit' }
        ],
        hideOnMobile: { title: true, subTitle: true },
        loading: isLoading,
        error: error?.message
      }}
    >
      {/* GET /posts/:id zwraca pojedynczy obiekt (nie tablicę jak GET /users/:id).
          Tagi (wielokrotny wybór) są teraz częścią samego PostForm. */}
      <PostForm
        oldValues={data}
        route="POST_EDIT"
        method="PUT"
        handleSubmit={() => {
          router.push('/posts');
        }}
      />
    </Layout>
  );
};

export default Page;
