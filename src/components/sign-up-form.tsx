import { AuthForm } from "@/components/auth-form";
import type { Message } from "@/components/form-message";
import { cn } from "@/lib/utils";
import { signUpAction } from "@/server/actions/auth";
import Link from "next/link";

export function SignUpForm({
  message,
  className,
  ...props
}: { message: Message } & React.ComponentPropsWithoutRef<"div">) {
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <AuthForm
        title="Welcome!"
        description="Create an account to get started"
        message={message}
        footer={
          <div className="flex flex-col gap-1">
            <div className="text-center text-sm">
              Already have an account?{" "}
              <Link
                className="font-medium text-primary underline underline-offset-4 hover:text-primary/80"
                href="/sign-in"
              >
                Sign in
              </Link>
            </div>
          </div>
        }
        formType="Sign up"
        formAction={signUpAction}
      />
    </div>
  );
}
