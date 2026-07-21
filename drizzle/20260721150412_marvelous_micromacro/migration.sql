CREATE TABLE "audits" (
	"id" text PRIMARY KEY,
	"title" text NOT NULL,
	"type" text NOT NULL,
	"scope" text NOT NULL,
	"lead_auditor" text NOT NULL,
	"date" text NOT NULL,
	"status" text DEFAULT 'Scheduled' NOT NULL,
	"findings_count" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "badges" (
	"id" text PRIMARY KEY,
	"name" text NOT NULL,
	"description" text NOT NULL,
	"unlock_rule_type" text NOT NULL,
	"unlock_rule_value" integer NOT NULL,
	"icon" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "carbon_transactions" (
	"id" text PRIMARY KEY,
	"source_type" text NOT NULL,
	"source_id" text NOT NULL,
	"description" text NOT NULL,
	"department_id" text NOT NULL,
	"quantity" double precision NOT NULL,
	"unit" text NOT NULL,
	"emission_factor_id" text NOT NULL,
	"calculated_emissions" double precision NOT NULL,
	"date" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "categories" (
	"id" text PRIMARY KEY,
	"name" text NOT NULL,
	"type" text NOT NULL,
	"status" text DEFAULT 'Active' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "challenge_participations" (
	"id" text PRIMARY KEY,
	"challenge_id" text NOT NULL,
	"challenge_title" text NOT NULL,
	"employee_id" text NOT NULL,
	"employee_name" text NOT NULL,
	"progress" integer DEFAULT 0 NOT NULL,
	"proof_url" text,
	"proof_name" text,
	"approval_status" text DEFAULT 'Under Review' NOT NULL,
	"xp_awarded" integer NOT NULL,
	"completion_date" text
);
--> statement-breakpoint
CREATE TABLE "challenges" (
	"id" text PRIMARY KEY,
	"title" text NOT NULL,
	"category" text NOT NULL,
	"description" text NOT NULL,
	"xp" integer NOT NULL,
	"difficulty" text NOT NULL,
	"evidence_required" boolean DEFAULT true NOT NULL,
	"deadline" text NOT NULL,
	"status" text DEFAULT 'Draft' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "compliance_issues" (
	"id" text PRIMARY KEY,
	"audit_id" text,
	"severity" text NOT NULL,
	"description" text NOT NULL,
	"owner" text NOT NULL,
	"due_date" text NOT NULL,
	"status" text DEFAULT 'Open' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "csr_activities" (
	"id" text PRIMARY KEY,
	"title" text NOT NULL,
	"category" text NOT NULL,
	"description" text NOT NULL,
	"date" text NOT NULL,
	"location" text NOT NULL,
	"points" integer NOT NULL,
	"max_participants" integer NOT NULL,
	"status" text DEFAULT 'Upcoming' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "departments" (
	"id" text PRIMARY KEY,
	"name" text NOT NULL,
	"code" text NOT NULL,
	"head" text NOT NULL,
	"parent_department" text,
	"employee_count" integer DEFAULT 0 NOT NULL,
	"status" text DEFAULT 'Active' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "emission_factors" (
	"id" text PRIMARY KEY,
	"name" text NOT NULL,
	"category" text NOT NULL,
	"factor" double precision NOT NULL,
	"unit" text NOT NULL,
	"status" text DEFAULT 'Active' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "employee_participations" (
	"id" text PRIMARY KEY,
	"employee_id" text NOT NULL,
	"employee_name" text NOT NULL,
	"activity_id" text NOT NULL,
	"activity_title" text NOT NULL,
	"proof_url" text,
	"proof_name" text,
	"approval_status" text DEFAULT 'Under Review' NOT NULL,
	"points_earned" integer NOT NULL,
	"completion_date" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "goals" (
	"id" text PRIMARY KEY,
	"title" text NOT NULL,
	"target_value" double precision NOT NULL,
	"current_value" double precision NOT NULL,
	"unit" text NOT NULL,
	"category" text NOT NULL,
	"deadline" text NOT NULL,
	"status" text DEFAULT 'In Progress' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "notifications" (
	"id" text PRIMARY KEY,
	"type" text NOT NULL,
	"title" text NOT NULL,
	"message" text NOT NULL,
	"date" text NOT NULL,
	"read" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE "policies" (
	"id" text PRIMARY KEY,
	"title" text NOT NULL,
	"code" text NOT NULL,
	"category" text NOT NULL,
	"version" text NOT NULL,
	"publish_date" text NOT NULL,
	"status" text DEFAULT 'Active' NOT NULL,
	"content" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "policy_acknowledgements" (
	"id" text PRIMARY KEY,
	"policy_id" text NOT NULL,
	"policy_title" text NOT NULL,
	"employee_id" text NOT NULL,
	"employee_name" text NOT NULL,
	"acknowledged_date" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "products" (
	"id" text PRIMARY KEY,
	"name" text NOT NULL,
	"sku" text NOT NULL,
	"carbon_footprint" double precision NOT NULL,
	"recycled_material_pct" integer DEFAULT 0 NOT NULL,
	"ethical_sourcing_rating" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "rewards" (
	"id" text PRIMARY KEY,
	"name" text NOT NULL,
	"description" text NOT NULL,
	"points_required" integer NOT NULL,
	"stock" integer DEFAULT 0 NOT NULL,
	"status" text DEFAULT 'Active' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "settings" (
	"id" text PRIMARY KEY,
	"weight_environmental" integer DEFAULT 40 NOT NULL,
	"weight_social" integer DEFAULT 30 NOT NULL,
	"weight_governance" integer DEFAULT 30 NOT NULL,
	"auto_emission_calculation" boolean DEFAULT true NOT NULL,
	"evidence_requirement" boolean DEFAULT true NOT NULL,
	"badge_auto_award" boolean DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE TABLE "simulated_users" (
	"id" text PRIMARY KEY,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"role" text NOT NULL,
	"department_id" text NOT NULL,
	"xp" integer DEFAULT 0 NOT NULL,
	"points" integer DEFAULT 0 NOT NULL,
	"badges" jsonb DEFAULT '[]' NOT NULL
);
--> statement-breakpoint
DROP TABLE "users";