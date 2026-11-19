import { useField } from 'formik';
import { Eye, EyeOff } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { ComponentProps, useState } from 'react';

import { cn } from '@/lib/utils/cn';

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
          // Pola nie mają widocznej etykiety, tylko placeholder — który znika
          // przy wpisywaniu i nie jest odczytywany jako nazwa pola przez
          // wszystkie czytniki ekranu. aria-label daje polu stałą nazwę.
          aria-label={props['aria-label'] ?? (placeholder ? t(`label.${placeholder}`) : undefined)}
          aria-invalid={displayError ? true : undefined}
          // dla password: przełącznik pokaż/ukryj. Dla wszystkiego innego
          // (date, email, number...) faktycznie respektujemy przekazany
          // "type" — wcześniej każdy typ poza "password" i tak lądował
          // jako zwykły "text", co ciche psuło np. natywny date-picker
          type={type === 'password' ? (isPasswordType ? 'password' : 'text') : (type ?? 'text')}
          className={cn(
            'h-12 w-full rounded-xs border bg-white px-4 text-slate-900 outline-hidden transition-shadow placeholder:text-slate-400 focus:ring-2',
            // wcześniej focus:border-cloud nadpisywał focus:border-navy, więc
            // kliknięte pole w ogóle nie zmieniało wyglądu
            displayError
              ? 'border-error focus:border-error focus:ring-error/20'
              : 'border-slate-300 focus:border-navy focus:ring-navy/15',
            type === 'password' && 'pr-12',
            className
          )}
        />
        {type === 'password' && (
          // Ikona oka zamiast przekreślenia z CSS (po kliknięciu znikało
          // całkiem i nie było wiadomo, jak hasło z powrotem ukryć).
          <button
            type="button"
            onClick={() => setIsPasswordType((prevState) => !prevState)}
            aria-label={isPasswordType ? 'Pokaż hasło' : 'Ukryj hasło'}
            className="absolute inset-y-0 right-0 flex w-12 items-center justify-center text-slate-500 hover:text-navy"
          >
            {isPasswordType ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
          </button>
        )}
      </div>
      {displayError && <span className="px-1 text-sm text-error">{displayError}</span>}
    </div>
  );
};

export default Input;
