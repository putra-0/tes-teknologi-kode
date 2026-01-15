import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

import { ingredientsService } from "../api/ingredient-api";

export const useDeleteIngredient = () => {
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);

  const onDeleteSubmit = async (uuid: string, onSuccess?: () => void) => {
    setIsLoading(true);
    try {
      await ingredientsService.deleteIngredient(uuid);

      queryClient.invalidateQueries({
        queryKey: ["ingredients"],
      });

      onSuccess?.();
    } catch (error) {
      console.error("Failed to delete ingredient:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    onDeleteSubmit,
  };
};
