/**
 * Content Cache Service
 * 
 * Caches AI-generated content to reduce API calls:
 * - Naming results cached per project
 * - Brand kit cached per project  
 * - Website content cached with invalidation on project changes
 * 
 * Cache invalidation triggers:
 * - Project businessIdea changes
 * - Project industry changes
 * - Manual regeneration request
 */

import { storage } from "../storage";

interface CacheEntry<T> {
  data: T;
  createdAt: Date;
  projectHash: string;
}

interface CacheStats {
  hits: number;
  misses: number;
  invalidations: number;
}

function hashProjectInputs(project: {
  businessIdea?: string | null;
  industry?: string | null;
  targetAudience?: string | null;
  location?: string | null;
  tone?: string | null;
}): string {
  const inputs = [
    project.businessIdea || "",
    project.industry || "",
    project.targetAudience || "",
    project.location || "",
    project.tone || "",
  ].join("|");
  
  let hash = 0;
  for (let i = 0; i < inputs.length; i++) {
    const char = inputs.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return hash.toString(36);
}

class ContentCache {
  private namingCache: Map<number, CacheEntry<any>> = new Map();
  private brandCache: Map<number, CacheEntry<any>> = new Map();
  private websiteCache: Map<number, CacheEntry<any>> = new Map();
  private stats: CacheStats = { hits: 0, misses: 0, invalidations: 0 };

  getStats(): CacheStats {
    return { ...this.stats };
  }

  resetStats(): void {
    this.stats = { hits: 0, misses: 0, invalidations: 0 };
  }

  async getNamingResult(projectId: number, project: any): Promise<any | null> {
    const cached = this.namingCache.get(projectId);
    const currentHash = hashProjectInputs(project);
    
    if (cached && cached.projectHash === currentHash) {
      const existing = await storage.getNamingResult(projectId);
      if (existing && existing.status === "completed") {
        this.stats.hits++;
        console.log(`[ContentCache] Naming cache HIT for project ${projectId}`);
        return existing;
      }
    }
    
    this.stats.misses++;
    console.log(`[ContentCache] Naming cache MISS for project ${projectId}`);
    return null;
  }

  setNamingResult(projectId: number, project: any, data: any): void {
    const hash = hashProjectInputs(project);
    this.namingCache.set(projectId, {
      data,
      createdAt: new Date(),
      projectHash: hash,
    });
    console.log(`[ContentCache] Naming cached for project ${projectId}`);
  }

  async getBrandKit(projectId: number, project: any): Promise<any | null> {
    const cached = this.brandCache.get(projectId);
    const currentHash = hashProjectInputs(project);
    
    if (cached && cached.projectHash === currentHash) {
      const existing = await storage.getBrandKit(projectId);
      if (existing && existing.status === "completed") {
        this.stats.hits++;
        console.log(`[ContentCache] Brand cache HIT for project ${projectId}`);
        return existing;
      }
    }
    
    this.stats.misses++;
    console.log(`[ContentCache] Brand cache MISS for project ${projectId}`);
    return null;
  }

  setBrandKit(projectId: number, project: any, data: any): void {
    const hash = hashProjectInputs(project);
    this.brandCache.set(projectId, {
      data,
      createdAt: new Date(),
      projectHash: hash,
    });
    console.log(`[ContentCache] Brand cached for project ${projectId}`);
  }

  async getWebsiteContent(projectId: number, project: any): Promise<any | null> {
    const cached = this.websiteCache.get(projectId);
    const currentHash = hashProjectInputs(project);
    
    if (cached && cached.projectHash === currentHash) {
      const existing = await storage.getWebsiteContent(projectId);
      if (existing && existing.status === "completed") {
        this.stats.hits++;
        console.log(`[ContentCache] Website cache HIT for project ${projectId}`);
        return existing;
      }
    }
    
    this.stats.misses++;
    console.log(`[ContentCache] Website cache MISS for project ${projectId}`);
    return null;
  }

  setWebsiteContent(projectId: number, project: any, data: any): void {
    const hash = hashProjectInputs(project);
    this.websiteCache.set(projectId, {
      data,
      createdAt: new Date(),
      projectHash: hash,
    });
    console.log(`[ContentCache] Website cached for project ${projectId}`);
  }

  invalidateProject(projectId: number): void {
    const hadNaming = this.namingCache.delete(projectId);
    const hadBrand = this.brandCache.delete(projectId);
    const hadWebsite = this.websiteCache.delete(projectId);
    
    if (hadNaming || hadBrand || hadWebsite) {
      this.stats.invalidations++;
      console.log(`[ContentCache] Cache invalidated for project ${projectId}`);
    }
  }

  invalidateAll(): void {
    const count = this.namingCache.size + this.brandCache.size + this.websiteCache.size;
    this.namingCache.clear();
    this.brandCache.clear();
    this.websiteCache.clear();
    this.stats.invalidations += count;
    console.log(`[ContentCache] All caches cleared (${count} entries)`);
  }

  getCacheInfo(): { naming: number; brand: number; website: number } {
    return {
      naming: this.namingCache.size,
      brand: this.brandCache.size,
      website: this.websiteCache.size,
    };
  }
}

export const contentCache = new ContentCache();
