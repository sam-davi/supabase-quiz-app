"use server";

import { encodedRedirect } from "@/utils/utils";
import { createClient } from "@/utils/supabase/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createDrizzleSupabaseClient } from "../db";
import { profiles } from "../db/schema";
import { authUid } from "drizzle-orm/supabase";
import { eq } from "drizzle-orm";

export const signUpAction = async (formData: FormData) => {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const supabase = await createClient();
  const origin = (await headers()).get("origin");

  if (!email || !password) {
    return encodedRedirect(
      "error",
      "/sign-up",
      "Email and password are required",
    );
  }

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
    },
  });

  if (error) {
    console.error(error.code + " " + error.message);
    return encodedRedirect("error", "/sign-up", error.message);
  } else {
    return encodedRedirect(
      "success",
      "/sign-up",
      "Thanks for signing up! Please check your email for a verification link.",
    );
  }
};

export const signInAction = async (formData: FormData) => {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return encodedRedirect("error", "/sign-in", error.message);
  }

  return redirect("/quiz");
};

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
      where: eq(profiles.userId, authUid),
    });
  });

  const slug = profile?.slug ?? null;

  return { slug };
};
