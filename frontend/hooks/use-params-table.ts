import { parseSort } from '@/lib/parsers';
import { Sort } from '@/types/api-types';
import { useQueryState, parseAsInteger, parseAsArrayOf } from 'nuqs';
import { z } from 'zod';

export const useParamsTable = <T>() => {
  const [page] = useQueryState('page', parseAsInteger.withDefault(1));
  const [perPage] = useQueryState('perPage', parseAsInteger.withDefault(10));
  const [sortParams] = useQueryState(
    'sort',
    parseAsArrayOf(z.object({ id: z.string(), desc: z.boolean() })).withDefault([{ id: 'createdAt', desc: false }])
  );

  const sort: Sort[] = parseSort(sortParams);

  return {
    page,
    perPage,
    sort,
  };
};
