'use client';

import { Tag } from '#/interfaces';
import { useField } from 'formik';
import { Check, ChevronDown } from 'lucide-react';
import { useEffect, useId, useRef, useState } from 'react';

import { cn } from '@/lib/utils/cn';

import { useApiQuery } from '@/hooks/api/useApiQuery';

// Port dropdownu z checkboxami z system-biletowy-mera-frontend
// (components/commons/Form/Ui/Select/Select.tsx + useSelect.ts) —
// przycisk pokazujący wybrane wartości + rozwijana lista, klik na opcję
// przełącza jej obecność w tablicy. Uproszczony i podpięty pod Formik
// przez useField zamiast tamtejszego FormField/useFormField, bo w tym
// projekcie właśnie tak działa Input (src/components/ui/Input.tsx).
export const TagsMultiSelect = ({ name = 'tag_names' }: { name?: string }) => {
  const { data: tags } = useApiQuery({ route: 'TAGS' });
  const [field, , helpers] = useField<string[]>(name);
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const listId = useId();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selected: string[] = field.value ?? [];

  const toggle = (tagName: string) => {
    helpers.setValue(
      selected.includes(tagName) ? selected.filter((v) => v !== tagName) : [...selected, tagName]
    );
  };

  return (
    <div ref={ref} className="relative w-full">
      {/* Ten sam wygląd co Dropdown (@/ui/Dropdown) — pole, strzałka i
          lista opcji mają wyglądać tak samo w całej aplikacji */}
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={listId}
        aria-label="Tagi"
        onClick={() => setIsOpen((prev) => !prev)}
        onKeyDown={(event) => event.key === 'Escape' && setIsOpen(false)}
        className={cn(
          'flex h-12 w-full items-center justify-between gap-2 overflow-hidden whitespace-nowrap rounded-xs border bg-white pl-4 pr-3 text-left outline-hidden transition-shadow hover:border-slate-400 focus-visible:border-navy focus-visible:ring-2 focus-visible:ring-navy/20',
          isOpen ? 'border-navy ring-2 ring-navy/20' : 'border-slate-300',
          selected.length ? 'text-slate-900' : 'text-slate-400'
        )}
      >
        <span className="truncate">
          {selected.length ? selected.join(', ') : '— wybierz tagi (wielokrotny wybór) —'}
        </span>
        <ChevronDown
          aria-hidden="true"
          className={cn(
            'h-4 w-4 shrink-0 text-slate-500 transition-transform',
            isOpen && 'rotate-180'
          )}
        />
      </button>

      {isOpen ? (
        <div
          id={listId}
          role="listbox"
          aria-multiselectable="true"
          aria-label="Tagi"
          className="absolute z-50 mt-1.5 max-h-64 w-full overflow-y-auto rounded-xs border border-slate-200 bg-white py-1 shadow-lg"
        >
          {tags?.length ? (
            tags.map((tag: Tag) => {
              const isSelected = selected.includes(tag.name as string);

              return (
                <div
                  key={tag.id}
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => toggle(tag.name as string)}
                  className={cn(
                    'flex w-full cursor-pointer items-center gap-3 px-4 py-2.5 hover:bg-slate-100',
                    isSelected ? 'font-semibold text-navy' : 'text-slate-700'
                  )}
                >
                  {/* Własny kwadrat zamiast systemowego checkboxa — ten
                      sam znaczek "Check" co przy wybranej opcji w Dropdown */}
                  <span
                    aria-hidden="true"
                    className={cn(
                      'flex h-4 w-4 shrink-0 items-center justify-center rounded-sm border',
                      isSelected ? 'border-navy bg-navy text-white' : 'border-slate-300 bg-white'
                    )}
                  >
                    {isSelected ? <Check className="h-3 w-3" strokeWidth={3} /> : null}
                  </span>
                  {tag.name}
                </div>
              );
            })
          ) : (
            <div className="px-4 py-3 text-sm text-slate-500">brak tagów — dodaj je na /tags</div>
          )}
        </div>
      ) : null}
    </div>
  );
};
