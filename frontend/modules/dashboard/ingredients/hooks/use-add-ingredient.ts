import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { UseFormSetError } from "react-hook-form";
import { AxiosError } from "axios";

import { ResponseApi } from "@/types/api-types";
import { handleApiValidation } from "@/lib/handle-api-validation";
import { ingredientsService } from "../api/ingredient-api";
import { IngredientFormSchema } from "../components/form-dialog";

type AddIngredientPayload = {
  name: string;
};

export const useAddIngredient = () => {
  const queryClient = useQueryClient();
  const [dialog, setDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (
    payload: AddIngredientPayload,
    setError: UseFormSetError<IngredientFormSchema>
  ) => {
    setIsLoading(true);
    try {
      await ingredientsService.addIngredient(payload);
      queryClient.invalidateQueries({ queryKey: ["ingredients"] });
      setDialog(false);
    } catch (error) {
      handleApiValidation(error as AxiosError<ResponseApi>, setError);
      console.error("Failed to add ingredient:", error);
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
