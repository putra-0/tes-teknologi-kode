import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

import { recipesService } from "../api/recipe-api";

export const useDeleteRecipe = () => {
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);

  const onDeleteSubmit = async (uuid: string, onSuccess?: () => void) => {
    setIsLoading(true);
    try {
      await recipesService.deleteRecipe(uuid);
      queryClient.invalidateQueries({ queryKey: ["recipes"] });
      onSuccess?.();
    } catch (error) {
      console.error("Failed to delete recipe:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    onDeleteSubmit,
  };
};
