export interface RoomState {
  id: string;
  name: string;
  description: string;
  occupants: {
    id: string;
    name: string;
  }[];
  connections: string[];
  properties: {
    [key: string]: any;
  };
  lastUpdate: number;
} 