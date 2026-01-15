import { z } from "zod";

export const verifyOtpSchema = z.object({
  code: z
    .string()
    .min(6, "OTP must be 6 digits")
    .max(6, "OTP must be 6 digits")
    .regex(/^\d{6}$/, "OTP must be numeric"),
});

export type VerifyOtpSchema = z.infer<typeof verifyOtpSchema>;