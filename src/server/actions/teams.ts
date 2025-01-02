"use server";

import { encodedRedirect } from "@/utils/utils";
import { redirect } from "next/navigation";
import { createDrizzleSupabaseClient } from "../db";
import { members, teams } from "../db/schema";
import { getProfileAction } from "./profiles";
import { and, desc, eq, inArray } from "drizzle-orm";

const isTeamHostAction = async (member: string) => {
  const db = await createDrizzleSupabaseClient();

  const team = await db.rls(async (tx) => {
    return await tx.query.members.findFirst({
      columns: { team: true },
      where: (row, { eq, and }) =>
        and(eq(row.member, member), eq(row.role, "host")),
    });
  });

  return !!team;
};

export const getTeamRoleAction = async (team: string) => {
  const db = await createDrizzleSupabaseClient();

  const member = (await getProfileAction()).slug;

  let role: string | null = null;

  if (!member) {
    return role;
  }

  const result = await db.rls(async (tx) => {
    return await tx.query.members.findFirst({
      columns: { role: true },
      where: (row, { eq, and }) =>
        and(eq(row.team, team), eq(row.member, member)),
    });
  });

  role = result?.role ?? null;

  return role;
};

export const createTeamAction = async (formData: FormData) => {
  const name = formData.get("name") as string;
  const db = await createDrizzleSupabaseClient();

  const member = (await getProfileAction()).slug;

  if (!member) {
    return encodedRedirect("error", "/quiz", "Failed to create team");
  }

  if (await isTeamHostAction(member)) {
    return encodedRedirect("error", "/quiz", "You are already a host");
  }

  const { slug } = await db.rls(async (tx) => {
    const [team] = await tx
      .insert(teams)
      .values({
        name,
      })
      .returning();

    if (!team) {
      return encodedRedirect("error", "/quiz", "Failed to create team");
    }

    return team;
  });

  if (!slug) {
    return encodedRedirect("error", "/quiz", "Failed to create team");
  }

  return redirect(`/quiz/${slug}`);
};

export const getTeamAction = async () => {
  const db = await createDrizzleSupabaseClient();

  const member = (await getProfileAction()).slug;

  let slug: string | null = null;

  if (!member) {
    return { slug };
  }

  const team = await db.rls(async (tx) => {
    return await tx.query.members.findFirst({
      columns: { team: true },
      where: (row, { eq, and, inArray }) =>
        and(eq(row.member, member), inArray(row.role, ["host", "member"])),
    });
  });

  slug = team?.team ?? null;

  return { slug };
};

export const getTeamsAction = async () => {
  const db = await createDrizzleSupabaseClient();

  const member = (await getProfileAction()).slug;

  if (!member) {
    return encodedRedirect("error", "/quiz", "Failed to get profile");
  }

  const result = await db.rls(async (tx) => {
    return await tx
      .select({
        slug: teams.slug,
        name: teams.name,
      })
      .from(teams)
      .leftJoin(members, eq(members.team, teams.slug))
      .where(
        and(
          eq(members.member, member),
          inArray(members.role, ["host", "member"]),
        ),
      )
      .orderBy(desc(teams.createdAt));
  });

  return result;
};
