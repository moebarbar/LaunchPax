import type { Response } from "express";
import { z } from "zod";

export const idParamSchema = z.object({
  id: z.coerce.number().int().positive(),
});

export const projectIdParamSchema = z.object({
  projectId: z.coerce.number().int().positive(),
});

export const workflowTypeParamSchema = z.object({
  type: z.string().min(1),
});

export function parseRequest<T>(
  schema: z.ZodSchema<T>,
  data: unknown,
  res: Response,
  message = "Invalid request"
): T | null {
  const result = schema.safeParse(data);
  if (!result.success) {
    res.status(400).json({
      message,
      issues: result.error.flatten(),
    });
    return null;
  }
  return result.data;
}
