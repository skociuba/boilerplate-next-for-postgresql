import { Button } from '@/ui/Button';

import { cn } from '@/lib/utils/cn';

import { SortField, SortOrder } from './usePage';

type SortableHeaderProps = {
  label: string;
  field: SortField;
  sortBy: SortField;
  order: SortOrder;
  onSort: (field: SortField) => void;
};

// Adaptacja TableHeader.tsx z system-biletowy-mera-frontend — tam strzałka
// sortowania była ikonką z i18n-owaną etykietą kolumny; tu bez zależności
// od i18next, sama logika "kliknięcie nagłówka = cykl asc → desc → reset"
export const SortableHeader = ({ label, field, sortBy, order, onSort }: SortableHeaderProps) => {
  const isActive = sortBy === field;

  return (
    <th className="px-3 py-2 text-left">
      <Button
        type="button"
        variant="noStyling"
        rounded={false}
        handleClick={() => onSort(field)}
        className={cn(
          'h-auto flex items-center gap-1 text-sm font-semibold',
          isActive ? 'text-navy' : 'text-black'
        )}
      >
        {label}
        <span className="w-3 text-xs text-navy">
          {isActive ? (order === 'asc' ? '▲' : '▼') : ''}
        </span>
      </Button>
    </th>
  );
};
