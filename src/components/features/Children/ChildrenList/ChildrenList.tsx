'use client';

import { Button } from '@/ui/Button';
import { Form } from '@/ui/Form';
import Input from '@/ui/Input';
import Select from '@/ui/Select';
import { Skeleton } from '@/ui/Skeleton/Skeleton';

import { Pagination } from './Pagination';
import { SortableHeader } from './SortableHeader';
import { usePage } from './usePage';

export const ChildrenList = () => {
  const {
    items,
    pagination,
    totalPages,
    isLoading,
    error,
    page,
    setPage,
    limit,
    limitOptions,
    handleLimitChange,
    sortBy,
    order,
    handleSort,
    filterForm,
    limitForm,
    handleResetFilters
  } = usePage();

  return (
    <div className="ml-8 mt-12 min-h-screen">
      <p className="mb-6 max-w-prose text-gray-500">
        Ten sam mechanizm co w Ściągawce Query: <code>page/limit</code> do paginacji,{' '}
        <code>sortBy/order</code> po kliknięciu nagłówka kolumny, <code>name</code> (zawiera),{' '}
        <code>minAge/maxAge</code> (zakres).
      </p>

      <div className="mb-6 flex flex-wrap items-end gap-3">
        <Form form={filterForm} className="flex flex-wrap items-end gap-3">
          <div className="w-40">
            <Input name="name" placeholder="name" />
          </div>
          <div className="w-24">
            <Input name="minAge" type="number" placeholder="minAge" />
          </div>
          <div className="w-24">
            <Input name="maxAge" type="number" placeholder="maxAge" />
          </div>
          <Button type="submit" variant="primary" className="h-11">
            Filtruj
          </Button>
          <Button
            type="button"
            variant="noStyling"
            rounded={false}
            handleClick={handleResetFilters}
            className="h-11 px-4 text-sm text-gray-500"
          >
            Wyczyść
          </Button>
        </Form>

        {/* Osobny <Form> — limit NIE jest częścią filtrów (reaguje od razu,
            "Wyczyść" go nie dotyka), więc dostaje własny mini-formularz
            Formika zamiast dokładania się do filterForm (patrz usePage.tsx) */}
        <Form form={limitForm} className="ml-auto flex items-center gap-2 text-sm">
          na stronę
          <div className="w-20">
            <Select
              name="limit"
              options={limitOptions.map((option) => ({
                value: String(option),
                label: String(option)
              }))}
              onChange={(event) => {
                limitForm.handleChange(event);
                handleLimitChange(Number(event.target.value));
              }}
            />
          </div>
        </Form>
      </div>

      {error ? <p className="mb-4 text-red-700">{error}</p> : null}

      {isLoading ? (
        <Skeleton count={Math.min(limit, 10)} height={40} />
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead className="border-b border-black">
                <tr>
                  <SortableHeader
                    label="ID"
                    field="id"
                    sortBy={sortBy}
                    order={order}
                    onSort={handleSort}
                  />
                  <SortableHeader
                    label="Imię"
                    field="name"
                    sortBy={sortBy}
                    order={order}
                    onSort={handleSort}
                  />
                  <SortableHeader
                    label="Wiek"
                    field="age"
                    sortBy={sortBy}
                    order={order}
                    onSort={handleSort}
                  />
                  <SortableHeader
                    label="Data urodzenia"
                    field="date_of_birth"
                    sortBy={sortBy}
                    order={order}
                    onSort={handleSort}
                  />
                  <th className="px-3 py-2 text-left">Notatki</th>
                </tr>
              </thead>
              <tbody>
                {items.map((child) => (
                  <tr key={child.id} className="border-b border-cloud">
                    <td className="px-3 py-2">{child.id}</td>
                    <td className="px-3 py-2">{child.name}</td>
                    <td className="px-3 py-2">{child.age}</td>
                    <td className="px-3 py-2">
                      {child.date_of_birth
                        ? new Date(child.date_of_birth).toLocaleDateString('pl-PL')
                        : ''}
                    </td>
                    <td className="px-3 py-2 text-gray-500">{child.notes}</td>
                  </tr>
                ))}
                {items.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-3 py-6 text-center text-gray-400">
                      Brak wyników dla tych filtrów.
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>

          {pagination ? (
            <p className="mt-4 text-sm text-gray-500">
              strona {pagination.page} z {totalPages} · {pagination.total} wyników łącznie
            </p>
          ) : null}

          <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </>
      )}
    </div>
  );
};
