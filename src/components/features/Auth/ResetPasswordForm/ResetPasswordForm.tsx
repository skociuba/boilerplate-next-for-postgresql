'use client';

import { useSearchParams } from 'next/navigation';

import { Button } from '@/ui/Button';
import { Form } from '@/ui/Form';
import Input from '@/ui/Input';

import { usePage } from './usePage';

// Czyta token sama, ssr:false (patrz reset-password/page.tsx) — więc
// useSearchParams tu nie wymaga osobnej granicy <Suspense>, tak jak
// LoginForm też zarządza swoim stanem samodzielnie, bez propsów ze strony.
export const ResetPasswordForm = () => {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const { form, error } = usePage({ token: token ?? '' });

  if (!token) {
    return (
      <p className="mx-auto mt-8 max-w-sm text-sm text-red-700">
        Brak tokena w linku — sprawdź, czy skopiowałeś/aś cały link z maila.
      </p>
    );
  }

  return (
    <div className="mx-auto mt-8 max-w-sm">
      <Form form={form} className="flex flex-col gap-3">
        <Input name="password" type="password" placeholder="password" />
        {error ? <p className="text-sm text-red-700">{error}</p> : null}
        <Button type="submit" variant="tertiary" fullWidth>
          Ustaw nowe hasło
        </Button>
      </Form>
    </div>
  );
};
