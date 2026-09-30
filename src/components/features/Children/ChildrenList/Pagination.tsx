import { cn } from '@/lib/utils/cn';

import { DOTS, getPaginationRange } from './usePagination';

type PaginationProps = {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

export const Pagination = ({ page, totalPages, onPageChange }: PaginationProps) => {
  if (totalPages <= 1) return null;

  const paginationRange = getPaginationRange({ currentPage: page, totalPages });

  return (
    <div className="flex items-center justify-center gap-1.5 py-6">
      <button
        type="button"
        aria-label="poprzednia strona"
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
        className="h-9 w-9 rounded-xs border border-cloud text-sm disabled:opacity-30"
      >
        ‹
      </button>

      {paginationRange.map((item, index) =>
        item === DOTS ? (
          <span key={`dots-${index}`} className="w-9 text-center text-gray-400">
            …
          </span>
        ) : (
          <button
            key={item}
            type="button"
            onClick={() => onPageChange(item)}
            aria-current={item === page ? 'page' : undefined}
            className={cn(
              'h-9 w-9 rounded-xs border text-sm',
              item === page ? 'border-navy bg-navy text-white' : 'border-cloud'
            )}
          >
            {item}
          </button>
        )
      )}

      <button
        type="button"
        aria-label="następna strona"
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages}
        className="h-9 w-9 rounded-xs border border-cloud text-sm disabled:opacity-30"
      >
        ›
      </button>
    </div>
  );
};
