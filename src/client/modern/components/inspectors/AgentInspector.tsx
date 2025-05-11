import * as React from "react";
import {
  ServerMessage,
  AgentState,
  AgentUpdateMessage,
} from "../../../../types";

interface AgentInspectorProps {
  agent: AgentState | undefined;
  logs: ServerMessage[];
}

export function AgentInspector({ agent, logs }: AgentInspectorProps) {
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  // Auto scroll to bottom when new messages arrive
  React.useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [logs]);

  const renderContent = (content: any) => {
    if (typeof content === "string") {
      return content;
    }
    return JSON.stringify(content, null, 2);
  };

  const getAgentState = (agentId: string) => {
    const recentLogs = logs
      .filter((log): log is AgentUpdateMessage => log.type === "AGENT_UPDATE")
      .filter((log) => log.channel.agent === agentId)
      .slice(-10);

    return recentLogs.map((log) => ({
      type: log.data.category,
      content: log.data.content,
      timestamp: log.timestamp,
    }));
  };

  // Function to categorize memories by time
  const categorizeMemories = (memories: any[]) => {
    const now = Date.now();
    const oneHour = 60 * 60 * 1000;
    const oneDay = 24 * oneHour;

    return {
      shortTerm: memories.filter(m => now - m.timestamp < oneHour),
      midTerm: memories.filter(m => now - m.timestamp >= oneHour && now - m.timestamp < oneDay),
      longTerm: memories.filter(m => now - m.timestamp >= oneDay)
    };
  };

  if (!agent) return null;

  const recentStates = getAgentState(agent.id);
  const latestAppearance = recentStates.find(
    (state) => state.type === "appearance"
  )?.content;

  // Get memories from agent state
  const experiences = agent.memory?.experiences || [];
  const perceptions = agent.memory?.perceptions || [];
  const allMemories = [...experiences, ...perceptions];
  const categorizedMemories = categorizeMemories(allMemories);

  return (
    <div className="h-full flex flex-col">
      <div className="px-2 h-8 flex items-center border-b border-cyan-900/30">
        <h2 className="text-emerald-400">
          <span className="text-gray-500">INS:</span> AGENT: {agent.name}
        </h2>
      </div>
      <div className="flex-1 overflow-y-auto">
        {/* Agent Details */}
        <div className="p-2 border-b border-cyan-900/30">
          <div className="text-xs text-gray-500 mb-1">Role</div>
          <div className="text-sm text-cyan-400">{agent.role}</div>
        </div>

        {/* Agent Description */}
        <div className="p-2 border-b border-cyan-900/30">
          <div className="text-xs text-gray-500 mb-1">Description</div>
          <div className="text-sm text-cyan-400">
            {agent.appearance.description || "No description available"}
          </div>
        </div>

        {/* Agent Appearance */}
        <div className="p-2 border-b border-cyan-900/30">
          <div className="text-xs text-gray-500 mb-1">Appearance</div>
          <div className="text-sm text-cyan-400">
            {agent.appearance.description || "No appearance data"}
          </div>
        </div>

        {/* Agent State */}
        <div className="p-2 border-b border-cyan-900/30">
          <div className="text-xs text-gray-500 mb-1">State</div>
          <div className="text-sm text-cyan-400">
            {agent.active ? "Active" : "Inactive"}
          </div>
        </div>

        {/* Goals & Plans */}
        <div className="p-2 border-b border-cyan-900/30">
          <div className="text-xs text-gray-500 mb-1">Goals & Plans</div>
          <div className="space-y-2">
            {agent.goals?.map((goal) => (
              <div key={goal.id} className="mb-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-emerald-400">{goal.description}</span>
                  <span className="text-xs text-gray-400">
                    active ({Math.round(goal.progress)}%)
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Memory Sections */}
        <div className="p-2 border-b border-cyan-900/30">
          <div className="text-xs text-gray-500 mb-1">Memories</div>
          
          {/* Short-term Memories */}
          <div className="mb-4">
            <div className="text-xs text-emerald-400 mb-1">Short-term (Last Hour)</div>
            {categorizedMemories.shortTerm.length > 0 ? (
              <div className="space-y-2">
                {categorizedMemories.shortTerm.map((memory, index) => (
                  <div key={index} className="text-sm text-cyan-400">
                    • {memory.content}
                    <div className="text-xs text-gray-500">
                      {new Date(memory.timestamp).toLocaleTimeString()}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-sm text-gray-500">No recent memories</div>
            )}
          </div>

          {/* Mid-term Memories */}
          <div className="mb-4">
            <div className="text-xs text-emerald-400 mb-1">Mid-term (Last 24 Hours)</div>
            {categorizedMemories.midTerm.length > 0 ? (
              <div className="space-y-2">
                {categorizedMemories.midTerm.map((memory, index) => (
                  <div key={index} className="text-sm text-cyan-400">
                    • {memory.content}
                    <div className="text-xs text-gray-500">
                      {new Date(memory.timestamp).toLocaleTimeString()}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-sm text-gray-500">No mid-term memories</div>
            )}
          </div>

          {/* Long-term Memories */}
          <div className="mb-4">
            <div className="text-xs text-emerald-400 mb-1">Long-term (Older)</div>
            {categorizedMemories.longTerm.length > 0 ? (
              <div className="space-y-2">
                {categorizedMemories.longTerm.map((memory, index) => (
                  <div key={index} className="text-sm text-cyan-400">
                    • {memory.content}
                    <div className="text-xs text-gray-500">
                      {new Date(memory.timestamp).toLocaleTimeString()}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-sm text-gray-500">No long-term memories</div>
            )}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="p-2">
          <div className="text-xs text-gray-500 mb-1">Recent Activity</div>
          <div className="space-y-2">
            {recentStates.map((state, index) => (
              <div key={index} className="text-sm">
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <span>{new Date(state.timestamp).toLocaleTimeString()}</span>
                  <span className="text-emerald-400">{state.type}</span>
                </div>
                <div className="text-gray-400 mt-1">
                  {renderContent(state.content)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
