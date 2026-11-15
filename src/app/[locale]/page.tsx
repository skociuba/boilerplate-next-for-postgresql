import dynamic from 'next/dynamic';

import { Layout } from '@/components/layout/Layout/Layout';

// ssr:false jak przy każdym innym komponencie korzystającym z useApiQuery w
// tym projekcie (Posts/Tags/Users) — HomeComponent teraz pobiera tagi
const HomeComponent = dynamic(
  () => import('@/components/features/MainComponent').then((m) => m.HomeComponent),
  {
    ssr: false
  }
);

const Page = () => {
  return (
    <Layout
      {...{
        title: 'homePage.title',
        hideIntro: true
      }}
    >
      <HomeComponent />
    </Layout>
  );
};

export default Page;
