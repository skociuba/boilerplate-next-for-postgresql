import { Link } from '#/navigation';
import { useTranslations } from 'next-intl';
import { ReactNode } from 'react';

import { cn } from '@/lib/utils/cn';

export type BreakpointsListProps = {
  breakpoints?: { href?: string; dynamic?: boolean; children?: ReactNode }[];
  hideOnMobile?: boolean;
};

export const BreakpointsList = ({ breakpoints, hideOnMobile }: BreakpointsListProps) => {
  const t = useTranslations('breakpoints');

  if (!breakpoints) {
    return null;
  }

  return (
    <p
      className={cn(
        'flex flex-wrap gap-1 pb-2 text-sm text-slate-500',
        hideOnMobile && 'hidden md:flex'
      )}
    >
      {breakpoints.map(({ href, children, dynamic }, index) => (
        <span key={`${href}-${index}`} className={cn('flex gap-1', !href && 'text-slate-700')}>
          {href ? (
            <Link {...{ href, className: 'hover:text-navy hover:underline' }}>
              {dynamic ? children : t(`panel.links.${children}`)}
            </Link>
          ) : dynamic ? (
            children
          ) : (
            t(`panel.links.${children}`)
          )}
          {index + 1 < breakpoints.length ? (
            <span aria-hidden="true" className="text-slate-400">
              /
            </span>
          ) : null}
        </span>
      ))}
    </p>
  );
};
