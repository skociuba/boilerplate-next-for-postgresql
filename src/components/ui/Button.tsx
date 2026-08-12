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
    | 'primary'
    | 'secondary'
    | 'tertiary'
    | 'quaternary'
    | 'disabled'
    | 'download'
    | 'noStyling';
  disabled?: boolean;
  className?: string;
  handleClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
};

const ButtonVariants: Record<string, string> = {
  primary: 'text-black border border-black',
  secondary: 'bg-white text-navy border border-navy',
  tertiary: 'bg-black text-white border border-black',
  quaternary: 'text-navy font-bold',
  disabled: 'bg-cloud text-gray border border-cloud',
  download: 'bg-[#212852] text-white',
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
    'box-border h-14 cursor-pointer px-6 leading-base md:text-base inline-flex items-center justify-center text-center transition-colors',
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
