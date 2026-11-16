'use client';

import { useField } from 'formik';

import { Dropdown, DropdownProps, SelectOption } from './Dropdown';

// Formik-owy odpowiednik Input.tsx (ten sam useField, ta sama obsługa
// błędu). Wygląd i klawiatura żyją w Dropdown — ten sam komponent bez
// Formika obsługuje filtry na stronie głównej.
export type { SelectOption };

export type SelectProps = {
  name: string;
  error?: string;
  // Dodatkowa reakcja na zmianę (np. limit w ChildrenList odpytuje API od
  // razu) — wartość w Formiku i tak ustawia się sama
  onValueChange?: (value: string) => void;
} & Omit<DropdownProps, 'value' | 'onChange'>;

const Select = ({ name, error, onValueChange, ...props }: SelectProps) => {
  const [field, meta, helpers] = useField<string>(name);

  const displayError = error || (meta.touched && meta.error ? meta.error : '');

  return (
    <div className="flex flex-col gap-1">
      <Dropdown
        {...props}
        id={props.id ?? name}
        value={field.value ?? ''}
        onChange={(value) => {
          helpers.setValue(value);
          onValueChange?.(value);
        }}
        onBlur={() => helpers.setTouched(true)}
        invalid={Boolean(displayError)}
      />
      {displayError && <span className="px-2 text-sm text-error">{displayError}</span>}
    </div>
  );
};

export default Select;
