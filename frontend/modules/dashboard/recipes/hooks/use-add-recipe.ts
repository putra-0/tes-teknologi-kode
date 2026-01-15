import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { UseFormSetError } from "react-hook-form";
import { AxiosError } from "axios";

import { ResponseApi } from "@/types/api-types";
import { handleApiValidation } from "@/lib/handle-api-validation";

import { recipesService, CreateRecipePayload } from "../api/recipe-api";
import { RecipeCreateFormSchema } from "../components/form-dialog";

export const useAddRecipe = () => {
  const queryClient = useQueryClient();
  const [dialog, setDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (
    payload: CreateRecipePayload,
    setError: UseFormSetError<RecipeCreateFormSchema>
  ) => {
    setIsLoading(true);
    try {
      await recipesService.addRecipe(payload);
      queryClient.invalidateQueries({ queryKey: ["recipes"] });
      setDialog(false);
    } catch (error) {
      handleApiValidation(error as AxiosError<ResponseApi>, setError);
      console.error("Failed to add recipe:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    dialog,
    isLoading,
    setDialog,
    onSubmit,
  };
};
