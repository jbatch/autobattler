import { CombatUnit, UnitTemplate, UnitStats } from "@/types";

export const enemyTemplates: Record<string, UnitTemplate> = {
  goblin: {
    id: "goblin",
    name: "Goblin",
    description: "A weak but numerous enemy.",
    rarity: "common",
    baseStats: {
      maxHealth: 40,
      damage: 10,
    },
    statsPerLevel: {
      maxHealth: 10,
      damage: 3,
    },
  },

  orc: {
    id: "orc",
    name: "Orc",
    description: "A brutish enemy with moderate strength.",
    rarity: "common",
    baseStats: {
      maxHealth: 60,
      damage: 15,
    },
    statsPerLevel: {
      maxHealth: 15,
      damage: 4,
    },
  },

  ogre: {
    id: "ogre",
    name: "Ogre",
    description: "A tough enemy with high health.",
    rarity: "uncommon",
    baseStats: {
      maxHealth: 100,
      damage: 12,
    },
    statsPerLevel: {
      maxHealth: 25,
      damage: 3,
    },
    minFloor: 2,
  },

  orc_chief: {
    id: "orc_chief",
    name: "Orc Chief",
    description: "A powerful leader of the orcs.",
    rarity: "rare",
    baseStats: {
      maxHealth: 120,
      damage: 20,
    },
    statsPerLevel: {
      maxHealth: 30,
      damage: 5,
    },
    minFloor: 2,
  },
};

// Helper function to create an enemy unit from a template
export const createEnemyUnit = (
  templateId: string,
  level: number = 1
): CombatUnit => {
  const template = enemyTemplates[templateId];
  if (!template) throw new Error(`Unknown enemy template: ${templateId}`);

  // Calculate stats based on level
  const stats = { ...template.baseStats };
  Object.entries(template.statsPerLevel).forEach(([stat, value]) => {
    stats[stat as keyof UnitStats] += value * (level - 1);
  });

  return {
    id: `enemy-${templateId}-${Math.floor(Math.random() * 10001)}`,
    templateId,
    name: template.name,
    level,
    currentHealth: stats.maxHealth,
    ...stats,
  };
};

// Function to get random enemies for a floor
export const getRandomEnemies = (
  floor: number,
  count: number
): CombatUnit[] => {
  const enemies: CombatUnit[] = [];
  const templates = Object.values(enemyTemplates).filter(
    (e) => !e.minFloor || e.minFloor <= floor
  );

  for (let i = 0; i < count; i++) {
    const template = templates[Math.floor(Math.random() * templates.length)];
    // Enemies are slightly lower level than the floor number
    const level = Math.max(1, Math.floor(floor * 0.7));
    enemies.push(createEnemyUnit(template.id, level));
  }

  return enemies;
};

// Function to create boss enemy
export const createBossEnemy = (floor: number): CombatUnit => {
  // Boss is always slightly higher level than regular enemies
  const bossLevel = Math.floor(floor * 0.8);

  const boss = createEnemyUnit("orc_chief", bossLevel);
  // Give boss some bonus stats
  return {
    ...boss,
    maxHealth: Math.floor(boss.maxHealth * 1.5),
    currentHealth: Math.floor(boss.maxHealth * 1.5),
    damage: Math.floor(boss.damage * 1.2),
    name: `${boss.name} (Boss)`,
  };
};
