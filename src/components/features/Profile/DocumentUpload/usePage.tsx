'use client';

import { toast } from 'react-toastify';

import { useForm } from '@/ui/useForm';

import { fetchRequest } from '@/lib/api';

import { useApiMutation } from '@/hooks/api/useApiMutation';

import { documentValidationSchema, initialValues } from './pageModel';

export const usePage = ({ userId, onSaved }: { userId: string; onSaved: () => void }) => {
  const { mutate, isLoading } = useApiMutation({
    route: 'USER_PROFILE_DOCUMENT_UPLOAD',
    method: 'PUT',
    multipart: true
  });

  const form = useForm({
    initialValues,
    validationSchema: documentValidationSchema,
    clearForm: true,
    onSubmit: (values) => {
      mutate(
        { params: { userId }, ...values },
        {
          onSuccess: ({ error }) => {
            if (error) return;
            toast('Dokument zapisany', {
              position: 'bottom-left',
              autoClose: 3000,
              type: 'success',
              theme: 'colored'
            });
            onSaved();
          }
        }
      );
    }
  });

  // Dokument jest PRYWATNY (patrz backend: brak statycznego URL-a) — więc
  // w odróżnieniu od avatara nie da się go pobrać przez zwykły <a href>.
  // Request leci z Bearer tokenem jak każdy inny, odpowiedź (getFile: true)
  // to Blob, z którego ręcznie robimy link i klikamy go programowo — to
  // jedyny sposób na "zapisz plik" przy pobieraniu chronionym tokenem.
  const handleDownload = async (fileName: string) => {
    const { data, error } = await fetchRequest({
      route: 'USER_PROFILE_DOCUMENT_DOWNLOAD',
      method: 'GET',
      params: { userId },
      getFile: true
    });

    if (error || !data) {
      toast('Nie udało się pobrać dokumentu', {
        position: 'bottom-left',
        autoClose: 3000,
        type: 'error',
        theme: 'colored'
      });

      return;
    }

    const blobUrl = URL.createObjectURL(data as Blob);
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = fileName;
    link.click();
    URL.revokeObjectURL(blobUrl);
  };

  return { form, isLoading, handleDownload };
};
