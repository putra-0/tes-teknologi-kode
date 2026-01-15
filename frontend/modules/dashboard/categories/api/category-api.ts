import api from "@/lib/http";
import { TableParams, TableResponseApi } from "@/types/api-types";
import { Category } from "../data/type";

export interface CreateCategoryPayload {
  name: string;
}

export interface UpdateCategoryPayload {
  name: string;
}

export const categoriesService = {
  fetchCategories: async (params: TableParams) => {
    const { data } = await api.get<TableResponseApi<Category>>("/categories", {
      params,
    });
    return data;
  },
  addCategory: async (data: CreateCategoryPayload) => {
    return await api.post("/categories", data);
  },
  updateCategory: async (uuid: string, data: UpdateCategoryPayload) => {
    return await api.put(`/categories/${uuid}`, data);
  },
  deleteCategory: async (uuid: string) => {
    return await api.delete(`/categories/${uuid}`);
  },
};
