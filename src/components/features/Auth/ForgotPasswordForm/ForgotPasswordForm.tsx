'use client';

import { Button } from '@/ui/Button';
import { Form } from '@/ui/Form';
import Input from '@/ui/Input';

import { usePage } from './usePage';

export const ForgotPasswordForm = () => {
  const { form, message } = usePage();

  if (message) {
    return <p className="mx-auto mt-8 max-w-sm text-sm text-gray-600">{message}</p>;
  }

  return (
    <div className="mx-auto mt-8 max-w-sm">
      <p className="mb-4 text-sm text-gray-500">
        Podaj adres email — jeśli masz u nas konto, wyślemy na niego link do resetu hasła.
      </p>
      <Form form={form} className="flex flex-col gap-3">
        <Input name="email" type="email" placeholder="email" />
        <Button type="submit" variant="tertiary" fullWidth>
          Wyślij link
        </Button>
      </Form>
    </div>
  );
};
