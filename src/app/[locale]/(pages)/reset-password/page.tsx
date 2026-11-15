'use client';
import dynamic from 'next/dynamic';

import { Layout } from '@/components/layout/Layout/Layout';

const ResetPasswordForm = dynamic(
  () =>
    import('@/components/features/Auth/ResetPasswordForm/ResetPasswordForm').then(
      (m) => m.ResetPasswordForm
    ),
  { ssr: false }
);

const Page = () => (
  <Layout
    {...{
      title: 'resetPassword.title',
      breakpoints: [{ children: 'main', href: '/' }, { children: 'resetPassword' }],
      hideOnMobile: { title: true, subTitle: true }
    }}
  >
    <ResetPasswordForm />
  </Layout>
);

export default Page;
