'use client';
import { usePathname, Link } from '#/navigation';
import { Menu, X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';

import { useAuthStore } from '@/lib/authStore';
import { cn } from '@/lib/utils/cn';

import { CurrentUserSwitcher } from './CurrentUserSwitcher';
import { Container } from './Layout/components/Container';

// access: 'public' (każdy), 'auth' (zalogowany, dowolna rola), 'admin'
// (tylko role: 'admin') — trzy poziomy zamiast binarnego isLoggedIn, bo
// /users jest teraz modułem admina, nie każdego zalogowanego.
const NavLinks = [
  { id: 1, name: 'home', path: '/', access: 'public' },
  { id: 2, name: 'customers', path: '/users', access: 'admin' },
  { id: 3, name: 'posts', path: '/posts', access: 'auth' },
  { id: 4, name: 'tags', path: '/tags', access: 'auth' },
  { id: 5, name: 'children', path: '/children', access: 'auth' }
] as const;

const Navbar = () => {
  const pathname = usePathname();
  const t = useTranslations('Navbar');
  const user = useAuthStore((state) => state.user);
  const isLoggedIn = Boolean(user);
  const isAdmin = user?.role === 'admin';
  const [menuOpen, setMenuOpen] = useState(false);

  // Po przejściu na inną stronę menu mobilne ma się zamknąć samo —
  // inaczej zasłaniałoby treść, na którą użytkownik właśnie przeszedł.
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  const visibleLinks = NavLinks.filter((link) => {
    if (link.access === 'public') return true;
    if (link.access === 'admin') return isAdmin;

    return isLoggedIn;
  });

  const linkClass = (path: string) =>
    cn(
      'rounded-xs px-3 py-2 text-sm font-medium transition-colors',
      path === pathname
        ? 'bg-navy/[0.07] text-navy'
        : 'text-slate-600 hover:bg-slate-100 hover:text-navy'
    );

  const languageSwitch = (
    <div className="flex items-center gap-1 text-sm">
      {(['pl', 'en'] as const).map((locale) => (
        <Link
          key={locale}
          href={pathname}
          locale={locale}
          className="rounded-xs px-2 py-1 uppercase text-slate-500 hover:bg-slate-100 hover:text-navy"
          title={t(`language.${locale}`)}
        >
          {locale}
        </Link>
      ))}
    </div>
  );

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur">
      <Container className="flex h-16 items-center justify-between gap-4">
        <div className="flex items-center gap-6">
          <Link href="/" className="text-lg font-bold tracking-tight text-navy">
            VPS<span className="text-sky-600">2</span>
          </Link>
          <nav className="hidden md:block" aria-label="Główna nawigacja">
            <ul className="flex items-center gap-1">
              {visibleLinks.map((link) => (
                <li key={link.id}>
                  <Link
                    href={link.path}
                    className={linkClass(link.path)}
                    aria-current={link.path === pathname ? 'page' : undefined}
                  >
                    {t(`links.${link.name}`)}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="hidden items-center gap-4 md:flex">
          <CurrentUserSwitcher />
          {languageSwitch}
        </div>

        <button
          type="button"
          className="rounded-xs p-2 text-slate-700 hover:bg-slate-100 md:hidden"
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          aria-label={menuOpen ? 'Zamknij menu' : 'Otwórz menu'}
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </Container>

      {menuOpen ? (
        <div id="mobile-menu" className="border-t border-slate-200 bg-white md:hidden">
          <Container className="flex flex-col gap-4 py-4">
            <nav aria-label="Menu mobilne">
              <ul className="flex flex-col gap-1">
                {visibleLinks.map((link) => (
                  <li key={link.id}>
                    <Link href={link.path} className={cn(linkClass(link.path), 'block')}>
                      {t(`links.${link.name}`)}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
            <div className="flex flex-col gap-3 border-t border-slate-200 pt-4">
              <CurrentUserSwitcher stacked />
              {languageSwitch}
            </div>
          </Container>
        </div>
      ) : null}
    </header>
  );
};

export default Navbar;
