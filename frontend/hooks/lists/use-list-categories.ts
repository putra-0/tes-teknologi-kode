import { listService } from "@/services/list-api";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

export const useListCategories = () => {
  return useQuery({
    queryKey: ["categories-list"],
    queryFn: async () => await listService.fetchCategories(),
    placeholderData: keepPreviousData,
  });
};
