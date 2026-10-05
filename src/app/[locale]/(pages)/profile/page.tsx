'use client';
import dynamic from 'next/dynamic';

import { Layout } from '@/components/layout/Layout/Layout';
import { RequireAuth } from '@/components/layout/RequireAuth';

import { useAuthStore } from '@/lib/authStore';

import { useApiQuery } from '@/hooks/api/useApiQuery';

const ProfileForm = dynamic(
  () => import('@/components/features/Profile/ProfileForm/ProfileForm').then((m) => m.ProfileForm),
  {
    ssr: false
  }
);

const Page = () => {
  // RequireAuth (niżej) gwarantuje, że to, co poniżej, renderuje się
  // WYŁĄCZNIE gdy user jest zalogowany — nie trzeba już osobno obsługiwać
  // tu stanu "gość" ani "jeszcze nie sprawdzone".
  const user = useAuthStore((state) => state.user);
  const userId = user ? String(user.id) : '';

  const { data, refetch, isLoading } = useApiQuery({
    route: 'USER_PROFILE',
    params: { userId },
    enabled: Boolean(userId)
  });

  // 404 (jeszcze nie ma profilu) i realny błąd wyglądają tu tak samo —
  // w obu przypadkach najprościej pokazać pusty formularz "stwórz profil"
  const oldValues = data?.error ? undefined : data;

  return (
    <RequireAuth>
      <Layout
        {...{
          title: 'profile.title',
          breakpoints: [{ children: 'main', href: '/' }, { children: 'profile' }],
          loading: isLoading
        }}
      >
        <ProfileForm oldValues={oldValues} userId={userId} onSaved={refetch} />
      </Layout>
    </RequireAuth>
  );
};

export default Page;
