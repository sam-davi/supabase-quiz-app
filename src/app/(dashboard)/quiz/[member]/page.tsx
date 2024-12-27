import { getProfileAction } from "@/server/actions/auth";
import { redirect } from "next/navigation";

export default async function Page({
  params,
}: {
  params: Promise<{ member: string }>;
}) {
  const { member } = await params;
  const { slug } = await getProfileAction();

  if (member !== slug) {
    return redirect(`/quiz/${slug}`);
  }

  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <h1 className="mb-4 text-4xl font-bold">Member</h1>
      <p className="text-lg">This is the member page.</p>
      <p className="text-sm">
        The member will see this page if they are not a part of a team.
      </p>
    </div>
  );
}
