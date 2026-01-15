import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { UseFormSetError } from "react-hook-form";
import { AxiosError } from "axios";
import { ResponseApi } from "@/types/api-types";
import { categoriesService } from "../api/category-api";
import { handleApiValidation } from "@/lib/handle-api-validation";
import { CategoryFormSchema } from "../components/add-form-dialog";

type AddCategoryPayload = {
  name: string;
};

export const useAddCategory = () => {
  const queryClient = useQueryClient();
  const [dialog, setDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (
    payload: AddCategoryPayload,
    setError: UseFormSetError<CategoryFormSchema>
  ) => {
    setIsLoading(true);
    try {
      await categoriesService.addCategory(payload);
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      setDialog(false);
    } catch (error) {
      handleApiValidation(error as AxiosError<ResponseApi>, setError);
      console.error("Failed to add category:", error);
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
