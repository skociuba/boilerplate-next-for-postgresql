'use client';

import { cn } from '@/lib/utils/cn';

import { usePage } from './usePage';

export const ActivateStatus = () => {
  const { status, message } = usePage();

  return (
    <p
      className={cn(
        'mx-auto mt-8 max-w-sm text-sm',
        status === 'error' && 'text-red-700',
        status === 'success' && 'text-green-700',
        status === 'pending' && 'text-gray-500'
      )}
    >
      {status === 'pending' ? 'Potwierdzanie…' : message}
    </p>
  );
};
