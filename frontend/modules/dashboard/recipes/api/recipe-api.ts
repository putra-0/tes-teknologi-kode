import api from "@/lib/http";
import { TableParams, TableResponseApi } from "@/types/api-types";
import { Recipe } from "../data/type";

export type RecipeIndexParams = TableParams & {
  searchBy?: string;
  searchQuery?: string;
  category?: string;
  ingredients?: string[];
};

export type CreateRecipePayload = {
  category: string;
  name: string;
  description?: string | null;
  ingredients: {
    uuid: string;
    qty?: number | null;
    unit: string;
  }[];
};

export type UpdateRecipePayload = {
  name: string;
  description?: string | null;
};

export const recipesService = {
  fetchRecipes: async (params: RecipeIndexParams) => {
    const { data } = await api.get<TableResponseApi<Recipe>>("/recipes", {
      params,
    });
    return data;
  },

  fetchRecipe: async (uuid: string) => {
    const { data } = await api.get(`/recipes/${uuid}`);
    return data;
  },

  addRecipe: async (payload: CreateRecipePayload) => {
    return await api.post("/recipes", payload);
  },

  updateRecipe: async (uuid: string, payload: UpdateRecipePayload) => {
    return await api.put(`/recipes/${uuid}`, payload);
  },

  deleteRecipe: async (uuid: string) => {
    return await api.delete(`/recipes/${uuid}`);
  },
};
