'use client';
import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

import { Layout } from '@/components/layout/Layout/Layout';

import { getCurrentUserId } from '@/lib/currentUser';

import { useApiQuery } from '@/hooks/api/useApiQuery';

const ProfileForm = dynamic(
  () => import('@/components/features/Profile/ProfileForm/ProfileForm').then((m) => m.ProfileForm),
  {
    ssr: false
  }
);

const Page = () => {
  // '' = jeszcze nie sprawdzone (SSR/pierwszy render), null = gość
  const [userId, setUserId] = useState<string | null>('');

  useEffect(() => {
    setUserId(getCurrentUserId());
  }, []);

  const { data, refetch, isLoading } = useApiQuery({
    route: 'USER_PROFILE',
    params: { userId: userId ?? '' },
    enabled: Boolean(userId)
  });

  if (userId === '') return null;

  if (!userId) {
    return (
      <Layout
        {...{
          title: 'profile.title',
          breakpoints: [{ children: 'main', href: '/' }, { children: 'profile' }]
        }}
      >
        <div className="ml-8 mt-12 text-gray-500">
          Zaloguj się (prawy górny róg), żeby zobaczyć swój profil.
        </div>
      </Layout>
    );
  }

  // 404 (jeszcze nie ma profilu) i realny błąd wyglądają tu tak samo —
  // w obu przypadkach najprościej pokazać pusty formularz "stwórz profil"
  const oldValues = data?.error ? undefined : data;

  return (
    <Layout
      {...{
        title: 'profile.title',
        breakpoints: [{ children: 'main', href: '/' }, { children: 'profile' }],
        loading: isLoading
      }}
    >
      <ProfileForm oldValues={oldValues} userId={userId} onSaved={refetch} />
    </Layout>
  );
};

export default Page;
