'use client';
import dynamic from 'next/dynamic';

import { Layout } from '@/components/layout/Layout/Layout';

const ForgotPasswordForm = dynamic(
  () =>
    import('@/components/features/Auth/ForgotPasswordForm/ForgotPasswordForm').then(
      (m) => m.ForgotPasswordForm
    ),
  { ssr: false }
);

const Page = () => (
  <Layout
    {...{
      title: 'forgotPassword.title',
      breakpoints: [{ children: 'main', href: '/' }, { children: 'forgotPassword' }],
      hideOnMobile: { title: true, subTitle: true }
    }}
  >
    <ForgotPasswordForm />
  </Layout>
);

export default Page;
