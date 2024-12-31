CREATE TABLE "rounds" (
	"id" serial PRIMARY KEY NOT NULL,
	"quiz_date" date NOT NULL,
	"location" text NOT NULL,
	"category" text NOT NULL,
	"team" text NOT NULL,
	"round_number" integer NOT NULL,
	"score" real NOT NULL,
	"out_of" real DEFAULT 10,
	"double" boolean DEFAULT false,
	"percent_score" real GENERATED ALWAYS AS ("rounds"."score" / "rounds"."out_of" * 100) STORED,
	"total_score" real GENERATED ALWAYS AS (case when "rounds"."double" then "rounds"."score" * 2 else "rounds"."score" end) STORED,
	"total_out_of" real GENERATED ALWAYS AS (case when "rounds"."double" then "rounds"."out_of" * 2 else "rounds"."out_of" end) STORED,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone
);
--> statement-breakpoint
ALTER TABLE "rounds" ADD CONSTRAINT "rounds_team_teams_slug_fk" FOREIGN KEY ("team") REFERENCES "public"."teams"("slug") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "rounds" ADD CONSTRAINT "rounds_location_team_locations_slug_team_fk" FOREIGN KEY ("location","team") REFERENCES "public"."locations"("slug","team") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "rounds" ADD CONSTRAINT "rounds_category_team_categories_slug_team_fk" FOREIGN KEY ("category","team") REFERENCES "public"."categories"("slug","team") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "rounds_team_date_location_round_number_idx" ON "rounds" USING btree ("team","quiz_date","location","round_number");