"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Eye, EyeOff } from "lucide-react";
import { OtpForm } from "@/modules/auth/components/otp-form";
import { useSignup } from "../hooks/use-signup";
import { useState } from "react";
import { Controller, FormProvider } from "react-hook-form";

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const {
    retryIn,
    email,
    step,
    form,
    onSubmit,
    handleResend,
    handleOneTimePasswordSubmit,
    isLoading,
  } = useSignup();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <div className="w-full">
      {step === 1 && (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
          <Card className="text-shadow-neutral-900">
            <CardHeader className="text-center">
              <CardTitle className="text-xl font-semibold">
                Create your account
              </CardTitle>
              <CardDescription>
                Fill in your details to get started
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FormProvider {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4"
                >
                  <FieldGroup>
                    <Controller
                      name="name"
                      control={form.control}
                      render={({ field, fieldState }) => (
                        <Field>
                          <FieldLabel htmlFor="name">Full Name</FieldLabel>
                          <Input
                            {...field}
                            id="name"
                            aria-invalid={fieldState.invalid}
                            type="text"
                            placeholder="John Doe"
                          />
                          {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                          )}
                        </Field>
                      )}
                    />

                    <Controller
                      name="email"
                      control={form.control}
                      render={({ field, fieldState }) => (
                        <Field>
                          <FieldLabel htmlFor="email">Email</FieldLabel>
                          <Input
                            {...field}
                            id={field.name}
                            aria-invalid={fieldState.invalid}
                            type="email"
                            placeholder="mail@example.com"
                          />
                          {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                          )}
                        </Field>
                      )}
                    />

                    <Field>
                      <Field className="grid grid-cols-2 gap-4">
                        <Controller
                          name="password"
                          control={form.control}
                          render={({ field, fieldState }) => (
                            <Field>
                              <FieldLabel htmlFor="password">
                                Password
                              </FieldLabel>
                              <div className="relative">
                                <Input
                                  {...field}
                                  id={field.name}
                                  aria-invalid={fieldState.invalid}
                                  type={showPassword ? "text" : "password"}
                                  placeholder="Enter password"
                                />
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                  onClick={() => setShowPassword((p) => !p)}
                                >
                                  {showPassword ? (
                                    <EyeOff seed={18} />
                                  ) : (
                                    <Eye seed={18} />
                                  )}
                                </Button>
                              </div>
                              {fieldState.invalid && (
                                <FieldError errors={[fieldState.error]} />
                              )}
                            </Field>
                          )}
                        />

                        <Controller
                          name="passwordConfirmation"
                          control={form.control}
                          render={({ field, fieldState }) => (
                            <Field>
                              <FieldLabel htmlFor="passwordConfirmation">
                                Confirm Password
                              </FieldLabel>
                              <div className="relative">
                                <Input
                                  {...field}
                                  id={field.name}
                                  aria-invalid={fieldState.invalid}
                                  type={
                                    showConfirmPassword ? "text" : "password"
                                  }
                                  placeholder="Confirm password"
                                />
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                  onClick={() =>
                                    setShowConfirmPassword((p) => !p)
                                  }
                                >
                                  {showConfirmPassword ? (
                                    <EyeOff size={18} />
                                  ) : (
                                    <Eye size={18} />
                                  )}
                                </Button>
                              </div>
                              {fieldState.invalid && (
                                <FieldError errors={[fieldState.error]} />
                              )}
                            </Field>
                          )}
                        />
                      </Field>
                    </Field>

                    <Field>
                      <Button
                        type="submit"
                        className="w-full"
                        size="lg"
                        disabled={isLoading}
                      >
                        {isLoading ? "Loading..." : "Sign Up"}
                      </Button>
                      <FieldDescription className="text-center">
                        Already have an account?{" "}
                        <Link
                          href="/login"
                          className="text-primary-500 no-underline! hover:underline!"
                        >
                          Login
                        </Link>
                      </FieldDescription>
                    </Field>
                  </FieldGroup>
                </form>
              </FormProvider>
            </CardContent>
          </Card>

          <div className="text-muted-foreground *:[a]:hover:text-primary text-center mt-1 text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
            By signing up, you agree to our <a href="#">Terms of Service</a> and{" "}
            <a href="#">Privacy Policy</a>.
          </div>
        </div>
      )}

      {step === 2 && (
        <OtpForm
          className="mx-auto"
          title="Verify your email"
          email={email}
          handleResend={handleResend}
          handleOtpForm={handleOneTimePasswordSubmit}
          isLoading={isLoading}
          retryIn={retryIn}
        />
      )}
    </div>
  );
}
