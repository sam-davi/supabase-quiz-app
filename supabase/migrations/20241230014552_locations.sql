CREATE TABLE "locations" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"slug" text,
	"team" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone
);
--> statement-breakpoint
ALTER TABLE "profiles" ALTER COLUMN "slug" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "teams" ALTER COLUMN "slug" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "locations" ADD CONSTRAINT "locations_team_teams_slug_fk" FOREIGN KEY ("team") REFERENCES "public"."teams"("slug") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "locations_name_idx" ON "locations" USING btree ("name");--> statement-breakpoint
CREATE UNIQUE INDEX "locations_team_slug" ON "locations" USING btree ("team","slug");