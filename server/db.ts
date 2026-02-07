import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "@shared/schema";

if (!process.env.DATABASE_URL) {
  const missingEnv = ["DATABASE_URL"];
  if (process.env.AUTH_DISABLED !== "true") {
    if (!process.env.REPL_ID) missingEnv.push("REPL_ID");
    if (!process.env.SESSION_SECRET) missingEnv.push("SESSION_SECRET");
    console.error("[Startup] Missing required auth configuration.");
    console.error(`[Startup] Missing env vars: ${missingEnv.join(", ")}`);
    console.error("[Startup] Local dev: set AUTH_DISABLED=true");
    console.error("[Startup] Replit: configure missing values in Secrets/Auth pane");
    process.exit(1);
  }
  throw new Error("DATABASE_URL environment variable is required");
}

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export const db = drizzle(pool, { schema });
