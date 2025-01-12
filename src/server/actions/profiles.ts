"use server";

import { encodedRedirect } from "@/utils/utils";
import { redirect } from "next/navigation";
import { createDrizzleSupabaseClient } from "../db";
import { profiles } from "../db/schema";
import { authUid } from "drizzle-orm/supabase";

export const createProfileAction = async (formData: FormData) => {
  const name = formData.get("name") as string;
  const db = await createDrizzleSupabaseClient();

  const { slug } = await db.rls(async (tx) => {
    const [profile] = await tx
      .insert(profiles)
      .values({
        name,
      })
      .returning();

    if (!profile) {
      return encodedRedirect("error", "/quiz", "Failed to create profile");
    }

    return profile;
  });

  return redirect(`/quiz/${slug}`);
};

export const getProfileAction = async () => {
  const db = await createDrizzleSupabaseClient();

  const profile = await db.rls(async (tx) => {
    return await tx.query.profiles.findFirst({
      columns: { slug: true },
      where: (row, { eq }) => eq(row.userId, authUid),
    });
  });

  const slug = profile?.slug ?? null;

  return { slug };
};

export const getUserProfileAction = async () => {
  const db = await createDrizzleSupabaseClient();

  const profile = await db.rls(async (tx) => {
    return await tx.query.profiles.findFirst({
      columns: { name: true, slug: true, email: true },
      where: (row, { eq }) => eq(row.userId, authUid),
    });
  });

  if (!profile) {
    return encodedRedirect("error", "/quiz", "Failed to get profile");
  }

  return profile;
};
