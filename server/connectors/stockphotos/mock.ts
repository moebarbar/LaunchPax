import { defineConnector } from "../registry";
import type { ConnectorTask, ConnectorResult } from "@shared/schema";
import type { StockPhoto, StockPhotoSearchResult } from "./pexels";

const mockPhotos: StockPhoto[] = [
  {
    id: "mock-1",
    url: "https://images.pexels.com/photos/3184287/pexels-photo-3184287.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    thumbnailUrl: "https://images.pexels.com/photos/3184287/pexels-photo-3184287.jpeg?auto=compress&cs=tinysrgb&w=400",
    width: 1260,
    height: 750,
    photographer: "Mock Photographer",
    photographerUrl: "https://pexels.com",
    alt: "Business team meeting",
    source: "pexels",
  },
  {
    id: "mock-2",
    url: "https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    thumbnailUrl: "https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=400",
    width: 1260,
    height: 750,
    photographer: "Mock Photographer",
    photographerUrl: "https://pexels.com",
    alt: "Team collaboration",
    source: "pexels",
  },
  {
    id: "mock-3",
    url: "https://images.pexels.com/photos/3182812/pexels-photo-3182812.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    thumbnailUrl: "https://images.pexels.com/photos/3182812/pexels-photo-3182812.jpeg?auto=compress&cs=tinysrgb&w=400",
    width: 1260,
    height: 750,
    photographer: "Mock Photographer",
    photographerUrl: "https://pexels.com",
    alt: "Modern office workspace",
    source: "pexels",
  },
  {
    id: "mock-4",
    url: "https://images.pexels.com/photos/3182746/pexels-photo-3182746.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    thumbnailUrl: "https://images.pexels.com/photos/3182746/pexels-photo-3182746.jpeg?auto=compress&cs=tinysrgb&w=400",
    width: 1260,
    height: 750,
    photographer: "Mock Photographer",
    photographerUrl: "https://pexels.com",
    alt: "Professional presentation",
    source: "pexels",
  },
  {
    id: "mock-5",
    url: "https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    thumbnailUrl: "https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=400",
    width: 1260,
    height: 750,
    photographer: "Mock Photographer",
    photographerUrl: "https://pexels.com",
    alt: "Creative brainstorming session",
    source: "pexels",
  },
];

export const stockPhotosMockConnector = defineConnector({
  key: "stockphotos_mock",
  name: "Stock Photos Mock",
  description: "Mock stock photo responses for development",
  category: "images",
  capabilities: ["stock_photos"],
  authType: "none",
  requiredEnvVars: [],
  
  isConfigured(): boolean {
    return true;
  },
  
  async test(): Promise<{ ok: boolean; message: string }> {
    return { ok: true, message: "Mock stock photos ready" };
  },
  
  async execute<I, O>(task: ConnectorTask<I>): Promise<ConnectorResult<O>> {
    switch (task.action) {
      case "search_photos":
      case "get_curated":
      case "get_photo_for_industry": {
        const input = task.input as { perPage?: number; page?: number };
        const perPage = input.perPage || 5;
        const shuffled = [...mockPhotos].sort(() => Math.random() - 0.5);
        
        return {
          success: true,
          data: {
            photos: shuffled.slice(0, perPage),
            totalResults: mockPhotos.length,
            page: 1,
            perPage,
          } as O,
          provider: "stockphotos_mock",
        };
      }
      
      default:
        return {
          success: false,
          error: `Unknown action: ${task.action}`,
          provider: "stockphotos_mock",
        };
    }
  },
});
