import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useParamsTable } from "@/hooks/use-params-table";
import { ingredientsService } from "../api/ingredient-api";

export const useIngredients = () => {
  const { page, perPage, sort } = useParamsTable();

  const sortKey = JSON.stringify(sort);

  return useQuery({
    queryKey: ["ingredients", { page, perPage, sortKey }],
    queryFn: () =>
      ingredientsService.fetchIngredients({
        page,
        perPage,
        sort,
      }),
    staleTime: 0,
    placeholderData: keepPreviousData,
  });
};
