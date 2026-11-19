'use client';

import { FormikValues } from 'formik';

import { Button } from '@/ui/Button';
import { Form } from '@/ui/Form';
import Input from '@/ui/Input';

import { usePage } from './usePage';

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="flex flex-col gap-1.5">
    <span aria-hidden="true" className="text-sm font-medium text-slate-700">
      {label}
    </span>
    {children}
  </div>
);

export const ProfileForm = ({
  oldValues,
  userId,
  onSaved
}: {
  oldValues?: FormikValues;
  userId: string;
  onSaved: () => void;
}) => {
  const { form, isLoading } = usePage({ oldValues, userId, onSaved });

  return (
    <section className="w-full rounded-2xl border border-slate-200 bg-white p-6 shadow-xs sm:p-8">
      <h2 className="text-lg font-semibold text-slate-900">Dane profilu</h2>
      <p className="mb-6 mt-1 text-sm text-slate-500">
        Imię i nazwisko widać przy Twoich postach. Data urodzenia i telefon są opcjonalne i widzisz
        je tylko Ty.
      </p>
      <Form {...{ form, className: 'flex flex-col gap-4' }}>
        {/* Widoczny podpis nad polem: placeholder znika po wpisaniu, a
            wypełnione "+48 500 600 700" czy "dd.mm.rrrr" samo nie mówi, czym
            jest. aria-hidden, bo Input ma już aria-label z tym samym tekstem. */}
        <Field label="Imię i nazwisko">
          <Input name="name" placeholder="fullName" autoComplete="name" />
        </Field>
        <Field label="Data urodzenia (opcjonalnie)">
          <Input type="date" name="date_of_birth" placeholder="date_of_birth" />
        </Field>
        <Field label="Telefon (opcjonalnie)">
          <Input name="phone" type="tel" placeholder="phone" autoComplete="tel" />
        </Field>

        <div>
          <Button variant="tertiary" type="submit" className="px-6" disabled={isLoading}>
            Zapisz zmiany
          </Button>
        </div>
      </Form>
    </section>
  );
};
