import { CombatUnit, UnitStats, UnitTemplate } from "@/types";

export const unitTemplates: Record<string, UnitTemplate> = {
  knight: {
    id: "knight",
    name: "Knight",
    description: "A stalwart defender with high health and moderate damage.",
    rarity: "common",
    baseStats: {
      maxHealth: 100,
      damage: 20,
    },
    statsPerLevel: {
      maxHealth: 20,
      damage: 4,
    },
    shopData: {
      cost: 100,
      weight: 100,
    },
  },

  archer: {
    id: "archer",
    name: "Archer",
    description: "A ranged attacker with high damage but low health.",
    rarity: "common",
    baseStats: {
      maxHealth: 70,
      damage: 30,
    },
    statsPerLevel: {
      maxHealth: 12,
      damage: 6,
    },
    shopData: {
      cost: 120,
      weight: 100,
    },
  },

  cleric: {
    id: "cleric",
    name: "Cleric",
    description: "A balanced unit with moderate health and damage.",
    rarity: "uncommon",
    baseStats: {
      maxHealth: 80,
      damage: 15,
    },
    statsPerLevel: {
      maxHealth: 15,
      damage: 3,
    },
    shopData: {
      cost: 150,
      weight: 75,
    },
    minFloor: 2,
  },

  berserker: {
    id: "berserker",
    name: "Berserker",
    description: "A powerful warrior with high damage output.",
    rarity: "rare",
    baseStats: {
      maxHealth: 85,
      damage: 25,
    },
    statsPerLevel: {
      maxHealth: 15,
      damage: 5,
    },
    shopData: {
      cost: 180,
      weight: 50,
    },
    minFloor: 2,
  },
};

// Helper function to create a combat unit from a template
export const createUnit = (
  templateId: string,
  level: number = 1
): CombatUnit => {
  const template = unitTemplates[templateId];
  if (!template) throw new Error(`Unknown unit template: ${templateId}`);

  // Calculate stats based on level
  const stats = { ...template.baseStats };
  Object.entries(template.statsPerLevel).forEach(([stat, value]) => {
    stats[stat as keyof UnitStats] += value * (level - 1);
  });

  return {
    id: `${templateId}-${Date.now()}`,
    templateId,
    name: template.name,
    level,
    currentHealth: stats.maxHealth,
    ...stats,
  };
};
