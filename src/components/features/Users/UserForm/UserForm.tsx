'use client';

import { FormProps } from '#/interfaces';

import { Button } from '@/ui/Button';
import { Form } from '@/ui/Form';
import Input from '@/ui/Input';
import { RoleSelect } from '@/ui/RoleSelect';

import { usePage } from './usePage';

// Podpis nad polem jak w RoleSelect i formularzu profilu — bez niego pola
// były zupełnie puste (Input bez placeholdera nie ma żadnego opisu).
const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="flex flex-col gap-1.5">
    <span aria-hidden="true" className="text-sm font-medium text-slate-700">
      {label}
    </span>
    {children}
  </div>
);

export const UserForm = (props: FormProps) => {
  const { form } = usePage(props);

  return (
    <div className="w-full max-w-2xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <Form {...{ form, className: 'flex flex-col gap-4' }}>
        <Field label="Imię i nazwisko">
          <Input name="name" placeholder="fullName" autoComplete="off" />
        </Field>
        <Field label="Email">
          <Input name="email" type="email" placeholder="email" autoComplete="off" />
        </Field>
        <RoleSelect />

        {/* Główna akcja (zapis) wypełniona, anulowanie jako obrys — wcześniej
            było odwrotnie i "Cancel" wyglądał na ważniejszy przycisk */}
        <div className="flex flex-wrap gap-3 pt-2">
          <Button variant="tertiary" type="submit" className="px-6">
            Zapisz
          </Button>
          <Button variant="primary" type="link" href={`/users`} className="px-6">
            Anuluj
          </Button>
        </div>
      </Form>
    </div>
  );
};
