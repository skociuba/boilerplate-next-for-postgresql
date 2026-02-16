import { useField } from 'formik';
import { useTranslations } from 'next-intl';
import { ComponentProps, useState } from 'react';

import { cn } from '../../lib/utils/cn';

export type InputProps = {
  className?: string;
  error?: string;
  name: string;
} & Omit<ComponentProps<'input'>, 'name'>;

const Input = ({ className, error, type, placeholder, name, ...props }: InputProps) => {
  const t = useTranslations('form');
  const [isPasswordType, setIsPasswordType] = useState(type === 'password');
  const [field, meta] = useField(name);

  const displayError = error || (meta.touched && meta.error ? meta.error : '');

  return (
    <div className="flex flex-col gap-1">
      <div className={cn(type === 'password' && 'relative')}>
        <input
          {...field}
          {...props}
          placeholder={placeholder ? t(`label.${placeholder}`) : ''}
          type={isPasswordType ? 'password' : 'text'}
          className={cn(
            'focus:border-1 rounded-xs focus:border-navy h-12 w-full border px-6 outline-0',
            displayError ? 'border-error focus:border-error' : 'border-cloud focus:border-cloud',
            className
          )}
        />
        {type === 'password' && (
          <button
            tabIndex={-1}
            type="button"
            onClick={() => setIsPasswordType((prevState) => !prevState)}
            className={cn(
              isPasswordType
                ? 'after:absolute after:right-2 after:top-1/2 after:h-px after:w-8 after:-translate-y-1/2 after:-rotate-45 after:bg-black'
                : ''
            )}
          />
        )}
      </div>
      {displayError && <span className="text-red-700 text-sm px-2">{displayError}</span>}
    </div>
  );
};

export default Input;
