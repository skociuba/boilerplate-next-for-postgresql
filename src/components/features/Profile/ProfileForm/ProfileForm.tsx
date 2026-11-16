'use client';

import { FormikValues } from 'formik';

import { Button } from '@/ui/Button';
import { Form } from '@/ui/Form';
import Input from '@/ui/Input';

import { usePage } from './usePage';

export const ProfileForm = ({
  oldValues,
  userId,
  onSaved
}: {
  oldValues?: FormikValues;
  userId: string;
  onSaved: () => void;
}) => {
  const { form } = usePage({ oldValues, userId, onSaved });

  return (
    <div className="w-full max-w-md">
      <p className="mb-6 text-gray-500">
        Relacja 1:1 z Twoim kontem — zapis działa jak upsert (PUT tworzy profil, jeśli go jeszcze
        nie masz, albo nadpisuje istniejący).
      </p>
      <Form {...{ form, className: 'flex flex-col gap-4' }}>
        <Input name="pesel" placeholder="pesel" maxLength={11} />
        <Input type="date" name="date_of_birth" placeholder="date_of_birth" />
        <Input name="phone" placeholder="phone" />

        <div className="flex gap-4">
          <Button variant="primary" type="submit">
            Zapisz profil
          </Button>
        </div>
      </Form>
    </div>
  );
};
