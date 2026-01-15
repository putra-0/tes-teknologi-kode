import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useParamsTable } from "@/hooks/use-params-table";
import { ingredientsService } from "../api/ingredient-api";

export const useIngredients = () => {
  const { page, perPage, sort } = useParamsTable();

  return useQuery({
    queryKey: ["ingredients", { page, perPage, sort }],
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
