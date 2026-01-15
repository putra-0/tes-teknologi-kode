import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { UseFormSetError } from "react-hook-form";
import { AxiosError } from "axios";

import { ResponseApi } from "@/types/api-types";
import { handleApiValidation } from "@/lib/handle-api-validation";
import { ingredientsService } from "../api/ingredient-api";
import { IngredientFormSchema } from "../components/form-dialog";

type UpdateIngredientPayload = {
  name: string;
};

export const useUpdateIngredient = () => {
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);

  const onUpdateSubmit = async (
    uuid: string,
    payload: UpdateIngredientPayload,
    setError: UseFormSetError<IngredientFormSchema>,
    onSuccess?: () => void
  ) => {
    setIsLoading(true);
    try {
      await ingredientsService.updateIngredient(uuid, payload);
      queryClient.invalidateQueries({ queryKey: ["ingredients"] });
      onSuccess?.();
    } catch (error) {
      handleApiValidation(error as AxiosError<ResponseApi>, setError);
      console.error("Failed to update ingredient:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    onUpdateSubmit,
  };
};
