import { FormMessage, type Message } from "@/components/form-message";
import { SignInForm } from "@/components/sign-in-form";

export default async function SignInPage(props: {
  searchParams: Promise<Message>;
}) {
  const searchParams = await props.searchParams;
  if ("message" in searchParams) {
    return (
      <div className="flex h-screen w-full flex-1 items-center justify-center gap-2 p-4 sm:max-w-md">
        <FormMessage message={searchParams} />
      </div>
    );
  }

  return (
    <>
      <SignInForm message={searchParams} />
    </>
  );
}
