import { listService } from "@/services/list-api";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

export const useListTaskStatus = () => {
  return useQuery({
    queryKey: ["task-status-list"],
    queryFn: async () => await listService.fetchTaskStatus(),
    placeholderData: keepPreviousData,
  });
};
