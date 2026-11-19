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
const AvatarUpload = dynamic(
  () =>
    import('@/components/features/Profile/AvatarUpload/AvatarUpload').then((m) => m.AvatarUpload),
  { ssr: false }
);
const DocumentUpload = dynamic(
  () =>
    import('@/components/features/Profile/DocumentUpload/DocumentUpload').then(
      (m) => m.DocumentUpload
    ),
  { ssr: false }
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

  // GET zwraca imię zawsze, a pola profilu jako null, gdy nic jeszcze nie
  // zapisano — Formik potrzebuje '' zamiast null, inaczej input staje się
  // "niekontrolowany" i React ostrzega przy pierwszym wpisanym znaku.
  const profile = data?.error ? undefined : data;
  const oldValues = profile
    ? {
        name: profile.name ?? user?.name ?? '',
        date_of_birth: profile.date_of_birth ?? '',
        phone: profile.phone ?? ''
      }
    : { name: user?.name ?? '' };

  return (
    <RequireAuth>
      <Layout
        {...{
          title: 'profile.title',
          breakpoints: [{ children: 'main', href: '/' }, { children: 'profile' }],
          loading: isLoading
        }}
      >
        {/* Avatar i dokument nie czekają już na zapis formularza — backend
            tworzy wiersz profilu przy pierwszym uploadzie (upsert), bo
            żadne pole profilu nie jest wymagane. */}
        <div className="grid w-full gap-6 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
          <ProfileForm oldValues={oldValues} userId={userId} onSaved={refetch} />
          <div className="flex flex-col gap-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-xs sm:p-8">
            <AvatarUpload userId={userId} avatarPath={profile?.avatar_path} onSaved={refetch} />
            <DocumentUpload
              userId={userId}
              documentName={profile?.document_original_name}
              onSaved={refetch}
            />
          </div>
        </div>
      </Layout>
    </RequireAuth>
  );
};

export default Page;
