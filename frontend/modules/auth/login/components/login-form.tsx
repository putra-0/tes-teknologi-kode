"use client";

import { useState } from "react";
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
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Eye, EyeOff } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import { useLogin } from "../hooks/use-login";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { form, onSubmit, isLoading } = useLogin();
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Welcome back</CardTitle>
          <CardDescription>Sign in to access your account</CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup>
              <Field>
                <FieldLabel>Email</FieldLabel>
                <Input
                  type="email"
                  placeholder="mail@example.com"
                  {...form.register("email")}
                />
              </Field>

              <Field>
                {/* <div className="flex items-center">
                  <FieldLabel>Password</FieldLabel>
                  <Link
                    href="/forgot-password"
                    className="ml-auto text-sm text-primary hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div> */}

                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    {...form.register("password")}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => setShowPassword((p) => !p)}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </Button>
                </div>
              </Field>

              <Field>
                <Button
                  type="submit"
                  className="w-full"
                  size="lg"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Spinner /> Logging in...
                    </>
                  ) : (
                    "Log in"
                  )}
                </Button>

                <FieldDescription className="text-center">
                  Don&apos;t have an account?{" "}
                  <Link
                    href="/signup"
                    className="text-primary hover:underline"
                  >
                    Sign up
                  </Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
