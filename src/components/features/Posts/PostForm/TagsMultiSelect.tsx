'use client';

import { useField } from 'formik';
import { useEffect, useRef, useState } from 'react';

import { Tag } from '#/interfaces';

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
      selected.includes(tagName)
        ? selected.filter((v) => v !== tagName)
        : [...selected, tagName]
    );
  };

  return (
    <div ref={ref} className="relative w-full">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={cn(
          'flex h-12 w-full items-center justify-between overflow-hidden whitespace-nowrap rounded-xs border border-cloud px-5 text-left focus:border-navy',
          selected.length ? 'text-black' : 'text-gray-400'
        )}
      >
        <span className="truncate">
          {selected.length ? selected.join(', ') : '— wybierz tagi (wielokrotny wybór) —'}
        </span>
        <span className="ml-2 shrink-0 text-gray-400">{isOpen ? '▲' : '▼'}</span>
      </button>

      {isOpen ? (
        <div className="absolute z-50 mt-1.5 max-h-56 w-full overflow-y-auto rounded-xs border border-cloud bg-white shadow-md">
          {tags?.length ? (
            tags.map((tag: Tag) => {
              const isSelected = selected.includes(tag.name as string);
              return (
                <div
                  key={tag.id}
                  onClick={() => toggle(tag.name as string)}
                  className={cn(
                    'flex h-12 w-full cursor-pointer items-center gap-2 border-t border-cloud px-5 first:border-t-0 hover:bg-gray-50',
                    isSelected && 'bg-blue-50 font-bold'
                  )}
                >
                  <input type="checkbox" readOnly checked={isSelected} className="pointer-events-none" />
                  {tag.name}
                </div>
              );
            })
          ) : (
            <div className="px-5 py-3 text-sm text-gray-400">brak tagów — dodaj je na /tags</div>
          )}
        </div>
      ) : null}
    </div>
  );
};
