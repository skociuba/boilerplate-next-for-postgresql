'use client';
import { useRouter } from '#/navigation';
import dynamic from 'next/dynamic';

import { Layout } from '@/components/layout/Layout/Layout';
import { RequireAuth } from '@/components/layout/RequireAuth';

import { useApiQuery } from '@/hooks/api/useApiQuery';

const UserForm = dynamic(
  () => import('@/components/features/Users/UserForm/UserForm').then((m) => m.UserForm),
  {
    ssr: false
  }
);

const Page = ({ params }: { params: { id: string } }) => {
  const { data, isLoading, error } = useApiQuery({
    route: 'USER',
    id: params.id
  });
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
          hideOnMobile: { title: true, subTitle: true },
          loading: isLoading,
          error: error?.message
        }}
      >
        <UserForm
          oldValues={data?.[0]}
          route="USER_EDIT"
          method="PUT"
          handleSubmit={() => {
            router.push('/users');
          }}
        />
      </Layout>
    </RequireAuth>
  );
};

export default Page;
