ALTER TABLE "categories" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "members" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "profiles" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "rounds" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "scores" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "teams" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE POLICY "team member can create category" ON "categories" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK (private.is_team_member("categories"."team"));--> statement-breakpoint
CREATE POLICY "team member can select category" ON "categories" AS PERMISSIVE FOR SELECT TO "authenticated" USING (private.is_team_member("categories"."team"));--> statement-breakpoint
CREATE POLICY "team member can update category" ON "categories" AS PERMISSIVE FOR UPDATE TO "authenticated" USING (private.is_team_member("categories"."team")) WITH CHECK (private.is_team_member("categories"."team"));--> statement-breakpoint
CREATE POLICY "team host can create member" ON "members" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK (private.is_team_host("members"."team"));--> statement-breakpoint
CREATE POLICY "team member can select member" ON "members" AS PERMISSIVE FOR SELECT TO "authenticated" USING (private.is_team_member("members"."team"));--> statement-breakpoint
CREATE POLICY "team host can update member" ON "members" AS PERMISSIVE FOR UPDATE TO "authenticated" USING (private.is_team_host("members"."team")) WITH CHECK (private.is_team_host("members"."team"));--> statement-breakpoint
CREATE POLICY "authenticated user can create profile" ON "profiles" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK (auth.uid() = "profiles"."user_id");--> statement-breakpoint
CREATE POLICY "authenticated user can select profile" ON "profiles" AS PERMISSIVE FOR SELECT TO "authenticated" USING (auth.uid() = "profiles"."user_id");--> statement-breakpoint
CREATE POLICY "team member can create round" ON "rounds" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK (private.is_team_member("rounds"."team"));--> statement-breakpoint
CREATE POLICY "team member can select round" ON "rounds" AS PERMISSIVE FOR SELECT TO "authenticated" USING (private.is_team_member("rounds"."team"));--> statement-breakpoint
CREATE POLICY "team member can update round" ON "rounds" AS PERMISSIVE FOR UPDATE TO "authenticated" USING (private.is_team_member("rounds"."team")) WITH CHECK (private.is_team_member("rounds"."team"));--> statement-breakpoint
CREATE POLICY "team member can create score" ON "scores" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK (private.is_team_member("scores"."team"));--> statement-breakpoint
CREATE POLICY "team member can select score" ON "scores" AS PERMISSIVE FOR SELECT TO "authenticated" USING (private.is_team_member("scores"."team"));--> statement-breakpoint
CREATE POLICY "team member can update score" ON "scores" AS PERMISSIVE FOR UPDATE TO "authenticated" USING (private.is_team_member("scores"."team")) WITH CHECK (private.is_team_member("scores"."team"));--> statement-breakpoint
CREATE POLICY "authenticated user can create team" ON "teams" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK (auth.uid() = "teams"."created_by");--> statement-breakpoint
CREATE POLICY "team members can select team" ON "teams" AS PERMISSIVE FOR SELECT TO "authenticated" USING (private.is_team_member("teams"."slug"));