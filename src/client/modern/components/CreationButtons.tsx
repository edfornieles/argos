import React from 'react';
import { useSimulationStore } from '../../../state/simulation';
import { WebSocketService } from '../../services/websocket';
import { SpawnAgentMessage, SpawnContextMessage } from "../../../types/messages";

const wsService = new WebSocketService("ws://localhost:3000");

export const CreationButtons = () => {
  const { isConnected } = useSimulationStore();

  const createNewAgent = () => {
    if (!isConnected) return;

    wsService.spawnAgent({
      name: "New Agent",
      role: "Assistant",
      systemPrompt: "You are a helpful assistant.",
      appearance: "A friendly AI assistant",
      tools: [],
      platform: "web",
      initialGoals: ["Help users with their tasks"]
    });
  };

  const createNewContext = () => {
    if (!isConnected) return;

    wsService.spawnContext({
      name: "New Context",
      description: "A new context for agents to interact with",
      type: "environment",
      metadata: {}
    });
  };

  return (
    <div className="flex gap-4">
      <button
        onClick={createNewAgent}
        disabled={!isConnected}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
      >
        Spawn Agent
      </button>
      <button
        onClick={createNewContext}
        disabled={!isConnected}
        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
      >
        Spawn Context
      </button>
    </div>
  );
}; 