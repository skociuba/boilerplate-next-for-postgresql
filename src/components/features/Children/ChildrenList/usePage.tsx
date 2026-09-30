'use client';

import { useState } from 'react';

import { PaginatedChildren } from '#/interfaces';

import { useApiQuery } from '@/hooks/api/useApiQuery';

export type SortField = 'id' | 'name' | 'age' | 'date_of_birth';
export type SortOrder = 'asc' | 'desc';

// Ta sama whitelist co SORTABLE_FIELDS w childController.ts — sortByna
// froncie nigdy nie wysyła nic spoza tej listy, mimo że i tak backend
// sprawdza to jeszcze raz (frontend nie jest granicą bezpieczeństwa)
const SORTABLE_FIELDS: SortField[] = ['id', 'name', 'age', 'date_of_birth'];
const LIMIT_OPTIONS = [5, 10, 25, 50];

export const usePage = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [sortBy, setSortBy] = useState<SortField>('id');
  const [order, setOrder] = useState<SortOrder>('asc');

  // draft = to, co user wpisuje w polach filtra; applied = to, co faktycznie
  // leci do API. Rozdzielone, żeby zapytanie nie leciało przy każdym
  // naciśnięciu klawisza — dopiero po kliknięciu "Filtruj".
  const [nameDraft, setNameDraft] = useState('');
  const [minAgeDraft, setMinAgeDraft] = useState('');
  const [maxAgeDraft, setMaxAgeDraft] = useState('');
  const [appliedFilters, setAppliedFilters] = useState({ name: '', minAge: '', maxAge: '' });

  const { data, isLoading, error } = useApiQuery({
    route: 'CHILDREN',
    values: {
      page,
      limit,
      sortBy,
      order,
      // puste stringi i tak są odfiltrowywane w generateRequestUrl (lib/api.ts)
      // — dokładnie tak samo jak "brak parametru = brak filtra" w childController
      name: appliedFilters.name,
      minAge: appliedFilters.minAge,
      maxAge: appliedFilters.maxAge
    }
  });

  const result = data as PaginatedChildren | undefined;

  const handleSort = (field: SortField) => {
    if (!SORTABLE_FIELDS.includes(field)) return;

    if (sortBy === field && order === 'desc') {
      // trzecie kliknięcie tej samej kolumny = reset do domyślnego sortowania
      setSortBy('id');
      setOrder('asc');
    } else if (sortBy === field && order === 'asc') {
      setOrder('desc');
    } else {
      setSortBy(field);
      setOrder('asc');
    }
    setPage(1);
  };

  const handleApplyFilters = () => {
    setAppliedFilters({ name: nameDraft.trim(), minAge: minAgeDraft, maxAge: maxAgeDraft });
    setPage(1);
  };

  const handleResetFilters = () => {
    setNameDraft('');
    setMinAgeDraft('');
    setMaxAgeDraft('');
    setAppliedFilters({ name: '', minAge: '', maxAge: '' });
    setPage(1);
  };

  const handleLimitChange = (nextLimit: number) => {
    setLimit(nextLimit);
    setPage(1);
  };

  const totalPages = result
    ? Math.max(1, Math.ceil(result.pagination.total / result.pagination.limit))
    : 1;

  return {
    items: result?.items ?? [],
    pagination: result?.pagination,
    totalPages,
    isLoading,
    error: error?.message,
    page,
    setPage,
    limit,
    limitOptions: LIMIT_OPTIONS,
    handleLimitChange,
    sortBy,
    order,
    handleSort,
    nameDraft,
    setNameDraft,
    minAgeDraft,
    setMinAgeDraft,
    maxAgeDraft,
    setMaxAgeDraft,
    handleApplyFilters,
    handleResetFilters
  };
};
