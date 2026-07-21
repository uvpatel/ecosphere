import { pgTable, text, integer, doublePrecision, boolean, jsonb } from "drizzle-orm/pg-core";

// --- Master Data ---

export const departments = pgTable("departments", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  code: text("code").notNull(),
  head: text("head").notNull(),
  parentDepartment: text("parent_department"),
  employeeCount: integer("employee_count").notNull().default(0),
  status: text("status").notNull().default("Active"), // Active, Inactive
});

export const categories = pgTable("categories", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  type: text("type").notNull(), // CSR Activity, Challenge
  status: text("status").notNull().default("Active"),
});

export const emissionFactors = pgTable("emission_factors", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  category: text("category").notNull(), // Electricity, Natural Gas, Diesel, Petrol, Waste
  factor: doublePrecision("factor").notNull(),
  unit: text("unit").notNull(),
  status: text("status").notNull().default("Active"),
});

export const products = pgTable("products", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  sku: text("sku").notNull(),
  carbonFootprint: doublePrecision("carbon_footprint").notNull(),
  recycledMaterialPct: integer("recycled_material_pct").notNull().default(0),
  ethicalSourcingRating: text("ethical_sourcing_rating").notNull(), // A, B, C, D, F
});

export const goals = pgTable("goals", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  targetValue: doublePrecision("target_value").notNull(),
  currentValue: doublePrecision("current_value").notNull(),
  unit: text("unit").notNull(),
  category: text("category").notNull(),
  deadline: text("deadline").notNull(),
  status: text("status").notNull().default("In Progress"), // In Progress, Achieved, Missed
});

export const policies = pgTable("policies", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  code: text("code").notNull(),
  category: text("category").notNull(), // Environmental, Social, Governance
  version: text("version").notNull(),
  publishDate: text("publish_date").notNull(),
  status: text("status").notNull().default("Active"), // Active, Archived
  content: text("content").notNull(),
});

export const badges = pgTable("badges", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  unlockRuleType: text("unlock_rule_type").notNull(), // xp, challenges
  unlockRuleValue: integer("unlock_rule_value").notNull(),
  icon: text("icon").notNull(),
});

export const rewards = pgTable("rewards", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  pointsRequired: integer("points_required").notNull(),
  stock: integer("stock").notNull().default(0),
  status: text("status").notNull().default("Active"),
});

// --- Transactional Data ---

export const carbonTransactions = pgTable("carbon_transactions", {
  id: text("id").primaryKey(),
  sourceType: text("source_type").notNull(), // Purchase, Manufacturing, Expenses, Fleet
  sourceId: text("source_id").notNull(),
  description: text("description").notNull(),
  departmentId: text("department_id").notNull(),
  quantity: doublePrecision("quantity").notNull(),
  unit: text("unit").notNull(),
  emissionFactorId: text("emission_factor_id").notNull(),
  calculatedEmissions: doublePrecision("calculated_emissions").notNull(),
  date: text("date").notNull(),
});

export const csrActivities = pgTable("csr_activities", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  category: text("category").notNull(),
  description: text("description").notNull(),
  date: text("date").notNull(),
  location: text("location").notNull(),
  points: integer("points").notNull(),
  maxParticipants: integer("max_participants").notNull(),
  status: text("status").notNull().default("Upcoming"), // Upcoming, Completed, Cancelled
});

export const employeeParticipations = pgTable("employee_participations", {
  id: text("id").primaryKey(),
  employeeId: text("employee_id").notNull(),
  employeeName: text("employee_name").notNull(),
  activityId: text("activity_id").notNull(),
  activityTitle: text("activity_title").notNull(),
  proofUrl: text("proof_url"),
  proofName: text("proof_name"),
  approvalStatus: text("approval_status").notNull().default("Under Review"), // Under Review, Approved, Rejected
  pointsEarned: integer("points_earned").notNull(),
  completionDate: text("completion_date").notNull(),
});

export const challenges = pgTable("challenges", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  category: text("category").notNull(),
  description: text("description").notNull(),
  xp: integer("xp").notNull(),
  difficulty: text("difficulty").notNull(), // Easy, Medium, Hard
  evidenceRequired: boolean("evidence_required").notNull().default(true),
  deadline: text("deadline").notNull(),
  status: text("status").notNull().default("Draft"), // Draft, Active, Under Review, Completed, Archived
});

export const challengeParticipations = pgTable("challenge_participations", {
  id: text("id").primaryKey(),
  challengeId: text("challenge_id").notNull(),
  challengeTitle: text("challenge_title").notNull(),
  employeeId: text("employee_id").notNull(),
  employeeName: text("employee_name").notNull(),
  progress: integer("progress").notNull().default(0), // percentage
  proofUrl: text("proof_url"),
  proofName: text("proof_name"),
  approvalStatus: text("approval_status").notNull().default("Under Review"), // Under Review, Approved, Rejected
  xpAwarded: integer("xp_awarded").notNull(),
  completionDate: text("completion_date"),
});

export const policyAcknowledgements = pgTable("policy_acknowledgements", {
  id: text("id").primaryKey(),
  policyId: text("policy_id").notNull(),
  policyTitle: text("policy_title").notNull(),
  employeeId: text("employee_id").notNull(),
  employeeName: text("employee_name").notNull(),
  acknowledgedDate: text("acknowledged_date").notNull(),
});

export const audits = pgTable("audits", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  type: text("type").notNull(), // Internal, External
  scope: text("scope").notNull(),
  leadAuditor: text("lead_auditor").notNull(),
  date: text("date").notNull(),
  status: text("status").notNull().default("Scheduled"), // Scheduled, In Progress, Completed
  findingsCount: integer("findings_count").notNull().default(0),
});

export const complianceIssues = pgTable("compliance_issues", {
  id: text("id").primaryKey(),
  auditId: text("audit_id"),
  severity: text("severity").notNull(), // Low, Medium, High, Critical
  description: text("description").notNull(),
  owner: text("owner").notNull(),
  dueDate: text("due_date").notNull(),
  status: text("status").notNull().default("Open"), // Open, In Progress, Resolved
});

export const notifications = pgTable("notifications", {
  id: text("id").primaryKey(),
  type: text("type").notNull(), // compliance, approval, policy, badge, system
  title: text("title").notNull(),
  message: text("message").notNull(),
  date: text("date").notNull(),
  read: boolean("read").notNull().default(false),
});

// --- System & User Session Data ---

export const simulatedUsers = pgTable("simulated_users", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  role: text("role").notNull(), // Admin, Employee
  departmentId: text("department_id").notNull(),
  xp: integer("xp").notNull().default(0),
  points: integer("points").notNull().default(0),
  badges: jsonb("badges").notNull().default([]), // Array of badge IDs
});

export const settings = pgTable("settings", {
  id: text("id").primaryKey(), // "global"
  weightEnvironmental: integer("weight_environmental").notNull().default(40),
  weightSocial: integer("weight_social").notNull().default(30),
  weightGovernance: integer("weight_governance").notNull().default(30),
  autoEmissionCalculation: boolean("auto_emission_calculation").notNull().default(true),
  evidenceRequirement: boolean("evidence_requirement").notNull().default(true),
  badgeAutoAward: boolean("badge_auto_award").notNull().default(true),
});
