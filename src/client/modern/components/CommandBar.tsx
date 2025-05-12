import * as React from "react";
import { AgentState } from "../../../types";

interface CommandBarProps {
  isRunning: boolean;
  isConnected: boolean;
  onCommand: (type: string) => void;
  agents: AgentState[];
  onCharacterSelect: (agentId: string) => void;
}

export function CommandBar({
  isRunning,
  isConnected,
  onCommand,
  agents,
  onCharacterSelect,
}: CommandBarProps) {
  const [elapsedTime, setElapsedTime] = React.useState(0);
  const [command, setCommand] = React.useState("");

  React.useEffect(() => {
    if (!isRunning) {
      setElapsedTime(0);
    }
  }, [isRunning]);

  React.useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning) {
      interval = setInterval(() => {
        setElapsedTime((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning]);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, "0")}:${m
      .toString()
      .padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const handleCommandSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!command.trim()) return;

    const cmd = command.trim().toUpperCase();
    if (["START", "STOP", "RESET"].includes(cmd)) {
      onCommand(cmd);
    } else if (cmd.startsWith("SPAWN_AGENT")) {
      onCommand(cmd);
    } else {
      // Handle other commands here
      console.log("Unknown command:", cmd);
    }
    setCommand("");
  };

  return (
    <div className="h-12 border-b border-cyan-900/30 bg-black/20 flex items-center justify-between px-4">
      {/* Left: Primary Controls */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => onCommand("START")}
            disabled={!isConnected || isRunning}
            className="px-2 py-1 text-xs rounded bg-emerald-900/50 text-emerald-400 hover:bg-emerald-900/70 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Start
          </button>
          <button
            onClick={() => onCommand("STOP")}
            disabled={!isConnected || !isRunning}
            className="px-2 py-1 text-xs rounded bg-red-900/50 text-red-400 hover:bg-red-900/70 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Stop
          </button>
          <button
            onClick={() => onCommand("RESET")}
            disabled={!isConnected}
            className="px-2 py-1 text-xs rounded bg-cyan-900/50 text-cyan-400 hover:bg-cyan-900/70 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Reset
          </button>
        </div>

        {/* Time Controls */}
        <div className="flex items-center gap-2">
          <button
            className="px-2 py-1 rounded font-mono text-xs bg-black/30 text-cyan-400 border border-cyan-900/50"
            onClick={() => {
              /* TODO: Implement speed control */
            }}
          >
            0.5×
          </button>
          <button className="px-2 py-1 rounded font-mono text-xs bg-black/30 text-cyan-400 border border-cyan-900/50">
            1×
          </button>
          <button className="px-2 py-1 rounded font-mono text-xs bg-black/30 text-cyan-400 border border-cyan-900/50">
            2×
          </button>
        </div>
      </div>

      {/* Center: Search */}
      <form onSubmit={handleCommandSubmit} className="flex-1 max-w-xl mx-4">
        <input
          type="text"
          value={command}
          onChange={(e) => setCommand(e.target.value)}
          placeholder="Search agents, events, or use commands..."
          className="w-full px-3 py-1 rounded font-mono text-sm bg-black/30 text-cyan-400 border border-cyan-900/50 focus:outline-none focus:border-cyan-500"
        />
      </form>

      {/* Right: Status */}
      <div className="flex items-center space-x-4">
        <div className="text-sm font-mono">
          <span className="text-gray-500">Agents:</span>{" "}
          <span className="text-cyan-400">{agents.length}</span>
        </div>
        <div className="text-sm font-mono">
          <span className="text-gray-500">Time:</span>{" "}
          <span className={`text-cyan-400 ${isRunning ? "animate-pulse" : ""}`}>
            {formatTime(elapsedTime)}
          </span>
        </div>
        <div
          className={`w-2 h-2 rounded-full ${
            isConnected ? "bg-emerald-400" : "bg-red-400"
          }`}
        />
        <span className="text-xs text-gray-400">
          {isConnected ? "Connected" : "Disconnected"}
        </span>
      </div>

      <div className="flex items-center space-x-2">
        <select
          onChange={(e) => onCharacterSelect(e.target.value)}
          className="px-2 py-1 text-xs rounded bg-gray-800/50 text-gray-400 border border-gray-700/50 focus:outline-none focus:border-cyan-500/50"
        >
          <option value="">Select Character</option>
          {agents.map((agent) => (
            <option key={agent.id} value={agent.id}>
              {agent.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
