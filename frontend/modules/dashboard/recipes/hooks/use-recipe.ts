import { useQuery } from "@tanstack/react-query";

import { recipesService } from "../api/recipe-api";

export function useRecipe(uuid: string) {
  return useQuery({
    queryKey: ["recipes", "show", uuid],
    queryFn: () => recipesService.fetchRecipe(uuid),
    enabled: Boolean(uuid),
  });
}
