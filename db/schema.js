import { sql } from "drizzle-orm";
import { boolean, integer, jsonb, pgTable, primaryKey, text, timestamp } from "drizzle-orm/pg-core";

const ts = (name) => timestamp(name, { withTimezone: true, mode: "string" }).notNull().defaultNow();

export const visualizerSessions = pgTable("visualizer_sessions", {
  id: text("id").primaryKey(),
  createdAt: ts("created_at"),
  category: text("category").notNull(),
  business: jsonb("business").notNull().default(sql`'{}'::jsonb`),
  subject: jsonb("subject").notNull().default(sql`'{}'::jsonb`),
  logoKey: text("logo_key"),
  photoKey: text("photo_key"),
  inspoKey: text("inspo_key"),
  ipHash: text("ip_hash").notNull(),
  deployContext: text("deploy_context").notNull(),
  rendersUsed: integer("renders_used").notNull().default(0),
  editsUsed: integer("edits_used").notNull().default(0),
  leadId: text("lead_id"),
});

export const visualizerRenders = pgTable("visualizer_renders", {
  id: text("id").primaryKey(),
  sessionId: text("session_id").notNull(),
  parentId: text("parent_id"),
  kind: text("kind").notNull(),
  prompt: text("prompt").notNull(),
  model: text("model").notNull(),
  outputKey: text("output_key").notNull(),
  zone: jsonb("zone").notNull(),
  quad: jsonb("quad"),
  ms: integer("ms"),
  stub: boolean("stub").notNull().default(false),
  createdAt: ts("created_at"),
});

export const visualizerLeads = pgTable("visualizer_leads", {
  id: text("id").primaryKey(),
  sessionId: text("session_id").notNull(),
  createdAt: ts("created_at"),
  name: text("name").notNull(),
  phone: text("phone").notNull(),
  email: text("email").notNull(),
  timing: text("timing").notNull(),
  category: text("category").notNull(),
  renderId: text("render_id"),
  compositeKey: text("composite_key"),
  quoteLabel: text("quote_label").notNull(),
  emailStatus: text("email_status").notNull(),
  payload: jsonb("payload").notNull(),
});

export const visualizerUsage = pgTable("visualizer_usage", {
  ipHash: text("ip_hash").notNull(),
  day: text("day").notNull(),
  scans: integer("scans").notNull().default(0),
  renders: integer("renders").notNull().default(0),
  edits: integer("edits").notNull().default(0),
  leads: integer("leads").notNull().default(0),
  uploads: integer("uploads").notNull().default(0),
  logins: integer("logins").notNull().default(0),
}, (t) => [primaryKey({ columns: [t.ipHash, t.day] })]);

export const visualizerEvents = pgTable("visualizer_events", {
  id: text("id").primaryKey(),
  sessionId: text("session_id"),
  name: text("name").notNull(),
  createdAt: ts("created_at"),
  detail: jsonb("detail").notNull().default(sql`'{}'::jsonb`),
});
