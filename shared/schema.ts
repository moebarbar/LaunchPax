import { sql } from "drizzle-orm";
import { pgTable, text, varchar, serial, integer, timestamp, jsonb, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Re-export auth models
export * from "./models/auth";

// ============================================================================
// PROJECTS - Isolated website/app instances following Replit-style architecture
// ============================================================================
export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull(),
  name: text("name").notNull(),
  
  // Business context for generation
  industry: text("industry"),
  location: text("location"),
  targetAudience: text("target_audience"),
  tone: text("tone"),
  budget: text("budget"),
  businessIdea: text("business_idea"),
  
  // Project template & config
  templateId: text("template_id").default("default"),
  config: jsonb("config").$type<ProjectConfig>(),
  
  // Build state
  buildStatus: text("build_status").default("draft"), // draft, building, ready, error
  previewUrl: text("preview_url"),
  
  status: text("status").default("active").notNull(),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
  updatedAt: timestamp("updated_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export interface ProjectConfig {
  selectedDomain?: string;
  brandKit?: {
    primaryColor?: string;
    secondaryColor?: string;
    font?: string;
  };
  template?: string;
}

export const insertProjectSchema = createInsertSchema(projects).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type Project = typeof projects.$inferSelect;
export type InsertProject = z.infer<typeof insertProjectSchema>;

// ============================================================================
// ACTIVITY LOGS - Track all workflow actions per project
// ============================================================================
export const activityLogs = pgTable("activity_logs", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id").notNull().references(() => projects.id, { onDelete: "cascade" }),
  action: text("action").notNull(),
  details: text("details"),
  connectorKey: text("connector_key"),
  status: text("status").default("completed").notNull(),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export const insertActivityLogSchema = createInsertSchema(activityLogs).omit({
  id: true,
  createdAt: true,
});

export type ActivityLog = typeof activityLogs.$inferSelect;
export type InsertActivityLog = z.infer<typeof insertActivityLogSchema>;

// ============================================================================
// NAMING RESULTS - Stores name generation and domain check results
// ============================================================================
export const namingResults = pgTable("naming_results", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id").notNull().references(() => projects.id, { onDelete: "cascade" }),
  candidates: jsonb("candidates").$type<string[]>().default([]),
  domainCandidates: jsonb("domain_candidates").$type<{ name: string; domain: string; tld: string }[]>().default([]),
  availableDomains: jsonb("available_domains").$type<DomainCheckResult[]>().default([]),
  selectedDomain: text("selected_domain"),
  customDomain: text("custom_domain"), // User's own domain (BYOD)
  isCustomDomain: boolean("is_custom_domain").default(false), // Whether using own domain
  favorites: jsonb("favorites").$type<string[]>().default([]),
  providerUsed: text("provider_used"), // Track which connector was used
  status: text("status").default("pending").notNull(),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
  updatedAt: timestamp("updated_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export interface DomainCheckResult {
  domain: string;
  available: boolean;
  price?: number;
  currency?: string;
  provider?: string;
}

export const insertNamingResultSchema = createInsertSchema(namingResults).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type NamingResult = typeof namingResults.$inferSelect;
export type InsertNamingResult = z.infer<typeof insertNamingResultSchema>;

// ============================================================================
// BRAND KIT - Stores brand identity generation results
// ============================================================================
export const brandKits = pgTable("brand_kits", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id").notNull().references(() => projects.id, { onDelete: "cascade" }),
  brandVoice: text("brand_voice"),
  taglines: jsonb("taglines").$type<string[]>().default([]),
  colorPalette: jsonb("color_palette").$type<ColorPaletteItem[]>().default([]),
  fontPairings: jsonb("font_pairings").$type<FontPairing[]>().default([]),
  messagingPillars: jsonb("messaging_pillars").$type<MessagingPillar[]>().default([]),
  elevatorPitch: text("elevator_pitch"),
  providerUsed: text("provider_used"),
  status: text("status").default("pending").notNull(),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
  updatedAt: timestamp("updated_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export interface ColorPaletteItem {
  name: string;
  hex: string;
  usage: string;
}

export interface FontPairing {
  heading: string;
  body: string;
  accent?: string;
}

export interface MessagingPillar {
  title: string;
  description: string;
}

export const insertBrandKitSchema = createInsertSchema(brandKits).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type BrandKit = typeof brandKits.$inferSelect;
export type InsertBrandKit = z.infer<typeof insertBrandKitSchema>;

// ============================================================================
// WEBSITE CONTENT - Stores STRUCTURED JSON content (not raw HTML)
// Following Replit-style: content is data, templates render it
// ============================================================================
export const websiteContents = pgTable("website_contents", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id").notNull().references(() => projects.id, { onDelete: "cascade" }),
  
  // Preview token for secure public access
  previewToken: text("preview_token").notNull().default(sql`gen_random_uuid()`),
  
  // Structured content - JSON, NOT HTML
  pages: jsonb("pages").$type<PageContent[]>().default([]),
  globalContent: jsonb("global_content").$type<GlobalContent>(),
  
  // Site configuration
  siteSettings: jsonb("site_settings").$type<SiteSettings>(),
  
  // SEO metadata
  seo: jsonb("seo").$type<SeoMeta>(),
  
  // Build metadata
  templateId: text("template_id").default("default"),
  version: integer("version").default(1),
  
  providerUsed: text("provider_used"),
  status: text("status").default("pending").notNull(),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
  updatedAt: timestamp("updated_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export interface PageContent {
  slug: string;
  title: string;
  metaDescription?: string;
  sections: SectionContent[];
}

export interface SectionContent {
  id: string;
  type: string; // "hero" | "features" | "cta" | "testimonials" | "pricing" | "contact" | "text"
  data: Record<string, unknown>; // Component-specific structured data
}

export interface GlobalContent {
  siteName?: string;
  logo?: string;
  navigation?: { label: string; href: string }[];
  footer?: {
    copyright?: string;
    links?: { label: string; href: string }[];
    socialLinks?: { platform: string; url: string }[];
  };
}

export interface SiteSettings {
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
  fontFamily?: string;
  headingFont?: string;
  style?: string; // "modern" | "minimal" | "bold" | "classic"
}

export interface SeoMeta {
  title?: string;
  description?: string;
  keywords?: string[];
  ogImage?: string;
  ogType?: string;
  ogUrl?: string;
  twitterCard?: string;
  canonicalUrl?: string;
}

export const insertWebsiteContentSchema = createInsertSchema(websiteContents).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type WebsiteContent = typeof websiteContents.$inferSelect;
export type InsertWebsiteContent = z.infer<typeof insertWebsiteContentSchema>;

// ============================================================================
// GRAPHIC ASSETS - Design briefs and generated graphics
// ============================================================================
export const graphicAssets = pgTable("graphic_assets", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id").notNull().references(() => projects.id, { onDelete: "cascade" }),
  type: text("type").notNull(), // "instagram_post" | "story" | "facebook_ad" | "logo" | "og_image"
  name: text("name").notNull(),
  dimensions: text("dimensions"),
  designBrief: jsonb("design_brief").$type<DesignBrief>(),
  copyText: text("copy_text"),
  imageUrl: text("image_url"),
  providerUsed: text("provider_used"),
  status: text("status").default("draft").notNull(),
  metadata: jsonb("metadata").$type<Record<string, unknown>>(),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
  updatedAt: timestamp("updated_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export interface DesignBrief {
  prompt?: string;
  style?: string;
  colors?: string[];
  elements?: string[];
  mood?: string;
}

export const insertGraphicAssetSchema = createInsertSchema(graphicAssets).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type GraphicAsset = typeof graphicAssets.$inferSelect;
export type InsertGraphicAsset = z.infer<typeof insertGraphicAssetSchema>;

// ============================================================================
// WORKFLOW JOBS - Track async workflow execution
// ============================================================================
export const workflowJobs = pgTable("workflow_jobs", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id").notNull().references(() => projects.id, { onDelete: "cascade" }),
  workflowType: text("workflow_type").notNull(),
  status: text("status").default("pending").notNull(), // pending, running, completed, failed
  progress: integer("progress").default(0),
  result: jsonb("result").$type<Record<string, unknown>>(),
  error: text("error"),
  connectorUsed: text("connector_used"),
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

// ============================================================================
// CONNECTOR CONFIGURATIONS - Universal API connector settings
// ============================================================================
export const connectorConfigs = pgTable("connector_configs", {
  id: serial("id").primaryKey(),
  connectorKey: text("connector_key").notNull().unique(),
  isEnabled: boolean("is_enabled").default(false),
  priority: integer("priority").default(0), // Higher = preferred when multiple connectors available
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

// ============================================================================
// CONNECTOR ABSTRACTION LAYER TYPES
// Universal interface for all external API integrations
// ============================================================================

// Connector capability definitions - what services can connectors provide?
export type ConnectorCapability = 
  | "name_generation"      // Generate business names
  | "domain_check"         // Check domain availability
  | "domain_register"      // Register domains
  | "brand_generation"     // Generate brand kits
  | "content_generation"   // Generate website content
  | "image_generation"     // Generate images/graphics
  | "text_generation"      // General text/copy generation
  | "translation"          // Translate content
  | "hosting"              // Host/deploy websites
  | "analytics"            // Analytics integration
  | "email"                // Email services
  | "payments"             // Payment processing
  | "social_media";        // Social media APIs

// Task types that connectors can execute
export interface ConnectorTask<T = unknown> {
  capability: ConnectorCapability;
  action: string;
  input: T;
  options?: Record<string, unknown>;
}

// Standard result format from all connectors
export interface ConnectorResult<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  provider: string;
  metadata?: Record<string, unknown>;
}

// Connector definition interface - implemented by each connector
export interface ConnectorDefinition {
  key: string;
  name: string;
  description: string;
  category: string;
  capabilities: ConnectorCapability[];
  authType: "none" | "apiKey" | "oauth" | "bearer";
  requiredEnvVars: string[];
  optionalEnvVars?: string[];
  
  // Runtime methods
  isConfigured: () => boolean;
  test: () => Promise<{ ok: boolean; message: string }>;
  execute: <I, O>(task: ConnectorTask<I>) => Promise<ConnectorResult<O>>;
}

// Connector info for frontend display
export interface ConnectorInfo {
  key: string;
  name: string;
  description: string;
  category: string;
  capabilities: ConnectorCapability[];
  authType: string;
  requiredEnvVars: string[];
  isConfigured: boolean;
  testStatus?: string;
  lastTestedAt?: string;
  priority?: number;
}
