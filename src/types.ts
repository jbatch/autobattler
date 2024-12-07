// Core unit stats and properties
export interface UnitStats {
  maxHealth: number;
  damage: number;
}

// Full unit template definition
export interface UnitTemplate {
  id: string;
  name: string;
  description: string;
  rarity: "common" | "uncommon" | "rare" | "epic" | "legendary";
  baseStats: UnitStats;
  // Stats gained per level
  statsPerLevel: Partial<UnitStats>;
  shopData?: {
    cost: number;
    weight: number; // Chance to appear in shop
  };
  minFloor?: number; // When unit starts appearing
}

// Runtime unit instance (what appears in combat)
export interface CombatUnit extends UnitStats {
  id: string;
  templateId: string;
  name: string;
  level: number;
  currentHealth: number;
}

export interface CombatState {
  playerTeam: CombatUnit[];
  enemyTeam: CombatUnit[];
  turn: number;
  isActive: boolean;
  logs: string[];
}

export type NodeType =
  | "combat"
  | "merchant"
  | "treasure"
  | "event"
  | "boss"
  | "victory";

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
  playerTeam: CombatUnit[];
  maxTeamSize: number;
  currentFloor: number;
}
