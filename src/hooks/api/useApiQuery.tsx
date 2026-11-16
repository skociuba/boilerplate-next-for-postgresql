import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { toast } from 'react-toastify';

import { fetchRequest } from '@/lib/api';

import { ApiKeysType } from './apiEndpoints';

export type UseApiQueryProps = {
  route: ApiKeysType;
  getFile?: boolean;
  id?: string;
  refresh?: boolean;
  params?: { [key: string]: string };
  values?: {
    [key: string]: string | string[] | number | boolean | File | null;
  };
  enabled?: boolean;
  // Listy z paginacją/filtrami: przy zmianie strony pokazuj poprzednie
  // dane, dopóki nie przyjdą nowe — bez tego data na chwilę staje się
  // undefined i lista mignęłaby pustym stanem ("Brak postów").
  keepPrevious?: boolean;
};

export const useApiQuery = ({ refresh, keepPrevious, ...props }: UseApiQueryProps) => {
  const { route, id, params } = props;
  const paramsArr = params ? [...Object.values(params)] : [];

  const { data, ...query } = useQuery({
    // props.values dorzucony do klucza — bez tego zmiana page/limit/sortBy
    // (przekazywanych przez values, nie params) nie zmieniała queryKey, więc
    // react-query nigdy sam nie odpytywał API ponownie przy zmianie strony.
    queryKey: [route, id, ...paramsArr, props.values],
    enabled: typeof props.enabled === 'boolean' ? props.enabled : true,
    placeholderData: keepPrevious ? keepPreviousData : undefined,
    queryFn: () =>
      fetchRequest({
        refresh,
        method: 'GET',
        ...props
      }).then((data) => {
        if (data?.status && data.status === 403) {
          toast('Brak dostepu', {
            position: 'bottom-left',
            autoClose: 5000,
            hideProgressBar: false,
            type: 'error',
            theme: 'colored'
          });
        }

        return data;
      })
    // useErrorBoundary: true,
  });

  return { data: data, ...query };
};
