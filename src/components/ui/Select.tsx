'use client';

import { useField } from 'formik';
import { ComponentProps } from 'react';

import { cn } from '@/lib/utils/cn';

// Formik-owy odpowiednik Input.tsx (ten sam useField, ta sama obsługa
// błędu) — tylko <select> zamiast <input>. Projekt nie miał dotąd żadnego
// komponentu do wyboru z listy, więc surowy <select> był jedynym wyjściem;
// teraz jest to.
export type SelectOption = { value: string; label: string };

export type SelectProps = {
  className?: string;
  error?: string;
  name: string;
  options: SelectOption[];
} & Omit<ComponentProps<'select'>, 'name'>;

const Select = ({ className, error, name, options, ...props }: SelectProps) => {
  const [field, meta] = useField(name);

  const displayError = error || (meta.touched && meta.error ? meta.error : '');

  return (
    <div className="flex flex-col gap-1">
      <select
        {...field}
        {...props}
        className={cn(
          'h-12 w-full rounded-xs border px-4 outline-0 focus:border-navy',
          displayError ? 'border-error focus:border-error' : 'border-cloud focus:border-cloud',
          className
        )}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {displayError && <span className="px-2 text-sm text-red-700">{displayError}</span>}
    </div>
  );
};

export default Select;
