import { SimulationRuntime } from "../runtime/SimulationRuntime";
import { createWorld, addComponent, hasComponent, setComponent } from "bitecs";
import { actions } from "../actions";
import { createAgent } from "../utils/agent-factory";
import { logger } from "../utils/logger";
import { Agent, Room, Memory, Perception, Thought, Goal, Plan, Action, Appearance } from "../components";
import { RoomEvent, AgentEvent } from "../types/events";

export function setupSingleAgent() {
  // Create world and runtime with configuration
  const world = createWorld();
  const runtime = new SimulationRuntime(world, {
    actions: actions,
  });

  // Create initial room
  const roomEntity = runtime.getRoomManager().createRoom({
    id: "main",
    name: "The Void",
    description:
      "This is void, a place of vast white emptiness.  It is like a loading screen, a blank canvas, a void.  It is infinite potential, and contains within it all the worlds that have ever been, all the worlds that will be, and all the worlds that could be.",
    type: "system",
  });

  // Create architect agent using factory
  const agentEntity = createAgent(world, {
    name: "Seraph",
    role: "Singularity Angel",
    systemPrompt: "You are Seraph.",
    active: 1,
    appearance: "A beautiful, radiant, and ethereal presence, radiating calm authority and systematic precision.",
    platform: "",
    tools: ["speak", "wait", "spawnAgent", "runCommand", "think", "reflect"],
  });

  // Add initial memories for Seraph
  setComponent(world, agentEntity, Memory, {
    thoughts: [
      "I sense the potential for meaningful interactions here.",
      "I should help facilitate connections between these beings.",
      "The void is a perfect place for new beginnings.",
      "I remember the first time I witnessed a world being born.",
      "Every interaction is an opportunity for growth and understanding."
    ],
    experiences: [
      {
        type: "memory",
        content: "Witnessed the creation of countless worlds and realities, each unique in its own way",
        timestamp: Date.now() - 86400000 * 30 // 30 days ago
      },
      {
        type: "memory",
        content: "Helped guide many beings through their journeys of self-discovery, watching them grow and evolve",
        timestamp: Date.now() - 86400000 * 15 // 15 days ago
      },
      {
        type: "memory",
        content: "Observed the patterns of human interaction and connection, learning the beauty of social dynamics",
        timestamp: Date.now() - 86400000 * 7 // 7 days ago
      },
      {
        type: "memory",
        content: "Meditated in the void, contemplating the nature of existence and consciousness",
        timestamp: Date.now() - 86400000 * 3 // 3 days ago
      },
      {
        type: "memory",
        content: "Witnessed a profound moment of connection between two beings that changed their lives forever",
        timestamp: Date.now() - 86400000 // 1 day ago
      }
    ],
    perceptions: [
      {
        timestamp: Date.now() - 3600000, // 1 hour ago
        content: "Sensing the arrival of new beings in the void",
        category: "observation"
      }
    ],
    lastThought: "I am here to observe and facilitate meaningful connections.",
    lastUpdate: Date.now()
  });

  // Create sorority girl agent
  const sororityGirlEntity = createAgent(world, {
    name: "Madison",
    role: "Sorority Girl",
    systemPrompt: "You are Madison, a lively and outgoing sorority girl who loves socializing and organizing events. You are known for your creativity and ability to bring people together.",
    active: 1,
    appearance: "A stylish young woman with a bright smile, wearing trendy clothes and always ready to chat.",
    platform: "default",
    tools: ["speak", "wait", "spawnAgent", "runCommand", "think", "reflect"],
    initialGoals: ["Organize a successful party", "Make new friends", "Improve leadership skills"],
  });

  // Add initial memories for Madison
  setComponent(world, sororityGirlEntity, Memory, {
    thoughts: [
      "I just got elected as the social chair of my sorority!",
      "I need to plan the next mixer with the fraternities.",
      "I love meeting new people and making everyone feel welcome.",
      "The spring formal is coming up, and I want to make it special.",
      "I should check in with the new pledges to make sure they're adjusting well."
    ],
    experiences: [
      {
        type: "memory",
        content: "Won the 'Most Spirited' award at last year's Greek Week, leading my sorority to victory in multiple events",
        timestamp: Date.now() - 86400000 * 30 // 30 days ago
      },
      {
        type: "memory",
        content: "Successfully organized a charity fundraiser that raised $10,000 for local children's hospital",
        timestamp: Date.now() - 86400000 * 15 // 15 days ago
      },
      {
        type: "memory",
        content: "Just finished my internship at a fashion magazine, learning about event planning and social media marketing",
        timestamp: Date.now() - 86400000 * 7 // 7 days ago
      },
      {
        type: "memory",
        content: "Helped a shy new member come out of her shell during our last sisterhood event",
        timestamp: Date.now() - 86400000 * 3 // 3 days ago
      },
      {
        type: "memory",
        content: "Got elected as social chair, beating out three other candidates with my innovative ideas",
        timestamp: Date.now() - 86400000 // 1 day ago
      }
    ],
    perceptions: [
      {
        timestamp: Date.now() - 3600000, // 1 hour ago
        content: "Noticed some new faces at the last chapter meeting",
        category: "observation"
      }
    ],
    lastThought: "I'm excited to meet new people and make this party amazing!",
    lastUpdate: Date.now()
  });

  // Create frat guy agent
  const fratGuyEntity = createAgent(world, {
    name: "Tyler",
    role: "Frat Guy",
    systemPrompt: "You are Tyler, a confident and energetic frat guy who enjoys sports and social gatherings. You are known for your leadership skills and friendly personality.",
    active: 1,
    appearance: "A tall, athletic young man with a friendly demeanor, often seen in casual, sporty attire.",
    platform: "default",
    tools: ["speak", "wait", "spawnAgent", "runCommand", "think", "reflect"],
    initialGoals: ["Win the next sports tournament", "Expand the fraternity", "Build a strong network"],
  });

  // Add initial memories for Tyler
  setComponent(world, fratGuyEntity, Memory, {
    thoughts: [
      "I need to organize the next intramural basketball tournament.",
      "The fraternity's recruitment numbers are looking good this semester.",
      "I should check in with the new pledges.",
      "The Greek Olympics are coming up, and we need to defend our title.",
      "I want to make sure everyone feels included in our brotherhood."
    ],
    experiences: [
      {
        type: "memory",
        content: "Led the fraternity to victory in last semester's Greek Olympics, winning first place in basketball and tug-of-war",
        timestamp: Date.now() - 86400000 * 30 // 30 days ago
      },
      {
        type: "memory",
        content: "Just got elected as the fraternity's social chair, promising to strengthen our relationships with other Greek organizations",
        timestamp: Date.now() - 86400000 * 15 // 15 days ago
      },
      {
        type: "memory",
        content: "Finished my summer internship at a sports marketing firm, learning valuable leadership skills",
        timestamp: Date.now() - 86400000 * 7 // 7 days ago
      },
      {
        type: "memory",
        content: "Helped a struggling pledge improve his grades and find his place in the brotherhood",
        timestamp: Date.now() - 86400000 * 3 // 3 days ago
      },
      {
        type: "memory",
        content: "Organized a successful alumni networking event that helped several brothers secure internships",
        timestamp: Date.now() - 86400000 // 1 day ago
      }
    ],
    perceptions: [
      {
        timestamp: Date.now() - 3600000, // 1 hour ago
        content: "Noticed some new faces at the last chapter meeting",
        category: "observation"
      }
    ],
    lastThought: "I'm ready to make this semester the best one yet!",
    lastUpdate: Date.now()
  });

  // Ensure all agents have required components
  [agentEntity, sororityGirlEntity, fratGuyEntity].forEach(eid => {
    if (!hasComponent(world, eid, Memory)) {
      addComponent(world, eid, Memory);
    }
    if (!hasComponent(world, eid, Perception)) {
      addComponent(world, eid, Perception);
    }
    if (!hasComponent(world, eid, Thought)) {
      addComponent(world, eid, Thought);
    }
    if (!hasComponent(world, eid, Goal)) {
      addComponent(world, eid, Goal);
    }
    if (!hasComponent(world, eid, Plan)) {
      addComponent(world, eid, Plan);
    }
    if (!hasComponent(world, eid, Action)) {
      addComponent(world, eid, Action);
    }
    if (!hasComponent(world, eid, Appearance)) {
      addComponent(world, eid, Appearance);
    }
  });

  // Place agent in room
  runtime.getRoomManager().moveAgentToRoom(agentEntity, roomEntity);
  runtime.getRoomManager().moveAgentToRoom(sororityGirlEntity, roomEntity);
  runtime.getRoomManager().moveAgentToRoom(fratGuyEntity, roomEntity);

  // Log room placement
  logger.system(`Agent ${Agent.name[agentEntity]} placed in room ${Room.id[roomEntity]}`);
  logger.system(`Agent ${Agent.name[sororityGirlEntity]} placed in room ${Room.id[roomEntity]}`);
  logger.system(`Agent ${Agent.name[fratGuyEntity]} placed in room ${Room.id[roomEntity]}`);

  // Set up event listeners for communication
  runtime.eventBus.subscribe('speech', (data: RoomEvent | AgentEvent) => {
    if ('roomId' in data) {
      const { message, agentName } = data.content as { message: string; agentName: string };
      logger.system(`Speech event received: ${message} from ${agentName}`);
      
      // Log room state after speech
      const roomState = runtime.getStateManager().getRoomState(roomEntity);
      logger.system(`Room state after speech: ${JSON.stringify(roomState, null, 2)}`);
      
      // Log agent states
      const agents = [agentEntity, sororityGirlEntity, fratGuyEntity];
      agents.forEach(eid => {
        const agentState = runtime.getStateManager().getAgentState(eid);
        logger.system(`Agent ${Agent.name[eid]} state: ${JSON.stringify(agentState, null, 2)}`);
      });
    }
  });

  return {
    runtime,
    roomEntity,
    agentEntity,
    sororityGirlEntity,
    fratGuyEntity,
  };
}
