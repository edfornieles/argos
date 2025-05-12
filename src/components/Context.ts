import { z } from "zod";
import { createComponent } from "./createComponent";

// Context schema and component
export const ContextSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  type: z.string(),
  metadata: z.record(z.any()),
  created_at: z.number(),
  creator: z.string(),
  active: z.number(),
});

export const ContextComponent = createComponent("Context", ContextSchema, {
  id: [] as string[],
  name: [] as string[],
  description: [] as string[],
  type: [] as string[],
  metadata: [] as Record<string, any>[],
  created_at: [] as number[],
  creator: [] as string[],
  active: [] as number[],
});

export const Context = ContextComponent.component; 