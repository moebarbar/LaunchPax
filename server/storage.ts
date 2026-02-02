import { eq, desc, and } from "drizzle-orm";
import { db } from "./db";
import {
  projects,
  activityLogs,
  namingResults,
  brandKits,
  websiteContents,
  graphicAssets,
  workflowJobs,
  connectorConfigs,
  type Project,
  type InsertProject,
  type ActivityLog,
  type InsertActivityLog,
  type NamingResult,
  type InsertNamingResult,
  type BrandKit,
  type InsertBrandKit,
  type WebsiteContent,
  type InsertWebsiteContent,
  type GraphicAsset,
  type InsertGraphicAsset,
  type WorkflowJob,
  type InsertWorkflowJob,
  type ConnectorConfig,
  type InsertConnectorConfig,
} from "@shared/schema";

export interface IStorage {
  // Projects
  getProjects(userId: string): Promise<Project[]>;
  getProject(id: number): Promise<Project | undefined>;
  createProject(data: InsertProject): Promise<Project>;
  updateProject(id: number, data: Partial<InsertProject>): Promise<Project | undefined>;
  deleteProject(id: number): Promise<void>;

  // Activity Logs
  getActivityLogs(projectId: number): Promise<ActivityLog[]>;
  createActivityLog(data: InsertActivityLog): Promise<ActivityLog>;

  // Naming Results
  getNamingResult(projectId: number): Promise<NamingResult | undefined>;
  upsertNamingResult(data: InsertNamingResult & { projectId: number }): Promise<NamingResult>;
  updateNamingResult(projectId: number, data: Partial<NamingResult>): Promise<NamingResult | undefined>;

  // Brand Kits
  getBrandKit(projectId: number): Promise<BrandKit | undefined>;
  upsertBrandKit(data: InsertBrandKit & { projectId: number }): Promise<BrandKit>;

  // Website Content
  getWebsiteContent(projectId: number): Promise<WebsiteContent | undefined>;
  upsertWebsiteContent(data: InsertWebsiteContent & { projectId: number }): Promise<WebsiteContent>;

  // Graphic Assets
  getGraphicAssets(projectId: number): Promise<GraphicAsset[]>;
  createGraphicAsset(data: InsertGraphicAsset): Promise<GraphicAsset>;
  updateGraphicAsset(id: number, data: Partial<GraphicAsset>): Promise<GraphicAsset | undefined>;

  // Workflow Jobs
  getWorkflowJob(projectId: number, workflowType: string): Promise<WorkflowJob | undefined>;
  createWorkflowJob(data: InsertWorkflowJob): Promise<WorkflowJob>;
  updateWorkflowJob(id: number, data: Partial<WorkflowJob>): Promise<WorkflowJob | undefined>;

  // Connector Configs
  getConnectorConfigs(): Promise<ConnectorConfig[]>;
  getConnectorConfig(key: string): Promise<ConnectorConfig | undefined>;
  upsertConnectorConfig(data: InsertConnectorConfig & { connectorKey: string }): Promise<ConnectorConfig>;
}

class DatabaseStorage implements IStorage {
  // Projects
  async getProjects(userId: string): Promise<Project[]> {
    return db.select().from(projects).where(eq(projects.userId, userId)).orderBy(desc(projects.createdAt));
  }

  async getProject(id: number): Promise<Project | undefined> {
    const [project] = await db.select().from(projects).where(eq(projects.id, id));
    return project;
  }

  async createProject(data: InsertProject): Promise<Project> {
    const [project] = await db.insert(projects).values(data).returning();
    return project;
  }

  async updateProject(id: number, data: Partial<InsertProject>): Promise<Project | undefined> {
    const [project] = await db
      .update(projects)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(projects.id, id))
      .returning();
    return project;
  }

  async deleteProject(id: number): Promise<void> {
    await db.delete(projects).where(eq(projects.id, id));
  }

  // Activity Logs
  async getActivityLogs(projectId: number): Promise<ActivityLog[]> {
    return db
      .select()
      .from(activityLogs)
      .where(eq(activityLogs.projectId, projectId))
      .orderBy(desc(activityLogs.createdAt));
  }

  async createActivityLog(data: InsertActivityLog): Promise<ActivityLog> {
    const [log] = await db.insert(activityLogs).values(data).returning();
    return log;
  }

  // Naming Results
  async getNamingResult(projectId: number): Promise<NamingResult | undefined> {
    const [result] = await db.select().from(namingResults).where(eq(namingResults.projectId, projectId));
    return result;
  }

  async upsertNamingResult(data: InsertNamingResult & { projectId: number }): Promise<NamingResult> {
    const existing = await this.getNamingResult(data.projectId);
    if (existing) {
      const [updated] = await db
        .update(namingResults)
        .set({ ...data, updatedAt: new Date() })
        .where(eq(namingResults.projectId, data.projectId))
        .returning();
      return updated;
    }
    const [created] = await db.insert(namingResults).values(data).returning();
    return created;
  }

  async updateNamingResult(projectId: number, data: Partial<NamingResult>): Promise<NamingResult | undefined> {
    const [result] = await db
      .update(namingResults)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(namingResults.projectId, projectId))
      .returning();
    return result;
  }

  // Brand Kits
  async getBrandKit(projectId: number): Promise<BrandKit | undefined> {
    const [kit] = await db.select().from(brandKits).where(eq(brandKits.projectId, projectId));
    return kit;
  }

  async upsertBrandKit(data: InsertBrandKit & { projectId: number }): Promise<BrandKit> {
    const existing = await this.getBrandKit(data.projectId);
    if (existing) {
      const [updated] = await db
        .update(brandKits)
        .set({ ...data, updatedAt: new Date() })
        .where(eq(brandKits.projectId, data.projectId))
        .returning();
      return updated;
    }
    const [created] = await db.insert(brandKits).values(data).returning();
    return created;
  }

  // Website Content
  async getWebsiteContent(projectId: number): Promise<WebsiteContent | undefined> {
    const [content] = await db.select().from(websiteContents).where(eq(websiteContents.projectId, projectId));
    return content;
  }

  async upsertWebsiteContent(data: InsertWebsiteContent & { projectId: number }): Promise<WebsiteContent> {
    const existing = await this.getWebsiteContent(data.projectId);
    if (existing) {
      const [updated] = await db
        .update(websiteContents)
        .set({ ...data, updatedAt: new Date(), version: (existing.version || 0) + 1 })
        .where(eq(websiteContents.projectId, data.projectId))
        .returning();
      return updated;
    }
    const [created] = await db.insert(websiteContents).values(data).returning();
    return created;
  }

  // Graphic Assets
  async getGraphicAssets(projectId: number): Promise<GraphicAsset[]> {
    return db
      .select()
      .from(graphicAssets)
      .where(eq(graphicAssets.projectId, projectId))
      .orderBy(desc(graphicAssets.createdAt));
  }

  async createGraphicAsset(data: InsertGraphicAsset): Promise<GraphicAsset> {
    const [asset] = await db.insert(graphicAssets).values(data).returning();
    return asset;
  }

  async updateGraphicAsset(id: number, data: Partial<GraphicAsset>): Promise<GraphicAsset | undefined> {
    const [asset] = await db
      .update(graphicAssets)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(graphicAssets.id, id))
      .returning();
    return asset;
  }

  // Workflow Jobs
  async getWorkflowJob(projectId: number, workflowType: string): Promise<WorkflowJob | undefined> {
    const [job] = await db
      .select()
      .from(workflowJobs)
      .where(and(eq(workflowJobs.projectId, projectId), eq(workflowJobs.workflowType, workflowType)))
      .orderBy(desc(workflowJobs.createdAt))
      .limit(1);
    return job;
  }

  async createWorkflowJob(data: InsertWorkflowJob): Promise<WorkflowJob> {
    const [job] = await db.insert(workflowJobs).values(data).returning();
    return job;
  }

  async updateWorkflowJob(id: number, data: Partial<WorkflowJob>): Promise<WorkflowJob | undefined> {
    const [job] = await db
      .update(workflowJobs)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(workflowJobs.id, id))
      .returning();
    return job;
  }

  // Connector Configs
  async getConnectorConfigs(): Promise<ConnectorConfig[]> {
    return db.select().from(connectorConfigs);
  }

  async getConnectorConfig(key: string): Promise<ConnectorConfig | undefined> {
    const [config] = await db.select().from(connectorConfigs).where(eq(connectorConfigs.connectorKey, key));
    return config;
  }

  async upsertConnectorConfig(data: InsertConnectorConfig & { connectorKey: string }): Promise<ConnectorConfig> {
    const existing = await this.getConnectorConfig(data.connectorKey);
    if (existing) {
      const [updated] = await db
        .update(connectorConfigs)
        .set({ ...data, updatedAt: new Date() })
        .where(eq(connectorConfigs.connectorKey, data.connectorKey))
        .returning();
      return updated;
    }
    const [created] = await db.insert(connectorConfigs).values(data).returning();
    return created;
  }
}

export const storage = new DatabaseStorage();
