"use server";

import { encodedRedirect } from "@/utils/utils";
import { createDrizzleSupabaseClient } from "../db";
import { getTeamRoleAction } from "./teams";

export const nextCategoryPageAction = async (
  team: string,
  cursor?: { category: string; averagePercentScore: number },
  minRounds = 1,
  pageSize = 10,
) => {
  const db = await createDrizzleSupabaseClient();

  const role = await getTeamRoleAction(team);

  if (role == null || !["host", "member"].includes(role)) {
    return encodedRedirect(
      "error",
      "/quiz",
      "You do not have permission to view categories for this team",
    );
  }

  const result = await db.rls(async (tx) => {
    return await tx.query.categories.findMany({
      columns: {
        id: true,
        name: true,
        slug: true,
        minPercentScore: true,
        maxPercentScore: true,
        averagePercentScore: true,
        rounds: true,
      },
      where: (row, { eq, and, lt, or, gte }) =>
        cursor
          ? and(
              eq(row.team, team),
              gte(row.rounds, minRounds),
              or(
                lt(row.averagePercentScore, cursor.averagePercentScore),
                and(
                  eq(row.averagePercentScore, cursor.averagePercentScore),
                  lt(row.slug, cursor.category),
                ),
              ),
            )
          : and(eq(row.team, team), gte(row.rounds, minRounds)),
      orderBy: (row, { desc }) => [
        desc(row.averagePercentScore),
        desc(row.slug),
      ],
      limit: pageSize,
    });
  });

  return result;
};

export const prevCategoryPageAction = async (
  team: string,
  cursor?: { category: string; averagePercentScore: number },
  minRounds = 1,
  pageSize = 10,
) => {
  const db = await createDrizzleSupabaseClient();

  const role = await getTeamRoleAction(team);

  if (role == null || !["host", "member"].includes(role)) {
    return encodedRedirect(
      "error",
      "/quiz",
      "You do not have permission to view categories for this team",
    );
  }

  const result = await db.rls(async (tx) => {
    return await tx.query.categories.findMany({
      columns: {
        id: true,
        name: true,
        slug: true,
        minPercentScore: true,
        maxPercentScore: true,
        averagePercentScore: true,
        rounds: true,
      },
      where: (row, { eq, and, gt, or, gte }) =>
        cursor
          ? and(
              eq(row.team, team),
              gte(row.rounds, minRounds),
              or(
                gt(row.averagePercentScore, cursor.averagePercentScore),
                and(
                  eq(row.averagePercentScore, cursor.averagePercentScore),
                  gt(row.slug, cursor.category),
                ),
              ),
            )
          : and(eq(row.team, team), gte(row.rounds, minRounds)),
      orderBy: (row, { asc }) => [asc(row.averagePercentScore), asc(row.slug)],
      limit: pageSize,
    });
  });

  return result.reverse();
};
