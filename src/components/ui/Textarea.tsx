import { useField } from 'formik';
import { useTranslations } from 'next-intl';
import { ComponentProps } from 'react';

import { cn } from '@/lib/utils/cn';

export type TextareaProps = {
  className?: string;
  error?: string;
  name: string;
} & Omit<ComponentProps<'textarea'>, 'name'>;

// Odpowiednik Input.tsx dla dłuższego tekstu (treść posta) — ten sam
// kontrakt (Formik przez useField, placeholder z tłumaczeń form.label.*,
// błąd pod polem), żeby w formularzu dało się je stosować zamiennie.
const Textarea = ({ className, error, placeholder, name, rows = 6, ...props }: TextareaProps) => {
  const t = useTranslations('form');
  const [field, meta] = useField(name);

  const displayError = error || (meta.touched && meta.error ? meta.error : '');
  const label = placeholder ? t(`label.${placeholder}`) : undefined;

  return (
    <div className="flex flex-col gap-1">
      <textarea
        {...field}
        {...props}
        // Formik trzyma tu czasem null (np. post bez treści z API) — textarea
        // z value={null} ostrzega w Reakcie i przestaje być kontrolowana.
        value={field.value ?? ''}
        rows={rows}
        placeholder={label ?? ''}
        aria-label={props['aria-label'] ?? label}
        aria-invalid={displayError ? true : undefined}
        className={cn(
          // resize-y: user może powiększyć pole w pionie, ale nie rozepchnie
          // go w poziomie poza ekran telefonu
          'w-full resize-y rounded-xs border bg-white px-4 py-3 text-slate-900 outline-hidden transition-shadow placeholder:text-slate-400 focus:ring-2',
          displayError
            ? 'border-error focus:border-error focus:ring-error/20'
            : 'border-slate-300 focus:border-navy focus:ring-navy/15',
          className
        )}
      />
      {displayError && <span className="px-1 text-sm text-error">{displayError}</span>}
    </div>
  );
};

export default Textarea;
