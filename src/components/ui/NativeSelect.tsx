import { ChevronDown } from 'lucide-react';
import { ComponentProps, forwardRef } from 'react';

import { cn } from '@/lib/utils/cn';

export type SelectOption = { value: string; label: string };

export type NativeSelectProps = {
  options: SelectOption[];
  invalid?: boolean;
  size?: 'md' | 'lg';
} & Omit<ComponentProps<'select'>, 'size'>;

// Prawdziwy <select> z wyglądem spójnym z Input: appearance-none zdejmuje
// systemową strzałkę i szare tło (które Chrome, Firefox i Safari rysują
// każdy inaczej), a w jej miejsce idzie ta sama ikona na każdej przeglądarce.
// Natywny element zostaje celowo — klawiatura, czytniki ekranu i
// systemowa lista wyboru na telefonie działają bez żadnego dodatkowego kodu.
export const NativeSelect = forwardRef<HTMLSelectElement, NativeSelectProps>(
  ({ options, invalid, size = 'lg', className, ...props }, ref) => (
    <div className="relative w-full">
      <select
        ref={ref}
        aria-invalid={invalid || undefined}
        {...props}
        className={cn(
          'w-full cursor-pointer appearance-none rounded-xs border bg-white pl-4 pr-10 text-slate-900 outline-none transition-shadow',
          'hover:border-slate-400 focus:ring-2 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400',
          size === 'lg' ? 'h-12' : 'h-11 text-sm',
          invalid
            ? 'border-error focus:ring-error/20'
            : 'border-slate-300 focus:border-navy focus:ring-navy/20',
          className
        )}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <ChevronDown
        aria-hidden="true"
        className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500"
      />
    </div>
  )
);

NativeSelect.displayName = 'NativeSelect';
