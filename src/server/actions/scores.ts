"use server";

import { encodedRedirect } from "@/utils/utils";
import { createDrizzleSupabaseClient } from "../db";
import { getTeamRoleAction } from "./teams";

export const getLastQuizScoresAction = async (team: string) => {
  const db = await createDrizzleSupabaseClient();

  const role = await getTeamRoleAction(team);

  if (role == null || !["host", "member"].includes(role)) {
    return encodedRedirect(
      "error",
      "/quiz",
      "You do not have permission to view results for this team",
    );
  }

  const result = await db.rls(async (tx) => {
    return await tx.query.scores.findFirst({
      columns: {
        id: true,
        score: true,
        outOf: true,
        percentScore: true,
        roundsPlayed: true,
        quizDate: true,
      },
      with: {
        location: {
          columns: { name: true, slug: true },
        },
        rounds: {
          columns: {
            roundNumber: true,
            score: true,
            outOf: true,
            double: true,
            totalScore: true,
            totalOutOf: true,
            percentScore: true,
          },
          with: {
            category: {
              columns: { name: true, slug: true },
            },
          },
          orderBy: (row, { asc }) => asc(row.roundNumber),
          limit: 100,
        },
      },
      where: (row, { eq }) => eq(row.team, team),
      orderBy: (row, { desc }) => [desc(row.quizDate), desc(row.location)],
    });
  });

  return result;
};

export const nextScorePageAction = async (
  team: string,
  cursor?: { location: string; date: string },
  pageSize = 10,
) => {
  const db = await createDrizzleSupabaseClient();

  const role = await getTeamRoleAction(team);

  if (role == null || !["host", "member"].includes(role)) {
    return encodedRedirect(
      "error",
      "/quiz",
      "You do not have permission to view results for this team",
    );
  }

  const result = await db.rls(async (tx) => {
    return await tx.query.scores.findMany({
      columns: {
        id: true,
        score: true,
        outOf: true,
        percentScore: true,
        roundsPlayed: true,
        quizDate: true,
      },
      with: {
        location: {
          columns: { name: true, slug: true },
        },
      },
      where: (row, { eq, and, or, lt }) =>
        cursor
          ? and(
              eq(row.team, team),
              or(
                lt(row.quizDate, cursor.date),
                and(
                  eq(row.quizDate, cursor.date),
                  lt(row.location, cursor.location),
                ),
              ),
            )
          : eq(row.team, team),
      orderBy: (row, { desc }) => [desc(row.quizDate), desc(row.location)],
      limit: pageSize,
    });
  });

  return result;
};

export const prevScorePageAction = async (
  team: string,
  cursor?: { location: string; date: string },
  pageSize = 10,
) => {
  const db = await createDrizzleSupabaseClient();

  const role = await getTeamRoleAction(team);

  if (role == null || !["host", "member"].includes(role)) {
    return encodedRedirect(
      "error",
      "/quiz",
      "You do not have permission to view results for this team",
    );
  }

  const result = await db.rls(async (tx) => {
    return await tx.query.scores.findMany({
      columns: {
        id: true,
        score: true,
        outOf: true,
        percentScore: true,
        roundsPlayed: true,
        quizDate: true,
      },
      with: {
        location: {
          columns: { name: true, slug: true },
        },
      },
      where: (row, { eq, and, or, gt }) =>
        cursor
          ? and(
              eq(row.team, team),
              or(
                gt(row.quizDate, cursor.date),
                and(
                  eq(row.quizDate, cursor.date),
                  gt(row.location, cursor.location),
                ),
              ),
            )
          : eq(row.team, team),
      orderBy: (row, { asc }) => [asc(row.quizDate), asc(row.location)],
      limit: pageSize,
    });
  });

  return result.reverse();
};
