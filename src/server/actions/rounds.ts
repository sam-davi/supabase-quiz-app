"use server";

import { encodedRedirect } from "@/utils/utils";
import { redirect } from "next/navigation";
import { createDrizzleSupabaseClient } from "../db";
import { rounds } from "../db/schema";
import { getTeamRoleAction } from "./teams";
import { sql } from "drizzle-orm";

export const upsertRoundsAction = async (formData: FormData) => {
  const team = formData.get("team") as string;
  const location = formData.get("location") as string;
  const quizDate = formData.get("date") as string;
  const numberOfRounds = Number(formData.get("rounds") as string);

  if (
    !team ||
    !location ||
    !quizDate ||
    !numberOfRounds ||
    numberOfRounds < 1
  ) {
    return encodedRedirect("error", "/quiz", "Missing required fields");
  }

  const db = await createDrizzleSupabaseClient();

  const role = await getTeamRoleAction(team);

  if (role == null || !["host", "member"].includes(role)) {
    return encodedRedirect(
      "error",
      "/quiz",
      "You do not have permission to create results for this team",
    );
  }

  const newRounds = [...Array(numberOfRounds).keys()].map((index) => ({
    team,
    location,
    quizDate,
    roundNumber: Number(formData.get(`round_number-${index}`) as string),
    category: formData.get(`category-${index}`) as string,
    score: Number(formData.get(`score-${index}`) as string),
    outOf: Number(formData.get(`out_of-${index}`) as string),
    double: !!formData.get(`double-${index}`),
  }));

  await db.rls(async (tx) => {
    await tx
      .insert(rounds)
      .values(newRounds)
      .onConflictDoUpdate({
        target: [
          rounds.team,
          rounds.location,
          rounds.quizDate,
          rounds.roundNumber,
        ],
        set: {
          roundNumber: sql.raw(`excluded.${rounds.roundNumber.name}`),
          category: sql.raw(`excluded.${rounds.category.name}`),
          score: sql.raw(`excluded.${rounds.score.name}`),
          outOf: sql.raw(`excluded.${rounds.outOf.name}`),
          double: sql.raw(`excluded.${rounds.double.name}`),
        },
      });
  });

  return redirect(`/quiz/${team}`);
};
