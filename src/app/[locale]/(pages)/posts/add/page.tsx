'use client';
import { useRouter } from '#/navigation';
import dynamic from 'next/dynamic';

import { Layout } from '@/components/layout/Layout/Layout';

const PostForm = dynamic(
  () => import('@/components/features/Posts/PostForm/PostForm').then((m) => m.PostForm),
  {
    ssr: false
  }
);

const Page = () => {
  const router = useRouter();

  return (
    <Layout
      {...{
        title: 'posts.title',
        breakpoints: [{ children: 'main', href: '/' }, { children: 'posts' }],
        hideOnMobile: { title: true, subTitle: true }
      }}
    >
      <PostForm
        route="POST_ADD"
        method="POST"
        handleSubmit={() => {
          // tag (jeśli wybrany) jest już podpięty w tym momencie (patrz
          // PostForm/usePage.tsx) — więc tak jak w Users, po zapisie
          // wracamy prosto na listę
          router.push('/posts');
        }}
      />
    </Layout>
  );
};

export default Page;
