import { sql } from "drizzle-orm";
import { index, pgTable, serial, text, timestamp, uniqueIndex, uuid } from "drizzle-orm/pg-core";
import { authUsers } from "drizzle-orm/supabase";

export const teams = pgTable(
  "teams",
  {
    id: serial("id").primaryKey(),
    name: text("name").notNull(),
    slug: text("slug").notNull(),
    createdBy: uuid("created_by").notNull().default(sql`auth.uid()`).references(() => authUsers.id),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
      () => new Date()
    ),
  },
  (table) => [
    index("teams_name_idx").on(table.name),
    uniqueIndex("teams_slug_idx").on(table.slug),
  ]
);

export const profiles = pgTable(
  "profiles",
  {
    id: serial("id").primaryKey(),
    userId: uuid("user_id").notNull().unique().default(sql`auth.uid()`).references(() => authUsers.id),
    name: text("name").notNull(),
    slug: text("slug").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
      () => new Date()
    ),
  },
  (table) => [
    index("profiles_name_idx").on(table.name),
    uniqueIndex("profiles_slug_idx").on(table.slug),
  ]
);

export const members = pgTable(
  "members",
  {
    id: serial("id").primaryKey(),
    team: text("team").notNull().references(() => teams.slug),
    member: text("member").notNull().references(() => profiles.slug),
    role: text("role").notNull().default("member"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
      () => new Date()
    ),
  },
  (table) => [
    index("members_member_idx").on(table.member),
    uniqueIndex("members_team_member_idx").on(table.team, table.member)
  ]
);