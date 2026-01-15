import { keepPreviousData, useQuery } from "@tanstack/react-query";
import {
  parseAsArrayOf,
  parseAsString,
  useQueryState,
} from "nuqs";

import { useParamsTable } from "@/hooks/use-params-table";
import { recipesService } from "../api/recipe-api";

const ARRAY_SEPARATOR = ",";

export const useRecipes = () => {
  const { page, perPage, sort } = useParamsTable();

  const [searchBy] = useQueryState("searchBy", parseAsString);
  const [searchQuery] = useQueryState("searchQuery", parseAsString);
  const [categoryParams] = useQueryState(
    "category",
    parseAsArrayOf(parseAsString, ARRAY_SEPARATOR).withDefault([])
  );
  const [ingredientParams] = useQueryState(
    "ingredients",
    parseAsArrayOf(parseAsString, ARRAY_SEPARATOR).withDefault([])
  );

  const sortKey = JSON.stringify(sort);
  const normalizedSearchQuery = (searchQuery ?? "").trim();
  const normalizedSearchBy = (searchBy ?? "").trim() || "name";
  const searchKey = normalizedSearchQuery
    ? `${normalizedSearchBy}:${normalizedSearchQuery}`
    : "";
  const category = categoryParams[0] ?? undefined;
  const ingredients = ingredientParams;

  return useQuery({
    queryKey: [
      "recipes",
      {
        page,
        perPage,
        sortKey,
        searchKey,
        category: category ?? "",
        ingredientsKey: ingredients.join(","),
      },
    ],
    queryFn: () =>
      recipesService.fetchRecipes({
        page,
        perPage,
        sort,
        ...(normalizedSearchQuery
          ? { searchBy: normalizedSearchBy, searchQuery: normalizedSearchQuery }
          : {}),
        ...(category ? { category } : {}),
        ...(ingredients.length ? { ingredients } : {}),
      }),
    staleTime: 0,
    placeholderData: keepPreviousData,
  });
};
