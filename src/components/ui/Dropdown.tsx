'use client';

import { Check, ChevronDown } from 'lucide-react';
import { KeyboardEvent, useEffect, useId, useRef, useState } from 'react';

import { cn } from '@/lib/utils/cn';

export type SelectOption = { value: string; label: string };

export type DropdownProps = {
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  id?: string;
  invalid?: boolean;
  size?: 'md' | 'lg';
  className?: string;
  placeholder?: string;
  'aria-label'?: string;
  'aria-labelledby'?: string;
  onBlur?: () => void;
};

// Własna lista zamiast <select>: rozwinięta lista natywnego selecta to
// systemowe okienko, którego nie da się ostylować (w każdej przeglądarce
// i systemie wygląda inaczej). Wygląd jak TagsMultiSelect, tylko wybór
// jednej opcji.
//
// Dostępność według wzorca "select-only combobox" z WAI-ARIA APG: fokus
// zostaje na polu (role="combobox"), aktywną opcję wskazuje
// aria-activedescendant, a klawiatura działa jak w natywnym selekcie —
// strzałki, Home/End, Enter/spacja, Esc, Tab i pisanie pierwszych liter.
export const Dropdown = ({
  options,
  value,
  onChange,
  id,
  invalid,
  size = 'lg',
  className,
  placeholder = '— wybierz —',
  onBlur,
  ...aria
}: DropdownProps) => {
  const generatedId = useId();
  const baseId = id ?? generatedId;
  const listboxId = `${baseId}-listbox`;
  const optionId = (index: number) => `${baseId}-option-${index}`;

  const [isOpen, setIsOpen] = useState(false);
  const selectedIndex = options.findIndex((option) => option.value === value);
  const [activeIndex, setActiveIndex] = useState(Math.max(selectedIndex, 0));
  const rootRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const typeahead = useRef({ text: '', timeout: 0 });

  const open = () => {
    setActiveIndex(Math.max(selectedIndex, 0));
    setIsOpen(true);
  };
  const choose = (index: number) => {
    const option = options[index];
    if (option) onChange(option.value);
    setIsOpen(false);
  };

  // Klik poza listą zamyka ją, tak jak w TagsMultiSelect
  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setIsOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  // Przy długiej liście aktywna opcja (strzałkami) musi być widoczna
  useEffect(() => {
    if (!isOpen) return;
    listRef.current
      ?.querySelector(`#${CSS.escape(optionId(activeIndex))}`)
      ?.scrollIntoView?.({ block: 'nearest' });
    // optionId zależy tylko od baseId, które się nie zmienia
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeIndex, isOpen]);

  // Pisanie liter skacze do pierwszej pasującej opcji (jak w <select>);
  // litery wpisane w ciągu pół sekundy składają się w jedną frazę
  const handleTypeahead = (key: string) => {
    window.clearTimeout(typeahead.current.timeout);
    typeahead.current.text += key.toLowerCase();
    typeahead.current.timeout = window.setTimeout(() => (typeahead.current.text = ''), 500);
    const match = options.findIndex((option) =>
      option.label.toLowerCase().startsWith(typeahead.current.text)
    );
    if (match === -1) return;
    if (isOpen) setActiveIndex(match);
    else onChange(options[match].value);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const last = options.length - 1;

    switch (event.key) {
      case 'ArrowDown':
      case 'ArrowUp': {
        event.preventDefault();
        if (!isOpen) {
          open();

          return;
        }
        const step = event.key === 'ArrowDown' ? 1 : -1;
        setActiveIndex((index) => Math.min(last, Math.max(0, index + step)));

        return;
      }
      case 'Home':
      case 'End':
        if (!isOpen) return;
        event.preventDefault();
        setActiveIndex(event.key === 'Home' ? 0 : last);

        return;
      case 'Enter':
      case ' ':
        event.preventDefault();
        if (isOpen) choose(activeIndex);
        else open();

        return;
      case 'Escape':
        if (isOpen) {
          event.preventDefault();
          setIsOpen(false);
        }

        return;
      case 'Tab':
        // Tab wybiera podświetloną opcję i idzie dalej, jak natywny select
        if (isOpen) choose(activeIndex);

        return;
      default:
        if (event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey) {
          handleTypeahead(event.key);
        }
    }
  };

  const selected = options[selectedIndex];

  return (
    <div ref={rootRef} className={cn('relative w-full', className)}>
      <div
        id={baseId}
        role="combobox"
        tabIndex={0}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={listboxId}
        aria-activedescendant={isOpen ? optionId(activeIndex) : undefined}
        aria-invalid={invalid || undefined}
        {...aria}
        onClick={() => (isOpen ? setIsOpen(false) : open())}
        onKeyDown={handleKeyDown}
        onBlur={onBlur}
        className={cn(
          'flex w-full cursor-pointer select-none items-center justify-between gap-2 rounded-xs border bg-white pl-4 pr-3 text-left text-slate-900 outline-hidden transition-shadow',
          'hover:border-slate-400 focus-visible:ring-2',
          size === 'lg' ? 'h-12' : 'h-11 text-sm',
          invalid
            ? 'border-error focus-visible:ring-error/20'
            : cn(
                'border-slate-300 focus-visible:border-navy focus-visible:ring-navy/20',
                isOpen && 'border-navy ring-2 ring-navy/20'
              )
        )}
      >
        <span className={cn('truncate', !selected && 'text-slate-400')}>
          {selected ? selected.label : placeholder}
        </span>
        <ChevronDown
          aria-hidden="true"
          className={cn(
            'h-4 w-4 shrink-0 text-slate-500 transition-transform',
            isOpen && 'rotate-180'
          )}
        />
      </div>

      {/* Lista zostaje w DOM-ie także zamknięta (hidden), żeby
          aria-controls zawsze wskazywało istniejący element */}
      <ul
        ref={listRef}
        id={listboxId}
        role="listbox"
        aria-labelledby={aria['aria-labelledby']}
        aria-label={aria['aria-label']}
        hidden={!isOpen}
        className="absolute z-50 mt-1.5 max-h-64 w-full overflow-y-auto rounded-xs border border-slate-200 bg-white py-1 shadow-lg"
      >
        {options.map((option, index) => {
          const isSelected = index === selectedIndex;

          return (
            <li
              key={option.value}
              id={optionId(index)}
              role="option"
              aria-selected={isSelected}
              // mousedown zamiast click + preventDefault: inaczej fokus
              // ucieka z pola, zanim wybór się zapisze
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => choose(index)}
              onMouseMove={() => setActiveIndex(index)}
              className={cn(
                'flex cursor-pointer items-center justify-between gap-3 px-4 py-2.5',
                size === 'md' && 'text-sm',
                index === activeIndex && 'bg-slate-100',
                isSelected ? 'font-semibold text-navy' : 'text-slate-700'
              )}
            >
              <span className="truncate">{option.label}</span>
              {isSelected ? <Check aria-hidden="true" className="h-4 w-4 shrink-0" /> : null}
            </li>
          );
        })}
      </ul>
    </div>
  );
};
