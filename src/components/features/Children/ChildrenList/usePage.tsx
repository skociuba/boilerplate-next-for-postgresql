'use client';

import { PaginatedChildren } from '#/interfaces';
import { useState } from 'react';

import { useForm } from '@/ui/useForm';

import { useApiQuery } from '@/hooks/api/useApiQuery';

import { filterInitialValues } from './pageModel';

export type SortField = 'id' | 'name' | 'age' | 'date_of_birth';
export type SortOrder = 'asc' | 'desc';

// Ta sama whitelist co SORTABLE_FIELDS w childController.ts — sortBy na
// froncie nigdy nie wysyła nic spoza tej listy, mimo że i tak backend
// sprawdza to jeszcze raz (frontend nie jest granicą bezpieczeństwa)
const SORTABLE_FIELDS: SortField[] = ['id', 'name', 'age', 'date_of_birth'];
const LIMIT_OPTIONS = [5, 10, 25, 50];

export const usePage = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [sortBy, setSortBy] = useState<SortField>('id');
  const [order, setOrder] = useState<SortOrder>('asc');

  // appliedFilters = to, co faktycznie leci do API. Formik (filterForm)
  // trzyma tylko DRAFT — zapytanie nie leci przy każdym naciśnięciu
  // klawisza, dopiero po submit (onSubmit niżej).
  const [appliedFilters, setAppliedFilters] = useState({ name: '', minAge: '', maxAge: '' });

  const filterForm = useForm({
    initialValues: filterInitialValues,
    onSubmit: (values) => {
      setAppliedFilters({
        name: (values.name as string).trim(),
        minAge: values.minAge as string,
        maxAge: values.maxAge as string
      });
      setPage(1);
    }
  });

  // Select (jak Input) wymaga kontekstu Formika — ale limit NIE jest
  // częścią filtrów (reaguje natychmiast na onChange, nie czeka na submit,
  // i "Wyczyść" filtrów celowo go nie rusza), więc dostaje WŁASNY, osobny
  // mini-formularz zamiast dokładania się do filterForm.
  const limitForm = useForm({
    initialValues: { limit: String(limit) },
    onSubmit: () => {}
  });

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

  const handleResetFilters = () => {
    filterForm.resetForm();
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
    filterForm,
    limitForm,
    handleResetFilters
  };
};
