import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { UseFormSetError } from "react-hook-form";
import { AxiosError } from "axios";

import { ResponseApi } from "@/types/api-types";
import { handleApiValidation } from "@/lib/handle-api-validation";
import { categoriesService } from "../api/category-api";
import { CategoryFormSchema } from "../components/form-dialog";

type UpdateCategoryPayload = {
  name: string;
};

export const useUpdateCategory = () => {
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);

  const onUpdateSubmit = async (
    uuid: string,
    payload: UpdateCategoryPayload,
    setError: UseFormSetError<CategoryFormSchema>,
    onSuccess?: () => void
  ) => {
    setIsLoading(true);
    try {
      await categoriesService.updateCategory(uuid, payload);
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      onSuccess?.();
    } catch (error) {
      handleApiValidation(error as AxiosError<ResponseApi>, setError);
      console.error("Failed to update category:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    onUpdateSubmit,
  };
};
