import { createWorld, addComponent, hasComponent, setComponent } from "bitecs";
import { Agent, Room, Memory, Perception, Thought, Goal, Plan, Action, Appearance } from "../components";
import { createAgent } from "../utils/agent-factory";
import { logger } from "../utils/logger";

export function createUserEntity(world: number) {
  const entity = createAgent(world, {
    name: "User",
    role: "Human Observer",
    systemPrompt: "You are a human observer in the simulation.",
    active: 1,
    appearance: "A human observer",
    platform: "default",
    tools: ["speak", "wait", "think", "reflect"],
  });

  return entity;
}

export function removeUserEntity(world: number, entity: number) {
  if (hasComponent(world, Agent, entity)) {
    logger.system(`Agent removed: ${entity}`);
  }
} 