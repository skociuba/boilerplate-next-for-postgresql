import { Button } from '@/ui/Button';

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
    <nav aria-label="Paginacja" className="flex items-center justify-center gap-1.5 py-6">
      <Button
        type="button"
        variant="noStyling"
        rounded={false}
        label="poprzednia strona"
        handleClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
        className="h-9 w-9 rounded-xs border border-cloud bg-white text-sm hover:border-navy disabled:opacity-40"
      >
        ‹
      </Button>

      {paginationRange.map((item, index) =>
        item === DOTS ? (
          <span key={`dots-${index}`} className="w-9 text-center text-gray-400">
            …
          </span>
        ) : (
          <Button
            key={item}
            type="button"
            variant="noStyling"
            rounded={false}
            label={item === page ? `strona ${item}, bieżąca` : `strona ${item}`}
            handleClick={() => onPageChange(item)}
            className={cn(
              'h-9 w-9 rounded-xs border text-sm',
              item === page
                ? 'border-navy bg-navy text-white'
                : 'border-cloud bg-white hover:border-navy'
            )}
          >
            {item}
          </Button>
        )
      )}

      <Button
        type="button"
        variant="noStyling"
        rounded={false}
        label="następna strona"
        handleClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages}
        className="h-9 w-9 rounded-xs border border-cloud bg-white text-sm hover:border-navy disabled:opacity-40"
      >
        ›
      </Button>
    </nav>
  );
};
