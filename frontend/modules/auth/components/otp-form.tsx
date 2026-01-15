import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { cn } from "@/lib/utils";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import {
  verifyOtpSchema,
  VerifyOtpSchema,
} from "@/modules/auth/schema/verify-otp.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Spinner } from "@/components/ui/spinner";
import { REGEXP_ONLY_DIGITS } from "input-otp";

type OtpFormProps = {
  title: string;
  email: string;
  isLoading: boolean;
  retryIn: number;
  handleOtpForm: (values: VerifyOtpSchema) => Promise<void>;
  handleResend?: () => void;
};

export const OtpForm = ({
  title,
  isLoading,
  retryIn,
  handleOtpForm,
  handleResend,
  className,
  ...props
}: OtpFormProps & React.ComponentPropsWithoutRef<"div">) => {
  const form = useForm<VerifyOtpSchema>({
    resolver: zodResolver(verifyOtpSchema),
    defaultValues: { code: "" },
  });

  return (
    <div className={cn("flex justify-center", className)} {...props}>
      <Card className="border-none text-shadow-neutral-900 w-full max-w-sm">
        <CardHeader className="text-center">
          <CardTitle className="text-xl">{title}</CardTitle>
          <CardDescription>
            We sent a 6-digit code to your email.
            <br /> Enter it below to complete login.
          </CardDescription>
        </CardHeader>
        <CardContent className="w-full">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleOtpForm)}
              className="space-y-4"
            >
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem className="flex flex-col justify-center items-center">
                    <FormControl>
                      <InputOTP maxLength={6} pattern={REGEXP_ONLY_DIGITS} {...field}>
                        <InputOTPGroup>
                          {[...Array(6)].map((_, i) => (
                            <InputOTPSlot key={i} index={i} />
                          ))}
                        </InputOTPGroup>
                      </InputOTP>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                variant={"default"}
                className="w-full items-center flex justify-center mt-8"
                size={"lg"}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Spinner /> Verifying..
                  </>
                ) : (
                  "Verify OTP"
                )}
              </Button>
              <div className="w-full flex justify-center items-center">
                <Button
                  type="button"
                  variant="link"
                  onClick={handleResend}
                  disabled={retryIn > 0}
                  className="cursor-pointer text-primary disabled:opacity-50"
                >
                  {retryIn !== 0
                    ? `Resend OTP in ${String(
                        Math.floor(retryIn / 60)
                      ).padStart(2, "0")}:${String(retryIn % 60).padStart(
                        2,
                        "0"
                      )} seconds`
                    : "Resend OTP"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};
