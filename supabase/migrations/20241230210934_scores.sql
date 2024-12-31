CREATE TABLE "scores" (
	"id" serial PRIMARY KEY NOT NULL,
	"quiz_date" date NOT NULL,
	"location" text NOT NULL,
	"team" text NOT NULL,
	"score" real NOT NULL,
	"out_of" real DEFAULT 10,
	"percent_score" real GENERATED ALWAYS AS ("scores"."score" / "scores"."out_of" * 100) STORED,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone
);
--> statement-breakpoint
ALTER TABLE "scores" ADD CONSTRAINT "scores_team_teams_slug_fk" FOREIGN KEY ("team") REFERENCES "public"."teams"("slug") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "scores" ADD CONSTRAINT "scores_location_team_locations_slug_team_fk" FOREIGN KEY ("location","team") REFERENCES "public"."locations"("slug","team") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "scores_team_date_location_idx" ON "scores" USING btree ("team","quiz_date","location");