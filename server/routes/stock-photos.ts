import type { Express, Request, Response } from "express";
import { z } from "zod";
import { isAuthenticated } from "../replit_integrations/auth";
import { connectorRegistry } from "../connectors";
import { parseRequest } from "./validation";

const searchQuerySchema = z.object({
  query: z.string().min(1).optional(),
  q: z.string().min(1).optional(),
  perPage: z.coerce.number().int().min(1).max(50).optional(),
  page: z.coerce.number().int().min(1).optional(),
  orientation: z.enum(["landscape", "portrait", "square"]).optional(),
  size: z.enum(["small", "medium", "large"]).optional(),
});

const curatedQuerySchema = z.object({
  perPage: z.coerce.number().int().min(1).max(50).optional(),
  page: z.coerce.number().int().min(1).optional(),
});

const industryQuerySchema = z.object({
  type: z.enum(["hero", "team", "product", "background"]).optional(),
});

export function registerStockPhotoRoutes(app: Express): void {
  app.get("/api/stock-photos/search", isAuthenticated, async (req: Request, res: Response) => {
    const queryParams = parseRequest(searchQuerySchema, req.query, res, "Invalid search query");
    if (!queryParams) return;

    const query = queryParams.query || queryParams.q;
    if (!query) {
      return res.status(400).json({ error: "Query parameter is required" });
    }

    const result = await connectorRegistry.execute(
      "stock_photos",
      "search_photos",
      {
        query,
        perPage: queryParams.perPage ?? 10,
        page: queryParams.page ?? 1,
        orientation: queryParams.orientation,
        size: queryParams.size,
      }
    );

    if (!result.success) {
      return res.status(500).json({ error: result.error });
    }

    res.json(result.data);
  });

  app.get("/api/stock-photos/curated", isAuthenticated, async (req: Request, res: Response) => {
    const queryParams = parseRequest(curatedQuerySchema, req.query, res, "Invalid curated query");
    if (!queryParams) return;

    const result = await connectorRegistry.execute("stock_photos", "get_curated", {
      perPage: queryParams.perPage ?? 10,
      page: queryParams.page ?? 1,
    });

    if (!result.success) {
      return res.status(500).json({ error: result.error });
    }

    res.json(result.data);
  });

  app.get("/api/stock-photos/industry/:industry", isAuthenticated, async (req: Request, res: Response) => {
    const queryParams = parseRequest(industryQuerySchema, req.query, res, "Invalid industry query");
    if (!queryParams) return;

    const result = await connectorRegistry.execute("stock_photos", "get_photo_for_industry", {
      industry: req.params.industry,
      type: queryParams.type,
    });

    if (!result.success) {
      return res.status(500).json({ error: result.error });
    }

    res.json(result.data);
  });
}
