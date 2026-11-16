'use client';

import { Tags } from '#/interfaces';
import { Search, X } from 'lucide-react';
import { useId } from 'react';

import { Dropdown } from '@/ui/Dropdown';

import { SORT_OPTIONS, SortValue } from './usePostsFeed';

// Zwykłe kontrolowane pola, nie Formik (Input/Select z @/ui wymagają
// kontekstu formularza) — filtry działają od razu po zmianie, nie ma tu
// żadnego "wyślij". Listy to Dropdown, ten sam komponent co w formularzach.
const searchClass =
  'h-11 w-full rounded-xs border border-slate-300 bg-white text-sm text-slate-900 outline-none transition-shadow hover:border-slate-400 focus:border-navy focus:ring-2 focus:ring-navy/20';

type PostsToolbarProps = {
  search: string;
  onSearchChange: (value: string) => void;
  tagId: string;
  onTagChange: (value: string) => void;
  sort: SortValue;
  onSortChange: (value: SortValue) => void;
  tags: Tags;
};

export const PostsToolbar = ({
  search,
  onSearchChange,
  tagId,
  onTagChange,
  sort,
  onSortChange,
  tags
}: PostsToolbarProps) => {
  const id = useId();

  return (
    <div
      role="search"
      className="mb-6 grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:grid-cols-2 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)_minmax(0,1fr)]"
    >
      <div className="relative sm:col-span-2 lg:col-span-1">
        <label htmlFor={`${id}-q`} className="sr-only">
          Szukaj w tytułach i treści postów
        </label>
        <Search
          aria-hidden="true"
          className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
        />
        <input
          id={`${id}-q`}
          type="search"
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Szukaj w tytułach i treści…"
          maxLength={100}
          className={`${searchClass} pl-9 pr-9 [&::-webkit-search-cancel-button]:hidden`}
        />
        {search ? (
          <button
            type="button"
            onClick={() => onSearchChange('')}
            aria-label="Wyczyść wyszukiwanie"
            className="absolute right-2 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-700"
          >
            <X aria-hidden="true" className="h-4 w-4" />
          </button>
        ) : null}
      </div>

      <div>
        <Dropdown
          id={`${id}-tag`}
          aria-label="Filtruj po tagu"
          size="md"
          value={tagId}
          onChange={onTagChange}
          options={[
            { value: '', label: 'Wszystkie tagi' },
            ...tags.map((tag) => ({
              value: String(tag.id),
              label: `${tag.name} (${tag.posts_count})`
            }))
          ]}
        />
      </div>

      <div>
        <Dropdown
          id={`${id}-sort`}
          aria-label="Sortowanie"
          size="md"
          value={sort}
          onChange={(value) => onSortChange(value as SortValue)}
          options={[...SORT_OPTIONS]}
        />
      </div>
    </div>
  );
};
