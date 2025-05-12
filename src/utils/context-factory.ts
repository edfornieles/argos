import { World, addEntity, setComponent } from "bitecs";
import { Context, ContextComponent } from "../components/Context";
import { logger } from "./logger";

interface ContextConfig {
  name: string;
  description: string;
  type: string;
  metadata?: Record<string, any>;
  creator?: string;
}

export function createContext(world: World, config: ContextConfig): number {
  try {
    // Create new entity
    const entity = addEntity(world);

    // Add Context component with values
    setComponent(world, entity, Context, {
      id: `context_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: config.name,
      description: config.description,
      type: config.type,
      metadata: config.metadata || {},
      created_at: Date.now(),
      creator: config.creator || "system",
      active: 1,
    });

    logger.system(`Created context: ${config.name}`);

    return entity;
  } catch (error) {
    logger.error("Failed to create context:", error);
    throw error;
  }
} 