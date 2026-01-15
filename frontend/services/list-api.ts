import api from "@/lib/http";
import { ListResponseApi } from "@/types/api-types";
import {
  TaskStatus
} from "@/types/list-types";

export const listService = {
  fetchTaskStatus: async () => {
    const { data } = await api.get<ListResponseApi<TaskStatus>>(
      "/lists/task-statuses"
    );
    return data;
  },
};
