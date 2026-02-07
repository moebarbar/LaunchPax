import type { Express, Request, Response } from "express";
import { isAuthenticated } from "../replit_integrations/auth";
import { connectorRegistry } from "../connectors";
import { storage } from "../storage";

export function registerConnectorsRoutes(app: Express): void {
  app.get("/api/connectors", isAuthenticated, async (_req: Request, res: Response) => {
    const connectors = connectorRegistry.getAllInfo();
    res.json(connectors);
  });

  app.post("/api/connectors/:key/test", isAuthenticated, async (req: Request, res: Response) => {
    const key = Array.isArray(req.params.key) ? req.params.key[0] : req.params.key;
    const result = await connectorRegistry.test(key);

    await storage.upsertConnectorConfig({
      connectorKey: key,
      testStatus: result.ok ? "ok" : result.message,
      lastTestedAt: new Date(),
    });

    res.json(result);
  });
}
