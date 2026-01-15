import api from "@/lib/http";
import { TableParams, TableResponseApi } from "@/types/api-types";
import { Ingredient } from "../data/type";

export interface CreateIngredientPayload {
  name: string;
}

export interface UpdateIngredientPayload {
  name: string;
}

export const ingredientsService = {
  fetchIngredients: async (params: TableParams) => {
    const { data } = await api.get<TableResponseApi<Ingredient>>("/ingredients", {
      params,
    });
    return data;
  },
  addIngredient: async (data: CreateIngredientPayload) => {
    return await api.post("/ingredients", data);
  },
  updateIngredient: async (uuid: string, data: UpdateIngredientPayload) => {
    return await api.put(`/ingredients/${uuid}`, data);
  },
  deleteIngredient: async (uuid: string) => {
    return await api.delete(`/ingredients/${uuid}`);
  },
};
