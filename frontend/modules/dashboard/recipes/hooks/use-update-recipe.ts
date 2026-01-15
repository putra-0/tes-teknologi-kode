import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { UseFormSetError } from "react-hook-form";
import { AxiosError } from "axios";

import { ResponseApi } from "@/types/api-types";
import { handleApiValidation } from "@/lib/handle-api-validation";

import { recipesService, UpdateRecipePayload } from "../api/recipe-api";
import { RecipeEditFormSchema } from "../components/form-dialog";

export const useUpdateRecipe = () => {
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);

  const onUpdateSubmit = async (
    uuid: string,
    payload: UpdateRecipePayload,
    setError: UseFormSetError<RecipeEditFormSchema>,
    onSuccess?: () => void
  ) => {
    setIsLoading(true);
    try {
      await recipesService.updateRecipe(uuid, payload);
      queryClient.invalidateQueries({ queryKey: ["recipes"] });
      onSuccess?.();
    } catch (error) {
      handleApiValidation(error as AxiosError<ResponseApi>, setError);
      console.error("Failed to update recipe:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    onUpdateSubmit,
  };
};
