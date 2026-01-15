"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { signupApi, verifyOneTimePasswordApi } from "../apis/signup-api";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { DEFAULT_RETRY_TIME } from "@/consts";
import { VerifyOtpSchema } from "../../schema/verify-otp.schema";

const SignupSchema = z
  .object({
    name: z.string().nonempty("Please enter your name"),
    email: z.string().email("Please enter a valid email"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Must contain at least one uppercase letter")
      .regex(/[a-z]/, "Must contain at least one lowercase letter")
      .regex(/\d/, "Must contain at least one number")
      .regex(/[^A-Za-z0-9]/, "Must contain at least one symbol"),
    passwordConfirmation: z.string().nonempty("Please confirm your password"),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: "Passwords do not match",
    path: ["passwordConfirmation"],
  });

export type SignupSchema = z.infer<typeof SignupSchema>;

export function useSignup() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [retryIn, setRetryIn] = useState(0);

  const form = useForm<SignupSchema>({
    resolver: zodResolver(SignupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      passwordConfirmation: "",
    },
  });

  const onSubmit = async ({
    name,
    email,
    password,
    passwordConfirmation,
  }: SignupSchema) => {
    setIsLoading(true);
    try {
      const { data } = await signupApi({
        name,
        email,
        password,
        passwordConfirmation,
      });
      setRetryIn(data.retryIn ?? DEFAULT_RETRY_TIME);
      setName(name);
      setEmail(email);
      setPassword(password);
      setPasswordConfirmation(passwordConfirmation);
      setStep(2);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    setIsLoading(true);
    try {
      const { data } = await signupApi({
        name,
        email,
        password,
        passwordConfirmation,
      });
      setRetryIn(data.retryIn ?? DEFAULT_RETRY_TIME);
    } catch (error: any) {
      if (error.response.data.responseCode === "4290000") {
        setRetryIn(error.response.data.retryIn);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleOneTimePasswordSubmit = async (values: VerifyOtpSchema) => {
    setIsLoading(true);

    try {
      await verifyOneTimePasswordApi({
        code: values.code,
        email,
      });

      router.push("/login");
    } catch (error) {
      console.error("OTP verification failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (retryIn > 0) {
      const timer = setTimeout(() => {
        setRetryIn(retryIn - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [retryIn]);

  return {
    retryIn,
    email,
    step,
    form,
    onSubmit,
    handleResend,
    handleOneTimePasswordSubmit,
    isLoading,
  };
}
