'use client';
import dynamic from 'next/dynamic';

import { Layout } from '@/components/layout/Layout/Layout';
import { RequireAuth } from '@/components/layout/RequireAuth';

// Bez ssr — tak jak UsersList/PostsList/TagsList. Inaczej niż tamte strony,
// ChildrenList sam odpytuje API (przez usePage) zamiast dostawać data/refetch
// z góry — bo query zależy od page/limit/sortBy/filtrów, czyli stanu, który
// żyje wewnątrz komponentu, nie na poziomie strony.
const ChildrenList = dynamic(
  () =>
    import('@/components/features/Children/ChildrenList/ChildrenList').then((m) => m.ChildrenList),
  { ssr: false }
);

const Page = () => (
  <RequireAuth>
    <Layout
      {...{
        title: 'children.title',
        breakpoints: [{ children: 'main', href: '/' }, { children: 'children' }],
        hideOnMobile: { title: true, subTitle: true }
      }}
    >
      <ChildrenList />
    </Layout>
  </RequireAuth>
);

export default Page;
