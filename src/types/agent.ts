export interface AgentConfig {
  name: string;
  role: string;
  systemPrompt: string;
  active?: number;
  platform?: string;
  appearance?: string;
  initialGoals?: string[];
  initialContext?: string;
  initialEmotionalState?: string;
}

export interface AgentState {
  id: string;
  name: string;
  description: string;
  location: string;
  memories: {
    experiences: string[];
    perceptions: string[];
  };
  context: string[];
  relationships: {
    [key: string]: {
      type: string;
      strength: number;
    };
  };
  status: {
    health: number;
    energy: number;
    mood: number;
  };
  inventory: string[];
  goals: string[];
  currentAction: string | null;
  lastUpdate: number;
}
