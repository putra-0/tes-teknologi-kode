import { getSortingStateParser, parseSort } from "@/lib/parsers";
import { Sort } from "@/types/api-types";
import { parseAsInteger, useQueryState } from "nuqs";

export const useParamsTable = <T>() => {
  const [page] = useQueryState("page", parseAsInteger.withDefault(1));
  const [perPage] = useQueryState("perPage", parseAsInteger.withDefault(10));
  const [sortParams] = useQueryState(
    "sort",
    getSortingStateParser<T>().withDefault([])
  );

  const sort: Sort[] = parseSort(sortParams);

  return {
    page,
    perPage,
    sort,
  };
};
