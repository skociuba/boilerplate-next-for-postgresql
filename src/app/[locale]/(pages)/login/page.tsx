'use client';
import dynamic from 'next/dynamic';

import { Layout } from '@/components/layout/Layout/Layout';

const LoginForm = dynamic(
  () => import('@/components/features/Auth/LoginForm/LoginForm').then((m) => m.LoginForm),
  { ssr: false }
);

const Page = () => (
  <Layout
    {...{
      title: 'login.title',
      breakpoints: [{ children: 'main', href: '/' }, { children: 'login' }],
      hideOnMobile: { title: true, subTitle: true }
    }}
  >
    <LoginForm />
  </Layout>
);

export default Page;
