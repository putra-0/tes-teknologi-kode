import api from "@/lib/http";
import { ListResponseApi, ResponseApi } from "@/types/api-types";
import {
  CategoryListItem,
  IngredientListItem,
  TaskStatus
} from "@/types/list-types";

type ListDataResponseApi<T> = ResponseApi & {
  data: T[];
};

export const listService = {
  fetchTaskStatus: async () => {
    const { data } = await api.get<ListResponseApi<TaskStatus>>(
      "/lists/task-statuses"
    );
    return data;
  },

  fetchCategories: async () => {
    const { data } = await api.get<ListDataResponseApi<CategoryListItem>>(
      "/lists/categories"
    );

    return data;
  },

  fetchIngredients: async () => {
    const { data } = await api.get<ListDataResponseApi<IngredientListItem>>(
      "/lists/ingredients"
    );

    return data;
  },
};
