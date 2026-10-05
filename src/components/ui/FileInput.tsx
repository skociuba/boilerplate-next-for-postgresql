'use client';

import { useField } from 'formik';
import { useTranslations } from 'next-intl';
import { ChangeEvent, useRef } from 'react';

import { Button } from '@/ui/Button';

import { cn } from '@/lib/utils/cn';

export type FileInputProps = {
  name: string;
  label: string;
  accept: string;
  className?: string;
};

// Odpowiednik Input.tsx/Select.tsx dla pojedynczego pliku — podpięty pod
// Formik przez useField, jak reszta pól w projekcie. W odróżnieniu od
// Input.tsx NIE renderuje natywnego <input type="file"> na widoku: te są
// brzydkie i nie da się ich ostylować, więc input jest schowany (hidden),
// a klika się w zwykły Button, który go triggeruje (ref + .click()).
const FileInput = ({ name, label, accept, className }: FileInputProps) => {
  const t = useTranslations('form');
  const [, meta, helpers] = useField(name);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const displayError = meta.touched && meta.error ? meta.error : '';

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    helpers.setValue(file);
    // Bez tego wybranie TEGO SAMEGO pliku drugi raz po rzędu (np. po
    // odrzuceniu przez walidację) nie wywołałoby onChange w ogóle —
    // input "pamięta" ostatnio wybraną wartość.
    e.target.value = '';
  };

  return (
    <div className={cn('flex flex-col gap-1', className)}>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleChange}
        className="hidden"
      />
      <Button type="button" variant="secondary" handleClick={() => inputRef.current?.click()}>
        {t(`label.${label}`)}
      </Button>
      {meta.value instanceof File && (
        <span className="px-2 text-sm text-gray-500">{meta.value.name}</span>
      )}
      {displayError && <span className="text-red-700 text-sm px-2">{displayError}</span>}
    </div>
  );
};

export default FileInput;
