// Adaptacja mechanizmu z system-biletowy-mera-frontend
// (src/components/commons/Pagination/usePagination.ts) — tam liczenie
// zakresu numerów stron było zaszyte w hooku razem z synchronizacją URL-a
// i scrollowaniem (react-scroll, useRouterParams). Tu wyciągnięte jako czysta
// funkcja: dostaje aktualną stronę i liczbę stron, zwraca listę do
// wyrenderowania z kropkami (…) tam, gdzie zakres jest za długi.
export const DOTS = '...' as const;

type PaginationItem = number | typeof DOTS;

const range = (start: number, end: number): number[] =>
  Array.from({ length: end - start + 1 }, (_, index) => start + index);

export const getPaginationRange = ({
  currentPage,
  totalPages,
  siblingCount = 1
}: {
  currentPage: number;
  totalPages: number;
  siblingCount?: number;
}): PaginationItem[] => {
  const safeTotalPages = Math.max(totalPages, 1);
  // ile numerów pokazać zanim w ogóle zaczniemy zwijać w kropki:
  // pierwsza + ostatnia + aktualna + siblingCount z każdej strony + 2 kropki
  const totalPageNumbers = siblingCount + 5;

  if (totalPageNumbers >= safeTotalPages) {
    return range(1, safeTotalPages);
  }

  const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
  const rightSiblingIndex = Math.min(currentPage + siblingCount, safeTotalPages);

  const shouldShowLeftDots = leftSiblingIndex > 2;
  const shouldShowRightDots = rightSiblingIndex < safeTotalPages - 2;

  if (!shouldShowLeftDots && shouldShowRightDots) {
    const leftRange = range(1, 3 + 2 * siblingCount);
    return [...leftRange, DOTS, safeTotalPages];
  }

  if (shouldShowLeftDots && !shouldShowRightDots) {
    const rightItemCount = 3 + 2 * siblingCount;
    const rightRange = range(safeTotalPages - rightItemCount + 1, safeTotalPages);
    return [1, DOTS, ...rightRange];
  }

  const middleRange = range(leftSiblingIndex, rightSiblingIndex);
  return [1, DOTS, ...middleRange, DOTS, safeTotalPages];
};
