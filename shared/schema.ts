import { sql } from "drizzle-orm";
import { pgTable, text, varchar, serial, integer, timestamp, jsonb, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Re-export auth models
export * from "./models/auth";

// Projects - each represents a business being launched
export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull(),
  name: text("name").notNull(),
  industry: text("industry"),
  location: text("location"),
  targetAudience: text("target_audience"),
  tone: text("tone"),
  budget: text("budget"),
  businessIdea: text("business_idea"),
  status: text("status").default("active").notNull(),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
  updatedAt: timestamp("updated_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export const insertProjectSchema = createInsertSchema(projects).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type Project = typeof projects.$inferSelect;
export type InsertProject = z.infer<typeof insertProjectSchema>;

// Activity Log - tracks all workflow actions per project
export const activityLogs = pgTable("activity_logs", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id").notNull().references(() => projects.id, { onDelete: "cascade" }),
  action: text("action").notNull(),
  details: text("details"),
  status: text("status").default("completed").notNull(),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export const insertActivityLogSchema = createInsertSchema(activityLogs).omit({
  id: true,
  createdAt: true,
});

export type ActivityLog = typeof activityLogs.$inferSelect;
export type InsertActivityLog = z.infer<typeof insertActivityLogSchema>;

// Naming Results - stores name generation and domain check results
export const namingResults = pgTable("naming_results", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id").notNull().references(() => projects.id, { onDelete: "cascade" }),
  candidates: jsonb("candidates").$type<string[]>().default([]),
  domainCandidates: jsonb("domain_candidates").$type<{ name: string; domain: string; tld: string }[]>().default([]),
  availableDomains: jsonb("available_domains").$type<{ domain: string; available: boolean; price?: number }[]>().default([]),
  selectedDomain: text("selected_domain"),
  favorites: jsonb("favorites").$type<string[]>().default([]),
  status: text("status").default("pending").notNull(),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
  updatedAt: timestamp("updated_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export const insertNamingResultSchema = createInsertSchema(namingResults).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type NamingResult = typeof namingResults.$inferSelect;
export type InsertNamingResult = z.infer<typeof insertNamingResultSchema>;

// Brand Kit - stores brand identity generation results
export const brandKits = pgTable("brand_kits", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id").notNull().references(() => projects.id, { onDelete: "cascade" }),
  brandVoice: text("brand_voice"),
  taglines: jsonb("taglines").$type<string[]>().default([]),
  colorPalette: jsonb("color_palette").$type<{ name: string; hex: string; usage: string }[]>().default([]),
  fontPairings: jsonb("font_pairings").$type<{ heading: string; body: string; accent?: string }[]>().default([]),
  messagingPillars: jsonb("messaging_pillars").$type<{ title: string; description: string }[]>().default([]),
  elevatorPitch: text("elevator_pitch"),
  status: text("status").default("pending").notNull(),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
  updatedAt: timestamp("updated_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export const insertBrandKitSchema = createInsertSchema(brandKits).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type BrandKit = typeof brandKits.$inferSelect;
export type InsertBrandKit = z.infer<typeof insertBrandKitSchema>;

// Website Plan - stores website scaffold and page content
export const websitePlans = pgTable("website_plans", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id").notNull().references(() => projects.id, { onDelete: "cascade" }),
  pages: jsonb("pages").$type<{
    slug: string;
    title: string;
    sections: {
      type: string;
      headline?: string;
      content?: string;
      items?: string[];
    }[];
  }[]>().default([]),
  siteSettings: jsonb("site_settings").$type<{
    primaryColor?: string;
    font?: string;
    style?: string;
  }>(),
  status: text("status").default("pending").notNull(),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
  updatedAt: timestamp("updated_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export const insertWebsitePlanSchema = createInsertSchema(websitePlans).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type WebsitePlan = typeof websitePlans.$inferSelect;
export type InsertWebsitePlan = z.infer<typeof insertWebsitePlanSchema>;

// Graphic Assets - stores ready-to-post graphics and design briefs
export const graphicAssets = pgTable("graphic_assets", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id").notNull().references(() => projects.id, { onDelete: "cascade" }),
  type: text("type").notNull(), // "instagram_post", "story", "facebook_ad"
  name: text("name").notNull(),
  dimensions: text("dimensions"), // "1080x1080", "1080x1920"
  designBrief: text("design_brief"),
  copyText: text("copy_text"),
  imageUrl: text("image_url"),
  status: text("status").default("draft").notNull(),
  metadata: jsonb("metadata").$type<Record<string, unknown>>(),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
  updatedAt: timestamp("updated_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export const insertGraphicAssetSchema = createInsertSchema(graphicAssets).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type GraphicAsset = typeof graphicAssets.$inferSelect;
export type InsertGraphicAsset = z.infer<typeof insertGraphicAssetSchema>;

// Workflow Jobs - tracks async workflow execution
export const workflowJobs = pgTable("workflow_jobs", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id").notNull().references(() => projects.id, { onDelete: "cascade" }),
  workflowType: text("workflow_type").notNull(),
  status: text("status").default("pending").notNull(), // pending, running, completed, failed
  progress: integer("progress").default(0),
  result: jsonb("result").$type<Record<string, unknown>>(),
  error: text("error"),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
  updatedAt: timestamp("updated_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export const insertWorkflowJobSchema = createInsertSchema(workflowJobs).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type WorkflowJob = typeof workflowJobs.$inferSelect;
export type InsertWorkflowJob = z.infer<typeof insertWorkflowJobSchema>;

// Connector configuration - stores connector settings
export const connectorConfigs = pgTable("connector_configs", {
  id: serial("id").primaryKey(),
  connectorKey: text("connector_key").notNull().unique(),
  isEnabled: boolean("is_enabled").default(false),
  settings: jsonb("settings").$type<Record<string, unknown>>(),
  lastTestedAt: timestamp("last_tested_at"),
  testStatus: text("test_status"),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
  updatedAt: timestamp("updated_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export const insertConnectorConfigSchema = createInsertSchema(connectorConfigs).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type ConnectorConfig = typeof connectorConfigs.$inferSelect;
export type InsertConnectorConfig = z.infer<typeof insertConnectorConfigSchema>;

// Connector interface types
export interface ConnectorTask {
  type: string;
  input: Record<string, unknown>;
}

export interface ConnectorResult {
  success: boolean;
  data?: unknown;
  error?: string;
}

export interface Connector {
  key: string;
  name: string;
  description: string;
  category: string;
  authType: "none" | "apiKey" | "oauth";
  requiredEnvVars: string[];
  isConfigured: () => boolean;
  test: () => Promise<{ ok: boolean; message: string }>;
  run: (task: ConnectorTask) => Promise<ConnectorResult>;
}
