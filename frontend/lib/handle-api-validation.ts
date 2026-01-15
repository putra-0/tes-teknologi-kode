import { AxiosError } from "axios";
import { UseFormSetError, Path } from "react-hook-form";
import { ResponseApi } from "@/types/api-types";

export function handleApiValidation<T extends Record<string, unknown>>(
  error: AxiosError<ResponseApi>,
  setErrors: UseFormSetError<T>
) {
  const apiErrors = error.response?.data?.errors;

  if (apiErrors && typeof apiErrors === "object") {
    Object.entries(apiErrors).forEach(([field, messages]) => {
      if (Array.isArray(messages) && messages.length > 0) {
        setErrors(field as Path<T>, {
          type: "server",
          message: messages[0],
        });
      }
    });
  }
}
