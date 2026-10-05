'use client';
import { useRouter } from '#/navigation';
import dynamic from 'next/dynamic';

import { Layout } from '@/components/layout/Layout/Layout';
import { RequireAuth } from '@/components/layout/RequireAuth';

const UserForm = dynamic(
  () => import('@/components/features/Users/UserForm/UserForm').then((m) => m.UserForm),
  {
    ssr: false
  }
);

const Page = () => {
  const router = useRouter();

  return (
    <RequireAuth adminOnly>
      <Layout
        {...{
          title: 'users.title',
          breakpoints: [
            { children: 'main', href: '/' },
            { children: 'users', href: '/users' },
            { children: 'edit' }
          ],
          hideOnMobile: { title: true, subTitle: true }
        }}
      >
        <UserForm
          route="USER_ADD"
          method="POST"
          handleSubmit={() => {
            router.push('/users');
          }}
        />
      </Layout>
    </RequireAuth>
  );
};

export default Page;
