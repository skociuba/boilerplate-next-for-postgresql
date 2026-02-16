'use client';
import dynamic from 'next/dynamic';

import { Layout } from '../../../../components/Layout/Layout';
import { useApiQuery } from '../../../../hooks/api/useApiQuery';

const UserForm = dynamic(
  () =>
    import('../../../../components/PageComponents/Users/UserForm/UserForm').then((m) => m.UserForm),
  {
    ssr: false
  }
);

const Page = ({ params }: { params: { id: string } }) => {
  const { data, isLoading, error } = useApiQuery({
    route: 'USER',
    id: params.id
  });

  return (
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
      <UserForm oldValues={data?.[0]} route="USER_EDIT" method="PUT"  />
    </Layout>
  );
};

export default Page;
