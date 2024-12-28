import { NewProfileForm } from "@/components/new-profile-form";
import { getProfileAction } from "@/server/actions/profiles";
import { redirect } from "next/navigation";

export default async function Page() {
  const { slug } = await getProfileAction();

  if (slug) {
    return redirect(`/quiz/${slug}`);
  }

  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <NewProfileForm />
    </div>
  );
}
