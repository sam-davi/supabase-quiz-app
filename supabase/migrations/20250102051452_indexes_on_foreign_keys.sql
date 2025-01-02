CREATE INDEX "categories_team_idx" ON "categories" USING btree ("team");--> statement-breakpoint
CREATE INDEX "locations_team_idx" ON "locations" USING btree ("team");--> statement-breakpoint
CREATE INDEX "members_team_idx" ON "members" USING btree ("team");--> statement-breakpoint
CREATE INDEX "profiles_user_id_idx" ON "profiles" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "rounds_team_idx" ON "rounds" USING btree ("team");--> statement-breakpoint
CREATE INDEX "rounds_team_location_idx" ON "rounds" USING btree ("team","location");--> statement-breakpoint
CREATE INDEX "rounds_team_category_idx" ON "rounds" USING btree ("team","category");--> statement-breakpoint
CREATE INDEX "scores_team_idx" ON "scores" USING btree ("team");--> statement-breakpoint
CREATE INDEX "scores_team_location_idx" ON "scores" USING btree ("team","location");--> statement-breakpoint
CREATE INDEX "teams_created_by_idx" ON "teams" USING btree ("created_by");