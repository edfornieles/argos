import * as React from "react";
import { useState } from "react";
import { useSimulationStore } from "../../../state/simulation";

export function CharacterDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const { agents, setSelectedAgent } = useSimulationStore();

  const toggleDropdown = () => setIsOpen(!isOpen);

  return (
    <div className="relative">
      <button
        onClick={toggleDropdown}
        className="flex items-center space-x-2 px-4 py-2 bg-gray-800 text-gray-100 rounded-lg hover:bg-gray-700"
      >
        <span>Characters</span>
        <svg
          className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-lg z-50">
          <div className="py-1">
            {agents.map((agent) => (
              <button
                key={agent.id}
                onClick={() => {
                  setSelectedAgent(agent.id);
                  setIsOpen(false);
                }}
                className="w-full text-left px-4 py-2 text-gray-100 hover:bg-gray-700"
              >
                {agent.name} ({agent.role})
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 