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
    <div className="flex items-center justify-center gap-1.5 py-6">
      <Button
        type="button"
        variant="noStyling"
        rounded={false}
        label="poprzednia strona"
        handleClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
        className="h-9 w-9 rounded-xs border border-cloud text-sm"
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
            handleClick={() => onPageChange(item)}
            className={cn(
              'h-9 w-9 rounded-xs border text-sm',
              item === page ? 'border-navy bg-navy text-white' : 'border-cloud'
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
        className="h-9 w-9 rounded-xs border border-cloud text-sm"
      >
        ›
      </Button>
    </div>
  );
};
