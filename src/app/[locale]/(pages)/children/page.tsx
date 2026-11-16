'use client';
import dynamic from 'next/dynamic';
import { notFound } from 'next/navigation';

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

// Moduł wyłączony na publicznym demo (dane dzieci to dane szczególnie
// chronione — nie zbieramy ich bez realnej potrzeby). Strona zwraca 404
// zamiast znikać z repo: ChildrenList pokazuje paginację, sortowanie i
// filtrowanie po stronie API i może wrócić jedną zmianą tej stałej.
const CHILDREN_MODULE_ENABLED = false;

const Page = () => {
  if (!CHILDREN_MODULE_ENABLED) notFound();

  return <ChildrenPage />;
};

const ChildrenPage = () => (
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
