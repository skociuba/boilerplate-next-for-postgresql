import { Link } from '#/navigation';

import { Container } from './Layout/components/Container';

export const Footer = () => (
  <footer className="border-t border-slate-200 bg-white">
    <Container className="flex flex-col gap-2 py-6 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
      <p>VPS2 · aplikacja demonstracyjna (portfolio)</p>
      <Link href="/privacy" className="hover:text-navy hover:underline">
        Polityka prywatności i cookies
      </Link>
    </Container>
  </footer>
);
