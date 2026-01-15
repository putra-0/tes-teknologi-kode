import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useParamsTable } from "@/hooks/use-params-table";
import { categoriesService } from "../api/category-api";

export const useCategories = () => {
  const { page, perPage, sort } = useParamsTable();

  const sortKey = JSON.stringify(sort);
  
  return useQuery({
    queryKey: ["categories", { page, perPage, sortKey }],
    queryFn: () =>
      categoriesService.fetchCategories({
        page,
        perPage,
        sort,
      }),
    staleTime: 0,
    placeholderData: keepPreviousData,
  });
};
