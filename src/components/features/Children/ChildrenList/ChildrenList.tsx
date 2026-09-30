'use client';

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
    nameDraft,
    setNameDraft,
    minAgeDraft,
    setMinAgeDraft,
    maxAgeDraft,
    setMaxAgeDraft,
    handleApplyFilters,
    handleResetFilters
  } = usePage();

  return (
    <div className="ml-8 mt-12 min-h-screen">
      <p className="mb-6 max-w-prose text-gray-500">
        Ten sam mechanizm co w Ściągawce Query: <code>page/limit</code> do paginacji,{' '}
        <code>sortBy/order</code> po kliknięciu nagłówka kolumny, <code>name</code> (zawiera),{' '}
        <code>minAge/maxAge</code> (zakres).
      </p>

      <form
        onSubmit={(event) => {
          event.preventDefault();
          handleApplyFilters();
        }}
        className="mb-6 flex flex-wrap items-end gap-3"
      >
        <label className="flex flex-col gap-1 text-sm">
          imię zawiera
          <input
            value={nameDraft}
            onChange={(event) => setNameDraft(event.target.value)}
            placeholder="np. ala"
            className="h-10 w-40 rounded-xs border border-cloud px-3 outline-0 focus:border-navy"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          wiek od
          <input
            type="number"
            min={0}
            value={minAgeDraft}
            onChange={(event) => setMinAgeDraft(event.target.value)}
            className="h-10 w-24 rounded-xs border border-cloud px-3 outline-0 focus:border-navy"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          wiek do
          <input
            type="number"
            min={0}
            value={maxAgeDraft}
            onChange={(event) => setMaxAgeDraft(event.target.value)}
            className="h-10 w-24 rounded-xs border border-cloud px-3 outline-0 focus:border-navy"
          />
        </label>
        <button type="submit" className="h-10 rounded-xs border border-black px-4 text-sm">
          Filtruj
        </button>
        <button type="button" onClick={handleResetFilters} className="h-10 px-4 text-sm text-gray-500">
          Wyczyść
        </button>

        <label className="ml-auto flex items-center gap-2 text-sm">
          na stronę
          <select
            value={limit}
            onChange={(event) => handleLimitChange(Number(event.target.value))}
            className="h-10 rounded-xs border border-cloud px-2"
          >
            {limitOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>
      </form>

      {error ? <p className="mb-4 text-red-700">{error}</p> : null}

      {isLoading ? (
        <Skeleton count={Math.min(limit, 10)} height={40} />
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead className="border-b border-black">
                <tr>
                  <SortableHeader label="ID" field="id" sortBy={sortBy} order={order} onSort={handleSort} />
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
                      {child.date_of_birth ? new Date(child.date_of_birth).toLocaleDateString('pl-PL') : ''}
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
