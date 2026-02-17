import dynamic from 'next/dynamic';

import { Layout } from '@/components/Layout/Layout';

const HomeComponent = dynamic(
  () => import('@/components/PageComponents/MainComponent').then((m) => m.HomeComponent),
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
