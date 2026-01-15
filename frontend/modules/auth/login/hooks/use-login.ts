"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { useAuthStore } from "@/store/auth-store";
import { loginApi } from "../apis/login-api";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { toast } from "sonner";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export type LoginSchema = z.infer<typeof loginSchema>;

export function useLogin() {
  const login = useAuthStore((state) => state.login);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (values: LoginSchema) => {
    setIsLoading(true);
    try {
      const { data } = await loginApi(values);

      login({
        user: {
          name: data.name,
          email: data.email,
        },
        token: data.accessToken,
      });

      toast.success(data.responseMessage ?? "Login success");
      router.push("/dashboard");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    form,
    onSubmit,
    isLoading,
  };
}
