'use client';
import dynamic from 'next/dynamic';

import { Layout } from '../../components/Layout/Layout';
import { useApiQuery } from '../../hooks/api/useApiQuery';

const UsersList = dynamic(
  () =>
    import('../../components/PageComponents/Users/UsersList/UsersList').then((m) => m.UsersList),
  {
    ssr: false
  }
);

const Page = () => {
  const { data, refetch, isLoading, error } = useApiQuery({
    route: 'USERS'
  });

  return (
    <Layout
      {...{
        title: 'users.title',
        breakpoints: [{ children: 'main', href: '/' }, { children: 'users' }],
        hideOnMobile: { title: true, subTitle: true },
        loading: isLoading,
        error: error?.message
      }}
    >
      <UsersList data={data} refetch={refetch} />
    </Layout>
  );
};

export default Page;
