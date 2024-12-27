CREATE TABLE "members" (
	"id" serial PRIMARY KEY NOT NULL,
	"team" text NOT NULL,
	"member" text NOT NULL,
	"role" text DEFAULT 'member' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone
);
--> statement-breakpoint
ALTER TABLE "members" ADD CONSTRAINT "members_team_teams_slug_fk" FOREIGN KEY ("team") REFERENCES "public"."teams"("slug") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "members" ADD CONSTRAINT "members_member_profiles_slug_fk" FOREIGN KEY ("member") REFERENCES "public"."profiles"("slug") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "members_member_idx" ON "members" USING btree ("member");--> statement-breakpoint
CREATE UNIQUE INDEX "members_team_member_idx" ON "members" USING btree ("team","member");