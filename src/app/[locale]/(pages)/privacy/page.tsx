import { PrivacyPolicy } from '@/components/features/Privacy/PrivacyPolicy';
import { Layout } from '@/components/layout/Layout/Layout';

// Bez 'use client' i bez dynamic(): sama treść, więc renderuje się na
// serwerze i jest od razu w HTML-u (czytelna też bez JavaScriptu).
const Page = () => (
  <Layout
    {...{
      title: 'privacy.title',
      breakpoints: [{ children: 'main', href: '/' }, { children: 'privacy' }]
    }}
  >
    <PrivacyPolicy />
  </Layout>
);

export default Page;
