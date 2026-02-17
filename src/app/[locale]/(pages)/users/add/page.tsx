'use client';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';

import { Layout } from '@/components/Layout/Layout';

const UserForm = dynamic(
  () => import('@/components/PageComponents/Users/UserForm/UserForm').then((m) => m.UserForm),
  {
    ssr: false
  }
);

const Page = () => {
  const router = useRouter();

  return (
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
  );
};

export default Page;
