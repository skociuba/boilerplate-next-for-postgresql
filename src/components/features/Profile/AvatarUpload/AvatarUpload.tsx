'use client';

import { useMemo } from 'react';

import { Button } from '@/ui/Button';
import FileInput from '@/ui/FileInput';
import { Form } from '@/ui/Form';

import { getUploadUrl } from '@/lib/api';

import { usePage } from './usePage';

export const AvatarUpload = ({
  userId,
  avatarPath,
  onSaved
}: {
  userId: string;
  avatarPath?: string | null;
  onSaved: () => void;
}) => {
  const { form, isLoading } = usePage({ userId, onSaved });

  // Podgląd: wybrany-ale-niewysłany plik (object URL w pamięci przeglądarki)
  // ma priorytet nad tym, co już leży na serwerze — inaczej użytkownik nie
  // zobaczyłby zmiany przed kliknięciem "zapisz".
  const previewUrl = useMemo(() => {
    if (form.values.avatar instanceof File) return URL.createObjectURL(form.values.avatar);

    return avatarPath ? getUploadUrl(avatarPath) : null;
  }, [form.values.avatar, avatarPath]);

  return (
    <div className="flex flex-col gap-3">
      <p className="text-gray-500">
        Avatar — publiczne zdjęcie profilowe (PNG/JPEG/WebP, max 2 MB).
      </p>
      <div className="flex items-center gap-4">
        {previewUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={previewUrl}
            alt="Avatar"
            className="h-20 w-20 rounded-full border border-cloud object-cover"
          />
        ) : (
          <div className="h-20 w-20 rounded-full border border-cloud bg-cloud/30" />
        )}
        <Form {...{ form, className: 'flex items-end gap-3' }}>
          <FileInput name="avatar" label="avatar" accept="image/png,image/jpeg,image/webp" />
          {form.values.avatar instanceof File && (
            <Button type="submit" disabled={isLoading}>
              Zapisz avatar
            </Button>
          )}
        </Form>
      </div>
    </div>
  );
};
