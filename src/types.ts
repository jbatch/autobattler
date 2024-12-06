export interface Unit {
  id: string;
  name: string;
  maxHealth: number;
  currentHealth: number;
  damage: number;
}

export interface CombatState {
  playerTeam: Unit[];
  enemyTeam: Unit[];
  turn: number;
  isActive: boolean;
  logs: string[];
}

export type NodeType = "combat" | "merchant" | "treasure" | "event" | "boss";

export interface MapNode {
  id: string;
  type: NodeType;
  position: {
    x: number;
    y: number;
  };
  connections: string[]; // IDs of connected nodes
  completed: boolean;
  available: boolean;
}

export interface GameMap {
  nodes: MapNode[];
  currentLevel: number;
  startNodeId: string;
  endNodeIds: string[]; // Multiple possible end nodes
}

export interface GameState {
  gold: number;
  map: GameMap;
  currentNodeId: string | null;
  level: number;
  playerTeam: Unit[];
}
