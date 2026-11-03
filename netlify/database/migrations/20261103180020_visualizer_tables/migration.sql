CREATE TABLE "visualizer_events" (
	"id" text PRIMARY KEY,
	"session_id" text,
	"name" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"detail" jsonb DEFAULT '{}' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "visualizer_leads" (
	"id" text PRIMARY KEY,
	"session_id" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"name" text NOT NULL,
	"phone" text NOT NULL,
	"email" text NOT NULL,
	"timing" text NOT NULL,
	"category" text NOT NULL,
	"render_id" text,
	"composite_key" text,
	"quote_label" text NOT NULL,
	"email_status" text NOT NULL,
	"payload" jsonb NOT NULL
);
--> statement-breakpoint
CREATE TABLE "visualizer_renders" (
	"id" text PRIMARY KEY,
	"session_id" text NOT NULL,
	"parent_id" text,
	"kind" text NOT NULL,
	"prompt" text NOT NULL,
	"model" text NOT NULL,
	"output_key" text NOT NULL,
	"zone" jsonb NOT NULL,
	"quad" jsonb,
	"ms" integer,
	"stub" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "visualizer_sessions" (
	"id" text PRIMARY KEY,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"category" text NOT NULL,
	"business" jsonb DEFAULT '{}' NOT NULL,
	"subject" jsonb DEFAULT '{}' NOT NULL,
	"logo_key" text,
	"photo_key" text,
	"inspo_key" text,
	"ip_hash" text NOT NULL,
	"deploy_context" text NOT NULL,
	"renders_used" integer DEFAULT 0 NOT NULL,
	"edits_used" integer DEFAULT 0 NOT NULL,
	"lead_id" text
);
--> statement-breakpoint
CREATE TABLE "visualizer_usage" (
	"ip_hash" text,
	"day" text,
	"scans" integer DEFAULT 0 NOT NULL,
	"renders" integer DEFAULT 0 NOT NULL,
	"edits" integer DEFAULT 0 NOT NULL,
	"leads" integer DEFAULT 0 NOT NULL,
	"uploads" integer DEFAULT 0 NOT NULL,
	"logins" integer DEFAULT 0 NOT NULL,
	CONSTRAINT "visualizer_usage_pkey" PRIMARY KEY("ip_hash","day")
);
