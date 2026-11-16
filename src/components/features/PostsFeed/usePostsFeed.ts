'use client';

import { Post, Tags } from '#/interfaces';
import { useEffect, useState } from 'react';

import { useApiQuery } from '@/hooks/api/useApiQuery';

// 9 = trzy pełne rzędy siatki 3-kolumnowej (lg), a na 2 kolumnach (sm)
// ostatni rząd ma tylko jeden kafel — mniejsze zło niż 8 albo 10.
export const PAGE_SIZE = 9;

// Ta sama whitelist co SORTABLE_FIELDS w backendzie (postController.ts) —
// front wysyła tylko te kombinacje, backend i tak sprawdza jeszcze raz.
export const SORT_OPTIONS = [
  { value: 'created_at:desc', label: 'Najnowsze' },
  { value: 'created_at:asc', label: 'Najstarsze' },
  { value: 'title:asc', label: 'Tytuł A–Z' },
  { value: 'title:desc', label: 'Tytuł Z–A' }
] as const;
export type SortValue = (typeof SORT_OPTIONS)[number]['value'];
const DEFAULT_SORT: SortValue = 'created_at:desc';

// Zapytanie leci dopiero po chwili bez pisania — bez tego każde naciśnięcie
// klawisza w wyszukiwarce to osobny request do API.
const SEARCH_DEBOUNCE_MS = 350;

type PostsPage = { items: Post[]; pagination: { page: number; limit: number; total: number } };

export const usePostsFeed = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [tagId, setTagId] = useState('');
  const [sort, setSort] = useState<SortValue>(DEFAULT_SORT);

  // Każda zmiana filtra/sortowania wraca na 1. stronę — strona 4 starego
  // wyniku zwykle nie istnieje w nowym. Reset w tym samym batchu stanu co
  // zmiana filtra (nie osobnym useEffect), żeby nie poleciało najpierw
  // zapytanie "nowy filtr + stara strona".
  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedSearch((previous) => {
        const next = search.trim();
        if (next !== previous) setPage(1);

        return next;
      });
    }, SEARCH_DEBOUNCE_MS);

    return () => clearTimeout(timeout);
  }, [search]);

  const changeTag = (value: string) => {
    setTagId(value);
    setPage(1);
  };
  const changeSort = (value: SortValue) => {
    setSort(value);
    setPage(1);
  };

  const [sortBy, order] = sort.split(':');

  const { data, isLoading, isFetching } = useApiQuery({
    route: 'POSTS',
    keepPrevious: true,
    values: {
      page,
      limit: PAGE_SIZE,
      sortBy,
      order,
      // puste stringi odfiltrowuje generateRequestUrl (lib/api.ts), więc
      // "brak filtra" = brak parametru w URL-u, tak jak oczekuje backend
      q: debouncedSearch,
      tagId
    }
  });
  const { data: tagsData } = useApiQuery({ route: 'TAGS' });

  const result = data?.error ? undefined : (data as PostsPage | undefined);
  const total = result?.pagination.total ?? 0;
  // Tylko tagi, które mają jakikolwiek post — filtr, który zawsze zwraca
  // pustą listę, tylko by mylił.
  const tags = Array.isArray(tagsData)
    ? (tagsData as Tags).filter((tag) => (tag.posts_count ?? 0) > 0)
    : [];

  const hasFilters = Boolean(debouncedSearch || tagId);
  const resetFilters = () => {
    setSearch('');
    setDebouncedSearch('');
    setTagId('');
    setSort(DEFAULT_SORT);
    setPage(1);
  };

  return {
    posts: result?.items ?? [],
    total,
    totalPages: Math.ceil(total / PAGE_SIZE),
    page,
    setPage,
    search,
    setSearch,
    tagId,
    setTagId: changeTag,
    sort,
    setSort: changeSort,
    tags,
    hasFilters,
    resetFilters,
    isLoading,
    isFetching,
    loadError: data?.error as string | undefined
  };
};
