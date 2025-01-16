import LastQuiz from "@/components/d3/LastQuizComponent";
import { getProfileAction } from "@/server/actions/profiles";
import { getTeamsAction } from "@/server/actions/teams";
import { redirect } from "next/navigation";

async function checkUserCanViewDashboard(team: string) {
  const { slug } = await getProfileAction();

  if (!slug) {
    return redirect("/quiz");
  }

  const teams = await getTeamsAction();

  if (!teams.find((t) => t.slug === team)) {
    return redirect("/quiz");
  }

  return teams;
}

export default async function Dashboard({
  params,
}: {
  params: Promise<{ team: string }>;
}) {
  const { team } = await params;
  await checkUserCanViewDashboard(team);

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="grid auto-rows-min gap-4 md:grid-cols-3">
        <div className="aspect-video rounded-xl bg-muted/50">
          <LastQuiz team={team} />
        </div>
        <div className="aspect-video rounded-xl bg-muted/50" />
        <div className="aspect-video rounded-xl bg-muted/50" />
      </div>
      <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min" />
    </div>
  );
}
