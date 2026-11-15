'use client';
import dynamic from 'next/dynamic';

import { Layout } from '@/components/layout/Layout/Layout';

const ActivateStatus = dynamic(
  () =>
    import('@/components/features/Auth/ActivateStatus/ActivateStatus').then(
      (m) => m.ActivateStatus
    ),
  { ssr: false }
);

const Page = () => (
  <Layout
    {...{
      title: 'activate.title',
      breakpoints: [{ children: 'main', href: '/' }, { children: 'activate' }],
      hideOnMobile: { title: true, subTitle: true }
    }}
  >
    <ActivateStatus />
  </Layout>
);

export default Page;
