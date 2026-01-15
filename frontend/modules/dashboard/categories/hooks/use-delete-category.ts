import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { ErrorApi } from "@/types/api-types";

import { categoriesService } from "../api/category-api";

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);

  const onDeleteSubmit = async (uuid: string, onSuccess?: () => void) => {
    setIsLoading(true);
    try {
      await categoriesService.deleteCategory(uuid);

      queryClient.invalidateQueries({
        queryKey: ["categories"],
      });

      onSuccess?.();
    } catch (error: AxiosError<ErrorApi> | any) {
      console.error("Failed to delete category:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    onDeleteSubmit,
  };
};
