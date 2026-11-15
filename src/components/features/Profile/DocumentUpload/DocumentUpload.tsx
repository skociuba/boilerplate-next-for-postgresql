'use client';

import { Button } from '@/ui/Button';
import FileInput from '@/ui/FileInput';
import { Form } from '@/ui/Form';

import { usePage } from './usePage';

export const DocumentUpload = ({
  userId,
  documentName,
  onSaved
}: {
  userId: string;
  documentName?: string | null;
  onSaved: () => void;
}) => {
  const { form, isLoading, handleDownload } = usePage({ userId, onSaved });

  return (
    <div className="flex flex-col gap-3">
      <p className="text-gray-500">
        Dokument — prywatny, widoczny tylko dla Ciebie (PDF/HTML, max 5 MB).
      </p>
      {documentName && (
        <Button
          type="button"
          variant="download"
          handleClick={() => handleDownload(documentName)}
          className="self-start"
        >
          Pobierz: {documentName}
        </Button>
      )}
      <Form {...{ form, className: 'flex items-end gap-3' }}>
        <FileInput name="document" label="document" accept="application/pdf,text/html" />
        {form.values.document instanceof File && (
          <Button type="submit" disabled={isLoading}>
            Zapisz dokument
          </Button>
        )}
      </Form>
    </div>
  );
};
