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

  // Limit recent thoughts to five and update on new data
  const recentThoughts = Array.isArray((agent as any).thoughtChain)
    ? (agent as any).thoughtChain.filter((thought: any) => thought.type === 'thought').slice(0, 5)
    : [];

  // Ensure three goals are shown
  const goals = Array.isArray((agent as any).goals)
    ? (agent as any).goals.slice(0, 3)
    : [];

  // Organize memories into short, medium, and long term
  const experiences = Array.isArray((agent as any).memory?.experiences)
    ? (agent as any).memory.experiences
    : [];
  const now = Date.now();
  const shortTerm = experiences.filter((m: any) => now - m.timestamp < 1000 * 60 * 10); // last 10 min
  const mediumTerm = experiences.filter((m: any) => now - m.timestamp >= 1000 * 60 * 10 && now - m.timestamp < 1000 * 60 * 60); // 10 min - 1 hr
  const longTerm = experiences.filter((m: any) => now - m.timestamp >= 1000 * 60 * 60); // 1 hr+

  // Perceptions: ensure all categories are present
  const rawPerceptions = Array.isArray((agent as any).perceptions?.raw) ? (agent as any).perceptions.raw : [];
  const perceptions = {
    visual: rawPerceptions.filter((p: any) => p.type === 'visual'),
    auditory: rawPerceptions.filter((p: any) => p.type === 'auditory'),
    social: rawPerceptions.filter((p: any) => p.type === 'social'),
    environmental: rawPerceptions.filter((p: any) => p.type === 'environmental'),
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
        {/* Character Info */}
        <div className="bg-gray-800/50 rounded-lg p-4">
          <h3 className="text-emerald-400 mb-2">Character Info</h3>
          <div className="space-y-2">
            <div>
              <span className="text-gray-500">Role:</span>{" "}
              <span className="text-cyan-400">{(agent as any).role || "Unknown"}</span>
            </div>
            <div>
              <span className="text-gray-500">Appearance:</span>{" "}
              <span className="text-cyan-400">{(agent as any).appearance?.description || (agent as any).appearance || "No description"}</span>
            </div>
            <div>
              <span className="text-gray-500">Platform:</span>{" "}
              <span className="text-cyan-400">{(agent as any).platform || "default"}</span>
            </div>
          </div>
        </div>

        {/* Goals */}
        <div className="bg-gray-800/50 rounded-lg p-4">
          <h3 className="text-emerald-400 mb-2">Goals</h3>
          <div className="space-y-2">
            {goals.length > 0 ? (
              goals.map((goal: any, index: number) => (
                typeof goal === 'object' && goal !== null ? (
                  <div key={goal.id || index} className="text-cyan-400 border-l-2 border-cyan-900/30 pl-2">
                    {goal.description || "No description"}
                    <div className="text-xs text-gray-500 mt-1">
                      Priority: {goal.priority ?? "N/A"}
                    </div>
                  </div>
                ) : (
                  <div key={index} className="text-cyan-400 border-l-2 border-cyan-900/30 pl-2">
                    {goal}
                  </div>
                )
              ))
            ) : (
              <div className="text-gray-500">No goals</div>
            )}
          </div>
        </div>

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
            {recentThoughts.slice(1).map((thought: any, index: number) => (
              <div key={index} className="text-cyan-400 border-l-2 border-cyan-900/30 pl-2">
                {thought.content}
                <div className="text-xs text-gray-500 mt-1">
                  {new Date(thought.timestamp).toLocaleTimeString()}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Memories */}
        <div className="bg-gray-800/50 rounded-lg p-4">
          <h3 className="text-emerald-400 mb-2">Memories</h3>
          <div className="space-y-2">
            <div>
              <h4 className="text-emerald-400 text-sm mb-2">Short Term</h4>
              {shortTerm.length > 0 ? shortTerm.map((memory: any, index: number) => (
                <div key={index} className="text-cyan-400 border-l-2 border-cyan-900/30 pl-2">
                  {memory.content}
                  <div className="text-xs text-gray-500 mt-1">
                    {new Date(memory.timestamp).toLocaleTimeString()}
                  </div>
                </div>
              )) : <div className="text-gray-500">No short term memories</div>}
            </div>
            <div>
              <h4 className="text-emerald-400 text-sm mb-2">Medium Term</h4>
              {mediumTerm.length > 0 ? mediumTerm.map((memory: any, index: number) => (
                <div key={index} className="text-cyan-400 border-l-2 border-cyan-900/30 pl-2">
                  {memory.content}
                  <div className="text-xs text-gray-500 mt-1">
                    {new Date(memory.timestamp).toLocaleTimeString()}
                  </div>
                </div>
              )) : <div className="text-gray-500">No medium term memories</div>}
            </div>
            <div>
              <h4 className="text-emerald-400 text-sm mb-2">Long Term</h4>
              {longTerm.length > 0 ? longTerm.map((memory: any, index: number) => (
                <div key={index} className="text-cyan-400 border-l-2 border-cyan-900/30 pl-2">
                  {memory.content}
                  <div className="text-xs text-gray-500 mt-1">
                    {new Date(memory.timestamp).toLocaleTimeString()}
                  </div>
                </div>
              )) : <div className="text-gray-500">No long term memories</div>}
            </div>
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
                {perceptions.visual.length > 0 ? perceptions.visual.map((perception: { content: string }, index: number) => (
                  <div key={index} className="text-cyan-400 text-sm">
                    {perception.content}
                  </div>
                )) : <div className="text-gray-500">No visual perceptions</div>}
              </div>
            </div>

            {/* Auditory Perceptions */}
            <div>
              <h4 className="text-emerald-400 text-sm mb-2">Auditory</h4>
              <div className="space-y-2">
                {perceptions.auditory.length > 0 ? perceptions.auditory.map((perception: { content: string }, index: number) => (
                  <div key={index} className="text-cyan-400 text-sm">
                    {perception.content}
                  </div>
                )) : <div className="text-gray-500">No auditory perceptions</div>}
              </div>
            </div>

            {/* Social Perceptions */}
            <div>
              <h4 className="text-emerald-400 text-sm mb-2">Social</h4>
              <div className="space-y-2">
                {perceptions.social.length > 0 ? perceptions.social.map((perception: { content: string }, index: number) => (
                  <div key={index} className="text-cyan-400 text-sm">
                    {perception.content}
                  </div>
                )) : <div className="text-gray-500">No social perceptions</div>}
              </div>
            </div>

            {/* Environmental Perceptions */}
            <div>
              <h4 className="text-emerald-400 text-sm mb-2">Environmental</h4>
              <div className="space-y-2">
                {perceptions.environmental.length > 0 ? perceptions.environmental.map((perception: { content: string }, index: number) => (
                  <div key={index} className="text-cyan-400 text-sm">
                    {perception.content}
                  </div>
                )) : <div className="text-gray-500">No environmental perceptions</div>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 