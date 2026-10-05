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
// Upload avatara/dokumentu — zakomentowane na czas omawiania backendu
// (multer, storage na dysku, wolumen w Dockerze). Komponenty zostają na
// miejscu (features/Profile/AvatarUpload, features/Profile/DocumentUpload,
// ui/FileInput.tsx) — to tylko odpięcie z widoku, nie usunięcie.
// const AvatarUpload = dynamic(
//   () =>
//     import('@/components/features/Profile/AvatarUpload/AvatarUpload').then((m) => m.AvatarUpload),
//   { ssr: false }
// );
// const DocumentUpload = dynamic(
//   () =>
//     import('@/components/features/Profile/DocumentUpload/DocumentUpload').then(
//       (m) => m.DocumentUpload
//     ),
//   { ssr: false }
// );

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
        {/* avatar/document wiszą na profilu (upsert.update) — bez profilu
            (jeszcze nie zapisanego PESEL-u itd.) nie mają czego aktualizować.
            pesel/date_of_birth są NOT NULL w schema.prisma, więc nie da się
            "po cichu" stworzyć samego avatara bez tamtych danych.
        {oldValues ? (
          <div className="ml-8 mt-8 flex max-w-md flex-col gap-8">
            <AvatarUpload userId={userId} avatarPath={data?.avatar_path} onSaved={refetch} />
            <DocumentUpload
              userId={userId}
              documentName={data?.document_original_name}
              onSaved={refetch}
            />
          </div>
        ) : (
          <p className="ml-8 mt-8 max-w-md text-gray-500">
            Zapisz profil (PESEL, data urodzenia, telefon) powyżej — dopiero potem odblokuje się
            upload avatara i dokumentu.
          </p>
        )} */}
      </Layout>
    </RequireAuth>
  );
};

export default Page;
