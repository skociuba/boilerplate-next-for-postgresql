'use client';

import { useField } from 'formik';
import { ComponentProps } from 'react';

import { NativeSelect, SelectOption } from './NativeSelect';

// Formik-owy odpowiednik Input.tsx (ten sam useField, ta sama obsługa
// błędu). Wygląd żyje w NativeSelect — ten sam komponent bez Formika
// obsługuje filtry na stronie głównej, więc oba selecty wyglądają tak samo.
export type { SelectOption };

export type SelectProps = {
  className?: string;
  error?: string;
  name: string;
  options: SelectOption[];
  size?: 'md' | 'lg';
} & Omit<ComponentProps<'select'>, 'name' | 'size'>;

const Select = ({ error, name, ...props }: SelectProps) => {
  const [field, meta] = useField(name);

  const displayError = error || (meta.touched && meta.error ? meta.error : '');

  return (
    <div className="flex flex-col gap-1">
      {/* props po field: własny onChange (np. limit w ChildrenList) wygrywa
          z formikowym — tak samo jak było przed wydzieleniem NativeSelect */}
      <NativeSelect {...field} {...props} invalid={Boolean(displayError)} />
      {displayError && <span className="px-2 text-sm text-error">{displayError}</span>}
    </div>
  );
};

export default Select;
