import type { Express } from "express";
import type { Server } from "http";
import { setupAuth, registerAuthRoutes } from "../replit_integrations/auth";
import { initializeConnectors } from "../connectors";
import { registerBrandKitRoutes } from "./brand-kit";
import { registerConnectorsRoutes } from "./connectors";
import { registerEnhancementRoutes } from "./enhancement";
import { registerGraphicsRoutes } from "./graphics";
import { registerHealthRoutes } from "./health";
import { registerActivityRoutes } from "./activity";
import { registerImageManagementRoutes } from "./image-management";
import { registerImagesRoutes } from "./images";
import { registerNamingDomainRoutes } from "./naming-domain";
import { registerProjectsRoutes } from "./projects";
import { registerQualityReportRoutes } from "./quality-report";
import { registerSectionRoutes } from "./sections";
import { registerStockPhotoRoutes } from "./stock-photos";
import { registerSystemRoutes } from "./system";
import { registerVisualEditorRoutes } from "./visual-editor";
import { registerWebsiteRoutes } from "./website";
import { registerWorkflowRoutes } from "./workflows";

export async function registerRoutes(_server: Server, app: Express): Promise<void> {
  initializeConnectors();
  registerHealthRoutes(app);

  await setupAuth(app);
  registerAuthRoutes(app);

  registerProjectsRoutes(app);
  registerActivityRoutes(app);
  registerNamingDomainRoutes(app);
  registerBrandKitRoutes(app);
  registerWebsiteRoutes(app);
  registerSectionRoutes(app);
  registerVisualEditorRoutes(app);
  registerGraphicsRoutes(app);
  registerStockPhotoRoutes(app);
  registerQualityReportRoutes(app);
  registerWorkflowRoutes(app);
  registerImagesRoutes(app);
  registerConnectorsRoutes(app);
  registerImageManagementRoutes(app);
  registerEnhancementRoutes(app);
  registerSystemRoutes(app);

  void _server;
}
