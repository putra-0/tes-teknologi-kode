import api from "@/lib/http";
import { TableParams, TableResponseApi } from "@/types/api-types";
import { Recipe } from "../data/type";

export type RecipeIndexParams = TableParams & {
  searchBy?: string;
  searchQuery?: string;
  category?: string;
  ingredients?: string[];
};

export const recipesService = {
  fetchRecipes: async (params: RecipeIndexParams) => {
    const { data } = await api.get<TableResponseApi<Recipe>>("/recipes", {
      params,
    });
    return data;
  },
};
