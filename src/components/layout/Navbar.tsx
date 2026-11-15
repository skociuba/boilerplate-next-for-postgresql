'use client';
import { usePathname, Link } from '#/navigation';
import { useTranslations } from 'next-intl';

import { ThemeSwitcher } from '@/ui/ThemeSwitcher';

import { useAuthStore } from '@/lib/authStore';

import { CurrentUserSwitcher } from './CurrentUserSwitcher';

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
  const isActive = (path: string) => path === pathname;
  const user = useAuthStore((state) => state.user);
  const isLoggedIn = Boolean(user);
  const isAdmin = user?.role === 'admin';

  const visibleLinks = NavLinks.filter((link) => {
    if (link.access === 'public') return true;
    if (link.access === 'admin') return isAdmin;

    return isLoggedIn;
  });

  return (
    <nav className="flex h-20 w-full items-center justify-between border-b border-black">
      {/* <div className="logo">
        <Link href="/">
          <p className="text-2xl font-bold">
            Boilers<span className="text-blue-500">Plate</span>
          </p>
        </Link>
      </div> */}
      <ul className="flex space-x-10">
        {visibleLinks.map((link) => (
          <li key={link.id}>
            <Link
              href={link.path}
              className={
                isActive(link.path)
                  ? 'underline underline-offset-[32px]  decoration-blue-500 decoration-2'
                  : ''
              }
            >
              {t(`links.${link?.name}`)}
            </Link>
          </li>
        ))}
      </ul>
      <div className="flex items-center space-x-6">
        <CurrentUserSwitcher />
        <Link href={pathname} locale="pl">
          {t(`language.pl`)}
        </Link>
        <Link href={pathname} locale="en">
          {t(`language.en`)}
        </Link>
        <ThemeSwitcher className="" />
      </div>
    </nav>
  );
};

export default Navbar;
