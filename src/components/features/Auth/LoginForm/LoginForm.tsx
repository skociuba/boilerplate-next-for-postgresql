'use client';

import { Link } from '#/navigation';

import { Button } from '@/ui/Button';
import { Form } from '@/ui/Form';
import Input from '@/ui/Input';

import { cn } from '@/lib/utils/cn';

import { usePage } from './usePage';

export const LoginForm = () => {
  const { mode, setMode, form, error } = usePage();

  return (
    <div className="mx-auto w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <div className="mb-6 flex gap-5 text-sm">
        <Button
          type="button"
          variant="noStyling"
          rounded={false}
          handleClick={() => setMode('login')}
          className={cn(
            'h-auto pb-1',
            mode === 'login' ? 'border-b-2 border-navy font-bold' : 'text-gray-400'
          )}
        >
          Zaloguj się
        </Button>
        <Button
          type="button"
          variant="noStyling"
          rounded={false}
          handleClick={() => setMode('register')}
          className={cn(
            'h-auto pb-1',
            mode === 'register' ? 'border-b-2 border-navy font-bold' : 'text-gray-400'
          )}
        >
          Załóż konto
        </Button>
      </div>

      <Form form={form} className="flex flex-col gap-3">
        {mode === 'register' ? <Input name="name" placeholder="name" /> : null}
        <Input name="email" type="email" placeholder="email" />
        <Input name="password" type="password" placeholder="password" />

        {error ? <p className="text-sm text-error">{error}</p> : null}

        <Button type="submit" variant="tertiary" fullWidth>
          {mode === 'login' ? 'Zaloguj się' : 'Załóż konto'}
        </Button>
      </Form>

      {/* Informacja w chwili zbierania danych (RODO art. 13), nie checkbox
          ze zgodą: podstawą jest umowa (prowadzenie konta), więc zgoda nie
          jest potrzebna — wystarczy jasno powiedzieć, gdzie są szczegóły. */}
      {mode === 'register' ? (
        <p className="mt-4 text-xs leading-relaxed text-slate-500">
          Zakładając konto, potwierdzasz, że znasz{' '}
          <Link href="/privacy" className="text-navy underline">
            politykę prywatności
          </Link>
          . To aplikacja demonstracyjna — nie wpisuj prawdziwych danych wrażliwych (PESEL,
          dokumenty).
        </p>
      ) : null}

      {mode === 'login' ? (
        <>
          <p className="mt-3 text-right text-xs">
            <Link href="/forgot-password" className="text-gray-400 underline">
              Zapomniałeś/aś hasła?
            </Link>
          </p>
          {/* Konta z prisma/seed.ts istnieją tylko w lokalnej bazie — na
              produkcji ich nie ma, a bob jest w seedzie adminem, więc jego
              hasło na publicznej stronie byłoby zaproszeniem dla każdego.
              next build podstawia NODE_ENV na sztywno, więc w produkcyjnym
              bundlu tego tekstu w ogóle nie ma (nie jest tylko ukryty). */}
          {process.env.NODE_ENV !== 'production' ? (
            <p className="mt-4 text-xs text-gray-400">
              lokalnie (seed): alice@example.com / alice123, admin: bob@example.com / bob123
            </p>
          ) : null}
        </>
      ) : null}
    </div>
  );
};
