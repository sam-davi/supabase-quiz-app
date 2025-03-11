import { AuthForm } from "@/components/auth-form";
import type { Message } from "@/components/form-message";
import { cn } from "@/lib/utils";
import { signInAction } from "@/server/actions/auth";
import Link from "next/link";

export function SignInForm({
  message,
  className,
  ...props
}: { message: Message } & React.ComponentPropsWithoutRef<"div">) {
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <AuthForm
        title="Welcome back"
        description="Sign in with your Github or Google account"
        message={message}
        footer={
          <div className="flex flex-col gap-1">
            {/* <div className="text-center text-sm">
              Forgotten password?{" "}
              <Link
                className="text-primary hover:text-primary/80 font-medium underline underline-offset-4"
                href="#"
              >
                Reset password
              </Link>
            </div> */}
            <div className="text-center text-sm">
              Don&apos;t have an account?{" "}
              <Link
                className="text-primary hover:text-primary/80 font-medium underline underline-offset-4"
                href="/sign-up"
              >
                Sign up
              </Link>
            </div>
          </div>
        }
        formType="Sign in"
        formAction={signInAction}
      />
    </div>
  );
}
