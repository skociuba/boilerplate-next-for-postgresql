'use client';
import dynamic from 'next/dynamic';

import { Layout } from '../../../../components/Example/Layout';
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
        title: 'examplePage.title',
        breakpoints: [{ children: 'main', href: '/' }],
        hideOnMobile: { title: true, subTitle: true },
        loading: isLoading,
        error: error?.message
      }}
    >
      <UserForm data={data?.[0]} />
    </Layout>
  );
};

export default Page;
