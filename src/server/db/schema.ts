import { relations, type SQL, sql } from "drizzle-orm";
import {
  boolean,
  check,
  date,
  foreignKey,
  index,
  integer,
  pgPolicy,
  pgTable,
  real,
  serial,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";
import { authenticatedRole, authUid, authUsers } from "drizzle-orm/supabase";

export const teams = pgTable(
  "teams",
  {
    id: serial("id").primaryKey(),
    name: text("name").notNull(),
    slug: text("slug"),
    createdBy: uuid("created_by")
      .notNull()
      .default(sql`auth.uid()`)
      .references(() => authUsers.id),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
      () => new Date(),
    ),
  },
  (table) => [
    index("teams_name_idx").on(table.name),
    index("teams_created_by_idx").on(table.createdBy),
    uniqueIndex("teams_slug_idx").on(table.slug),
    pgPolicy("authenticated user can create team", {
      for: "insert",
      to: authenticatedRole,
      withCheck: sql`${authUid} = ${table.createdBy}`,
    }),
    pgPolicy("team members can select team", {
      for: "select",
      to: authenticatedRole,
      using: sql`private.is_team_member(${table.slug})`,
    }),
  ],
);

export const teamsRelations = relations(teams, ({ many }) => ({
  members: many(members),
  rounds: many(rounds),
  locations: many(locations),
  categories: many(categories),
}));

export const profiles = pgTable(
  "profiles",
  {
    id: serial("id").primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .unique()
      .default(sql`auth.uid()`)
      .references(() => authUsers.id),
    name: text("name").notNull(),
    slug: text("slug"),
    email: text("email"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
      () => new Date(),
    ),
  },
  (table) => [
    index("profiles_name_idx").on(table.name),
    index("profiles_user_id_idx").on(table.userId),
    uniqueIndex("profiles_slug_idx").on(table.slug),
    pgPolicy("authenticated user can create profile", {
      for: "insert",
      to: authenticatedRole,
      withCheck: sql`${authUid} = ${table.userId}`,
    }),
    pgPolicy("authenticated user can select profile", {
      for: "select",
      to: authenticatedRole,
      using: sql`${authUid} = ${table.userId}`,
    }),
  ],
);

export const profilesRelations = relations(profiles, ({ one, many }) => ({
  members: many(members),
  user: one(authUsers, {
    fields: [profiles.userId],
    references: [authUsers.id],
  }),
}));

export const members = pgTable(
  "members",
  {
    id: serial("id").primaryKey(),
    team: text("team")
      .notNull()
      .references(() => teams.slug),
    member: text("member")
      .notNull()
      .references(() => profiles.slug),
    role: text("role").notNull().default("member"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
      () => new Date(),
    ),
  },
  (table) => [
    index("members_member_idx").on(table.member),
    index("members_team_idx").on(table.team),
    uniqueIndex("members_team_member_idx").on(table.team, table.member),
    pgPolicy("team host can create member", {
      for: "insert",
      to: authenticatedRole,
      withCheck: sql`private.is_team_host(${table.team})`,
    }),
    pgPolicy("team member can select member", {
      for: "select",
      to: authenticatedRole,
      using: sql`private.is_team_member(${table.team})`,
    }),
    pgPolicy("team host can update member", {
      for: "update",
      to: authenticatedRole,
      using: sql`private.is_team_host(${table.team})`,
      withCheck: sql`private.is_team_host(${table.team})`,
    }),
  ],
);

export const membersRelations = relations(members, ({ one }) => ({
  team: one(teams, {
    fields: [members.team],
    references: [teams.slug],
  }),
  member: one(profiles, {
    fields: [members.member],
    references: [profiles.slug],
  }),
}));

export const locations = pgTable(
  "locations",
  {
    id: serial("id").primaryKey(),
    name: text("name").notNull(),
    slug: text("slug"),
    team: text("team")
      .notNull()
      .references(() => teams.slug),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
      () => new Date(),
    ),
  },
  (table) => [
    index("locations_name_idx").on(table.name),
    index("locations_team_idx").on(table.team),
    uniqueIndex("locations_team_slug").on(table.team, table.slug),
    pgPolicy("team member can create location", {
      for: "insert",
      to: authenticatedRole,
      withCheck: sql`private.is_team_member(${table.team})`,
    }),
    pgPolicy("team member can select location", {
      for: "select",
      to: authenticatedRole,
      using: sql`private.is_team_member(${table.team})`,
    }),
    pgPolicy("team member can update location", {
      for: "update",
      to: authenticatedRole,
      using: sql`private.is_team_member(${table.team})`,
      withCheck: sql`private.is_team_member(${table.team})`,
    }),
  ],
);

export const locationsRelations = relations(locations, ({ one, many }) => ({
  team: one(teams, {
    fields: [locations.team],
    references: [teams.slug],
  }),
  rounds: many(rounds),
}));

export const categories = pgTable(
  "categories",
  {
    id: serial("id").primaryKey(),
    name: text("name").notNull(),
    slug: text("slug"),
    team: text("team")
      .notNull()
      .references(() => teams.slug),
    minPercentScore: real("min_percent_score"),
    maxPercentScore: real("max_percent_score"),
    averagePercentScore: real("average_percent_score"),
    rounds: integer("rounds").default(1),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
      () => new Date(),
    ),
  },
  (table) => [
    index("categories_name_idx").on(table.name),
    index("categories_team_idx").on(table.team),
    uniqueIndex("categories_team_slug").on(table.team, table.slug),
    pgPolicy("team member can create category", {
      for: "insert",
      to: authenticatedRole,
      withCheck: sql`private.is_team_member(${table.team})`,
    }),
    pgPolicy("team member can select category", {
      for: "select",
      to: authenticatedRole,
      using: sql`private.is_team_member(${table.team})`,
    }),
    pgPolicy("team member can update category", {
      for: "update",
      to: authenticatedRole,
      using: sql`private.is_team_member(${table.team})`,
      withCheck: sql`private.is_team_member(${table.team})`,
    }),
  ],
);

export const categoriesRelations = relations(categories, ({ one, many }) => ({
  team: one(teams, {
    fields: [categories.team],
    references: [teams.slug],
  }),
  rounds: many(rounds),
}));

export const rounds = pgTable(
  "rounds",
  {
    id: serial("id").primaryKey(),
    quizDate: date("quiz_date").notNull(),
    location: text("location").notNull(),
    category: text("category").notNull(),
    team: text("team")
      .notNull()
      .references(() => teams.slug),
    roundNumber: integer("round_number").notNull(),
    score: real("score").notNull(),
    outOf: real("out_of").default(10),
    double: boolean("double").default(false),
    percentScore: real("percent_score").generatedAlwaysAs(
      (): SQL => sql`${rounds.score} / ${rounds.outOf} * 100`,
    ),
    totalScore: real("total_score").generatedAlwaysAs(
      (): SQL =>
        sql`case when ${rounds.double} then ${rounds.score} * 2 else ${rounds.score} end`,
    ),
    totalOutOf: real("total_out_of").generatedAlwaysAs(
      (): SQL =>
        sql`case when ${rounds.double} then ${rounds.outOf} * 2 else ${rounds.outOf} end`,
    ),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
      () => new Date(),
    ),
  },
  (table) => [
    foreignKey({
      columns: [table.location, table.team],
      foreignColumns: [locations.slug, locations.team],
    }),
    foreignKey({
      columns: [table.category, table.team],
      foreignColumns: [categories.slug, categories.team],
    }),
    index("rounds_team_idx").on(table.team),
    index("rounds_team_location_idx").on(table.team, table.location),
    index("rounds_team_category_idx").on(table.team, table.category),
    uniqueIndex("rounds_team_date_location_round_number_idx").on(
      table.team,
      table.quizDate,
      table.location,
      table.roundNumber,
    ),
    check("rounds_out_of_greater_than_zero", sql`${table.outOf} > 0`),
    pgPolicy("team member can create round", {
      for: "insert",
      to: authenticatedRole,
      withCheck: sql`private.is_team_member(${table.team})`,
    }),
    pgPolicy("team member can select round", {
      for: "select",
      to: authenticatedRole,
      using: sql`private.is_team_member(${table.team})`,
    }),
    pgPolicy("team member can update round", {
      for: "update",
      to: authenticatedRole,
      using: sql`private.is_team_member(${table.team})`,
      withCheck: sql`private.is_team_member(${table.team})`,
    }),
  ],
);

export const roundsRelations = relations(rounds, ({ one }) => ({
  team: one(teams, {
    fields: [rounds.team],
    references: [teams.slug],
  }),
  location: one(locations, {
    fields: [rounds.location, rounds.team],
    references: [locations.slug, locations.team],
  }),
  category: one(categories, {
    fields: [rounds.category, rounds.team],
    references: [categories.slug, categories.team],
  }),
}));

export const scores = pgTable(
  "scores",
  {
    id: serial("id").primaryKey(),
    quizDate: date("quiz_date").notNull(),
    location: text("location").notNull(),
    team: text("team")
      .notNull()
      .references(() => teams.slug),
    score: real("score").notNull(),
    outOf: real("out_of").default(10),
    rounds: integer("rounds").default(1),
    percentScore: real("percent_score").generatedAlwaysAs(
      (): SQL => sql`${scores.score} / ${scores.outOf} * 100`,
    ),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
      () => new Date(),
    ),
  },
  (table) => [
    foreignKey({
      columns: [table.location, table.team],
      foreignColumns: [locations.slug, locations.team],
    }),
    index("scores_team_idx").on(table.team),
    index("scores_team_location_idx").on(table.team, table.location),
    uniqueIndex("scores_team_date_location_idx").on(
      table.team,
      table.quizDate,
      table.location,
    ),
    check("scores_out_of_greater_than_zero", sql`${table.outOf} > 0`),
    pgPolicy("team member can create score", {
      for: "insert",
      to: authenticatedRole,
      withCheck: sql`private.is_team_member(${table.team})`,
    }),
    pgPolicy("team member can select score", {
      for: "select",
      to: authenticatedRole,
      using: sql`private.is_team_member(${table.team})`,
    }),
    pgPolicy("team member can update score", {
      for: "update",
      to: authenticatedRole,
      using: sql`private.is_team_member(${table.team})`,
      withCheck: sql`private.is_team_member(${table.team})`,
    }),
  ],
);

export const scoresRelations = relations(scores, ({ one }) => ({
  team: one(teams, {
    fields: [scores.team],
    references: [teams.slug],
  }),
  location: one(locations, {
    fields: [scores.location, scores.team],
    references: [locations.slug, locations.team],
  }),
}));
