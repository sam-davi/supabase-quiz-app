import { NewProfileForm } from "@/components/new-profile-form";
import { NewTeamForm } from "@/components/new-team-form";
import { getProfileAction } from "@/server/actions/profiles";
import { getTeamAction } from "@/server/actions/teams";
import { redirect } from "next/navigation";

export default async function Page() {
  const { slug } = await getProfileAction();

  const team = (await getTeamAction()).slug;

  if (team) {
    return redirect(`/quiz/${team}`);
  }

  return (
    <div className="flex h-screen flex-col items-center justify-center">
      {!slug ? <NewProfileForm /> : <NewTeamForm />}
    </div>
  );
}
