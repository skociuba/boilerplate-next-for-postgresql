'use client';
import dynamic from 'next/dynamic';

import { Layout } from '../../components/Example/Layout';
import { useApiQuery } from '../../hooks/api/useApiQuery';

const UsersList = dynamic(
  () =>
    import('../../components/PageComponents/Users/UsersList/UsersList').then((m) => m.UsersList),
  {
    ssr: false
  }
);

const Page = () => {
  const { data, isLoading, error } = useApiQuery({
    route: 'USERS'
  });

  return (
    <Layout
      {...{
        title: 'examplePage.title',
        breakpoints: [{ children: 'main', href: '/' }],
        hideOnMobile: { title: true, subTitle: true },
        loading: isLoading,
        error: error?.message
      }}
    >
      <UsersList data={data} />
    </Layout>
  );
};

export default Page;
