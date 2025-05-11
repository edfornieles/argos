import * as React from "react";
import { AgentState, RoomState, ServerMessage } from "../../../types";
import { RoomInspector } from "./inspectors/RoomInspector";
import { AgentInspector } from "./inspectors/AgentInspector";

interface InspectorProps {
  selectedAgent: string | null;
  selectedRoom: string | null;
  agents: AgentState[];
  rooms: RoomState[];
  logs: ServerMessage[];
  onDeleteMemory: (agentId: string, memoryIndex: number, type: 'experience' | 'perception') => void;
  onDeleteContext: (agentId: string, contextIndex: number) => void;
}

export function Inspector({
  selectedAgent,
  selectedRoom,
  agents,
  rooms,
  logs,
  onDeleteMemory,
  onDeleteContext,
}: InspectorProps) {
  const selectedAgentData = agents.find((a) => a.id === selectedAgent);
  const selectedRoomData = rooms.find((r) => r.id === selectedRoom);

  // Default "no selection" view
  if (!selectedAgent && !selectedRoom) {
    return (
      <div className="h-full flex flex-col">
        <div className="px-2 h-8 flex items-center border-b border-cyan-900/30">
          <h2 className="text-emerald-400">
            <span className="text-gray-500">INS:</span> INSPECTOR
          </h2>
        </div>
        <div className="flex-1 flex items-center justify-center text-gray-500 text-sm">
          Select an agent or room to inspect
        </div>
      </div>
    );
  }

  // Room inspection view
  if (selectedRoom) {
    return (
      <RoomInspector
        room={rooms.find((r) => r.id === selectedRoom)}
        agents={agents}
        logs={logs}
      />
    );
  }

  // Agent inspection view
  if (selectedAgent) {
    return (
      <AgentInspector
        agent={agents.find(
          (a) => a.id === selectedAgent || a.name === selectedAgent
        )}
        logs={logs}
      />
    );
  }

  return (
    <div className="h-full flex flex-col bg-gray-900/50 border-l border-cyan-900/30">
      <div className="p-4">
        <h2 className="text-lg font-semibold text-cyan-400 mb-4">Inspector</h2>
        
        {selectedAgentData && (
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-cyan-300 mb-2">Memories</h3>
              <div className="space-y-2">
                {selectedAgentData.memories.experiences.map((memory: string, index: number) => (
                  <div key={`exp-${index}`} className="flex items-start justify-between p-2 bg-gray-800/50 rounded">
                    <p className="text-sm text-gray-300">{memory}</p>
                    <button
                      onClick={() => onDeleteMemory(selectedAgentData.id, index, 'experience')}
                      className="ml-2 text-xs text-red-400 hover:text-red-300"
                    >
                      Delete
                    </button>
                  </div>
                ))}
                {selectedAgentData.memories.perceptions.map((memory: string, index: number) => (
                  <div key={`per-${index}`} className="flex items-start justify-between p-2 bg-gray-800/50 rounded">
                    <p className="text-sm text-gray-300">{memory}</p>
                    <button
                      onClick={() => onDeleteMemory(selectedAgentData.id, index, 'perception')}
                      className="ml-2 text-xs text-red-400 hover:text-red-300"
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-cyan-300 mb-2">Context</h3>
              <div className="space-y-2">
                {selectedAgentData.context.map((ctx: string, index: number) => (
                  <div key={index} className="flex items-start justify-between p-2 bg-gray-800/50 rounded">
                    <p className="text-sm text-gray-300">{ctx}</p>
                    <button
                      onClick={() => onDeleteContext(selectedAgentData.id, index)}
                      className="ml-2 text-xs text-red-400 hover:text-red-300"
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {selectedRoomData && (
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-cyan-300 mb-2">Room Details</h3>
              <div className="p-2 bg-gray-800/50 rounded">
                <p className="text-sm text-gray-300">
                  <span className="text-cyan-400">Name:</span> {selectedRoomData.name}
                </p>
                <p className="text-sm text-gray-300">
                  <span className="text-cyan-400">Description:</span> {selectedRoomData.description}
                </p>
                <p className="text-sm text-gray-300">
                  <span className="text-cyan-400">Occupants:</span> {selectedRoomData.occupants?.length || 0}
                </p>
              </div>
            </div>
          </div>
        )}

        {!selectedAgentData && !selectedRoomData && (
          <p className="text-sm text-gray-400">Select an agent or room to inspect</p>
        )}
      </div>
    </div>
  );
}
