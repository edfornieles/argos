import React from 'react';
import { useSimulationStore } from '../../../state/simulation';
import { WebSocketService } from '../../services/websocket';

interface SpawnAgentButtonProps {
  className?: string;
  wsService: WebSocketService;
}

export const SpawnAgentButton: React.FC<SpawnAgentButtonProps> = ({ className = '', wsService }) => {
  const { isRunning } = useSimulationStore();

  const handleSpawnAgent = () => {
    if (!isRunning) return;

    wsService.spawnAgent({
      name: "New Agent",
      role: "Assistant",
      systemPrompt: "You are a helpful assistant.",
      appearance: "A friendly AI assistant",
      tools: ["speak", "think", "reflect"],
      platform: "void",
      initialGoals: ["initial_interaction"]
    });
  };

  return (
    <button
      onClick={handleSpawnAgent}
      disabled={!isRunning}
      className={`px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 ${className}`}
    >
      + Agent
    </button>
  );
}; 