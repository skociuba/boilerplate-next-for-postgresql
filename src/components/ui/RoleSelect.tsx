'use client';

import { useId } from 'react';

import Select from './Select';

// Adaptacja RoleSelect z system-biletowy-mera-frontend — tam opcje (role_id)
// ładowane były z API, bo ról mogło być dowolnie wiele i zmieniały się
// w bazie. Tu są tylko dwie, na stałe wpisane w enum (prisma/schema.prisma:
// enum Role { user admin }), więc dociąganie ich zapytaniem byłoby
// niepotrzebnym zapytaniem po coś, co i tak się nie zmienia.
// Widoczny podpis, bo pole pokazuje tylko wartość ("Użytkownik") — bez
// etykiety nie wiadomo, że to wybór roli. aria-labelledby zamiast <label>,
// bo combobox to nie natywny element formularza i <label> by go nie nazwał.
export const RoleSelect = ({ name = 'role' }: { name?: string }) => {
  const labelId = useId();

  return (
    <div className="flex flex-col gap-1.5">
      <span id={labelId} className="text-sm font-medium text-slate-700">
        Rola
      </span>
      <Select
        name={name}
        aria-labelledby={labelId}
        options={[
          { value: 'user', label: 'Użytkownik' },
          { value: 'admin', label: 'Administrator' }
        ]}
      />
    </div>
  );
};
