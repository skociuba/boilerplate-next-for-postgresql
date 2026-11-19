import { Link } from '#/navigation';

import { cn } from '@/lib/utils/cn';

export type ButtonProps = {
  fullWidth?: boolean;
  rounded?: boolean;
  children: string | React.ReactNode;
  label?: string;
  type?: 'button' | 'submit' | 'reset' | 'link';
  href?: string; // Kluczowe dla przekierowań
  variant?:
    'primary' | 'secondary' | 'tertiary' | 'quaternary' | 'disabled' | 'download' | 'noStyling';
  disabled?: boolean;
  className?: string;
  handleClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
};

// Każdy wariant ma stan hover — wcześniej przyciski nie reagowały na
// najechanie, przez co nie wyglądały na klikalne.
const ButtonVariants: Record<string, string> = {
  primary:
    'bg-white text-slate-800 border border-slate-300 hover:border-slate-400 hover:bg-slate-50',
  secondary: 'bg-white text-navy border border-slate-300 hover:border-navy hover:bg-navy/4',
  tertiary: 'bg-navy text-white border border-navy hover:bg-[#13203b]',
  quaternary: 'text-navy font-bold hover:underline',
  disabled:
    'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed hover:bg-slate-100',
  download: 'bg-[#212852] text-white hover:bg-[#161c3d]',
  noStyling: 'px-0'
};

export const Button = ({
  fullWidth,
  rounded = true,
  disabled = false,
  children,

  label,
  type = 'button',
  href = '/',
  variant = 'primary',
  handleClick,
  className
}: ButtonProps) => {
  const commonStyles = cn(
    'box-border h-12 cursor-pointer px-6 font-medium inline-flex items-center justify-center text-center transition-colors focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy',
    rounded && 'rounded-xs',
    fullWidth && 'w-full',
    ButtonVariants[variant],
    disabled && ButtonVariants.disabled,
    className
  );

  // Nawigacja wewnętrzna Next.js
  if (type === 'link') {
    return (
      <Link
        href={href}
        aria-label={label}
        className={cn(commonStyles, disabled && 'pointer-events-none opacity-50')}
      >
        {children}
      </Link>
    );
  }

  return (
    <button
      disabled={disabled}
      data-variant={variant}
      type={type as 'button' | 'submit' | 'reset'}
      aria-label={label}
      onClick={handleClick}
      className={commonStyles}
    >
      {children}
    </button>
  );
};
