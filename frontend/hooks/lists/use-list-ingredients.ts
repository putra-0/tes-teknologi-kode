import { listService } from "@/services/list-api";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

export const useListIngredients = () => {
  return useQuery({
    queryKey: ["ingredients-list"],
    queryFn: async () => await listService.fetchIngredients(),
    placeholderData: keepPreviousData,
  });
};
