'use client';
// Next 15 nie pozwala na dynamic(..., { ssr: false }) w komponencie
// serwerowym, a Intro jest ładowane tylko w przeglądarce. children nadal
// mogą być komponentami serwerowymi (np. polityka prywatności).
import dynamic from 'next/dynamic';
import Skeleton from 'react-loading-skeleton';

import 'react-loading-skeleton/dist/skeleton.css';
import { FormMessage } from '@/ui/FormMessage';

import { cn } from '@/lib/utils/cn';

import { Container } from './components/Container';
import { IntroProps } from './components/Intro';
export type LayoutProps = {
  children?: React.ReactElement;
  loading?: boolean;
  error?: string;
  // Strona główna ma własny nagłówek (baner "Najnowsze posty"), więc
  // okruszek i tytuł "Strona główna" nad nim tylko powtarzały to samo.
  hideIntro?: boolean;
} & IntroProps;

const Intro = dynamic(() => import('./components/Intro').then((m) => m.Intro), {
  ssr: false
});

export const Layout = ({ children, error, loading, hideIntro, ...props }: LayoutProps) => {
  return (
    <div className="flex flex-col gap-6 pb-20 pt-8 md:pt-10">
      {error ? <FormMessage success={false}>{error}</FormMessage> : null}
      <Container className={cn('flex flex-col gap-6 md:gap-8')}>
        {hideIntro ? null : <Intro {...props} />}
        {/* Szerokość z kontenera, nie width={1000}: stałe 1000px rozpychało
            stronę na telefonie w poziomie na czas ładowania. */}
        {loading ? <Skeleton height={24} count={10} containerClassName="block w-full" /> : children}
      </Container>
    </div>
  );
};
