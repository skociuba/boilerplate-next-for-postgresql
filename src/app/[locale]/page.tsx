import dynamic from 'next/dynamic';

import { Layout } from '@/components/layout/Layout/Layout';

const HomeComponent = dynamic(
  () => import('@/components/features/MainComponent').then((m) => m.HomeComponent),
  {
    ssr: true
  }
);

const Page = () => {
  return (
    <Layout
      {...{
        title: 'homePage.title',
        breakpoints: [{ children: 'main' }],
        hideOnMobile: { title: true, subTitle: true }
      }}
    >
      <HomeComponent />
    </Layout>
  );
};

export default Page;
