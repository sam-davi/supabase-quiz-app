import { NewTeamForm } from "@/components/new-team-form";
import { getProfileAction } from "@/server/actions/profiles";
import { getTeamAction } from "@/server/actions/teams";
import { redirect } from "next/navigation";

async function checkUserCanCreateTeam(member: string) {
  const { slug } = await getProfileAction();

  if (!slug) {
    return redirect("/quiz");
  }

  if (member !== slug) {
    return redirect(`/quiz/${slug}`);
  }

  const team = (await getTeamAction()).slug;

  if (team) {
    return redirect(`/quiz/${member}/${team}`);
  }
}

export default async function Page({
  params,
}: {
  params: Promise<{ member: string }>;
}) {
  const { member } = await params;
  await checkUserCanCreateTeam(member);

  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <NewTeamForm />
    </div>
  );
}
