import * as React from "react";
import { AgentState, ServerMessage } from "../../../types";
import { useSimulationStore } from "../../../state/simulation";
import { WebSocketService } from "../../services/websocket";

interface CharacterDetailsProps {
  agentId: string;
  onClose: () => void;
}

export function CharacterDetails({ agentId, onClose }: CharacterDetailsProps) {
  const { agents, logs } = useSimulationStore();
  const wsRef = React.useRef<WebSocketService>();
  const agent = agents.find(a => a.id === agentId);

  // Subscribe to agent updates when component mounts
  React.useEffect(() => {
    if (!agentId || !wsRef.current) return;
    wsRef.current.subscribeToAgent(agentId, "main");
    return () => {
      wsRef.current?.unsubscribeFromAgent(agentId);
    };
  }, [agentId]);

  if (!agent) return null;

  // Get recent thoughts from thoughtChain
  const recentThoughts = agent.thoughtChain.filter(thought => thought.type === 'thought');
  
  // Get perceptions from perceptions
  const perceptions = {
    visual: agent.perceptions.raw.filter(p => p.type === 'visual'),
    auditory: agent.perceptions.raw.filter(p => p.type === 'auditory'),
    social: agent.perceptions.raw.filter(p => p.type === 'social'),
    environmental: agent.perceptions.raw.filter(p => p.type === 'environmental')
  };

  return (
    <div className="h-full flex flex-col bg-gray-900 text-gray-100">
      {/* Header */}
      <div className="px-4 py-2 border-b border-cyan-900/30 flex justify-between items-center">
        <h2 className="text-emerald-400">
          <span className="text-gray-500">CHR:</span> {agent.name}
        </h2>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-300"
        >
          Close
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Current Thought */}
        <div className="bg-gray-800/50 rounded-lg p-4">
          <h3 className="text-emerald-400 mb-2">Current Thought</h3>
          <div className="text-cyan-400">
            {recentThoughts[0]?.content || "No current thought"}
          </div>
        </div>

        {/* Recent Thoughts */}
        <div className="bg-gray-800/50 rounded-lg p-4">
          <h3 className="text-emerald-400 mb-2">Recent Thoughts</h3>
          <div className="space-y-2">
            {recentThoughts.slice(1).map((thought, index: number) => (
              <div key={index} className="text-cyan-400 border-l-2 border-cyan-900/30 pl-2">
                {thought.content}
                <div className="text-xs text-gray-500 mt-1">
                  {new Date(thought.timestamp).toLocaleTimeString()}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Perceptions */}
        <div className="bg-gray-800/50 rounded-lg p-4">
          <h3 className="text-emerald-400 mb-2">Perceptions</h3>
          <div className="grid grid-cols-2 gap-4">
            {/* Visual Perceptions */}
            <div>
              <h4 className="text-emerald-400 text-sm mb-2">Visual</h4>
              <div className="space-y-2">
                {perceptions.visual.map((perception: any, index: number) => (
                  <div key={index} className="text-cyan-400 text-sm">
                    {perception.content}
                  </div>
                ))}
              </div>
            </div>

            {/* Auditory Perceptions */}
            <div>
              <h4 className="text-emerald-400 text-sm mb-2">Auditory</h4>
              <div className="space-y-2">
                {perceptions.auditory.map((perception: any, index: number) => (
                  <div key={index} className="text-cyan-400 text-sm">
                    {perception.content}
                  </div>
                ))}
              </div>
            </div>

            {/* Social Perceptions */}
            <div>
              <h4 className="text-emerald-400 text-sm mb-2">Social</h4>
              <div className="space-y-2">
                {perceptions.social.map((perception: any, index: number) => (
                  <div key={index} className="text-cyan-400 text-sm">
                    {perception.content}
                  </div>
                ))}
              </div>
            </div>

            {/* Environmental Perceptions */}
            <div>
              <h4 className="text-emerald-400 text-sm mb-2">Environmental</h4>
              <div className="space-y-2">
                {perceptions.environmental.map((perception: any, index: number) => (
                  <div key={index} className="text-cyan-400 text-sm">
                    {perception.content}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 