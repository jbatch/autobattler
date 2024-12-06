import { CombatState, Unit } from "@/types";
import { useCallback, useEffect, useState } from "react";

// Initial state setup remains the same as before
const DEFAULT_PLAYER_TEAM: Unit[] = [
  {
    id: "p1",
    name: "Knight",
    maxHealth: 100,
    currentHealth: 100,
    damage: 20,
    cooldown: 3,
    currentCooldown: 3,
    position: "frontline",
  },
  {
    id: "p2",
    name: "Archer",
    maxHealth: 70,
    currentHealth: 70,
    damage: 30,
    cooldown: 4,
    currentCooldown: 4,
    position: "backline",
  },
];

const initialEnemyTeam: Unit[] = [
  {
    id: "e1",
    name: "Goblin",
    maxHealth: 60,
    currentHealth: 60,
    damage: 15,
    cooldown: 2,
    currentCooldown: 2,
    position: "frontline",
  },
  {
    id: "e2",
    name: "Orc",
    maxHealth: 120,
    currentHealth: 120,
    damage: 25,
    cooldown: 4,
    currentCooldown: 4,
    position: "frontline",
  },
];

export const useCombatSystem = (initialPlayerTeam?: Unit[]) => {
  const [combatState, setCombatState] = useState<CombatState>({
    playerTeam: initialPlayerTeam ?? DEFAULT_PLAYER_TEAM,
    enemyTeam: initialEnemyTeam,
    turn: 0,
    isActive: false,
    logs: [],
  });

  // Combat logic remains the same...
  const processAttack = (
    attacker: Unit,
    defenders: Unit[]
  ): [Unit[], string] => {
    if (defenders.length === 0) return [[], ""];

    const target = defenders.find((unit) => unit.currentHealth > 0);
    if (!target) return [defenders, ""];

    const newDefenders = defenders.map((unit) => {
      if (unit.id === target.id) {
        return {
          ...unit,
          currentHealth: Math.max(0, unit.currentHealth - attacker.damage),
        };
      }
      return unit;
    });

    const log = `${attacker.name} attacks ${target.name} for ${attacker.damage} damage!`;
    return [newDefenders, log];
  };

  const processTurn = useCallback(() => {
    setCombatState((prevState) => {
      const newLogs: string[] = [];
      let newPlayerTeam = [...prevState.playerTeam];
      let newEnemyTeam = [...prevState.enemyTeam];

      // Process player team
      newPlayerTeam = newPlayerTeam.map((unit) => {
        if (unit.currentHealth <= 0) return unit;

        if (unit.currentCooldown === 1) {
          const [updatedEnemies, log] = processAttack(unit, newEnemyTeam);
          newEnemyTeam = updatedEnemies;
          if (log) newLogs.push(log);
          return { ...unit, currentCooldown: unit.cooldown };
        }

        return {
          ...unit,
          currentCooldown: Math.max(0, unit.currentCooldown - 1),
        };
      });

      // Process enemy team
      newEnemyTeam = newEnemyTeam.map((unit) => {
        if (unit.currentHealth <= 0) return unit;

        if (unit.currentCooldown === 1) {
          const [updatedPlayers, log] = processAttack(unit, newPlayerTeam);
          newPlayerTeam = updatedPlayers;
          if (log) newLogs.push(log);
          return { ...unit, currentCooldown: unit.cooldown };
        }

        return {
          ...unit,
          currentCooldown: Math.max(0, unit.currentCooldown - 1),
        };
      });

      // Check win/loss conditions
      const playerAlive = newPlayerTeam.some((unit) => unit.currentHealth > 0);
      const enemyAlive = newEnemyTeam.some((unit) => unit.currentHealth > 0);

      if (!playerAlive || !enemyAlive) {
        const resultLog = !playerAlive
          ? "Battle Over - Enemy Team Wins!"
          : "Battle Over - Player Team Wins!";
        newLogs.push(resultLog);
        return {
          ...prevState,
          isActive: false,
          logs: [...prevState.logs, ...newLogs],
          playerTeam: newPlayerTeam,
          enemyTeam: newEnemyTeam,
        };
      }

      return {
        ...prevState,
        playerTeam: newPlayerTeam,
        enemyTeam: newEnemyTeam,
        turn: prevState.turn + 1,
        logs: [...prevState.logs, ...newLogs],
      };
    });
  }, []);

  const startCombat = () => {
    setCombatState((prev) => ({
      ...prev,
      isActive: true,
      logs: ["Battle Started!"],
    }));
  };

  useEffect(() => {
    let intervalId: number;

    if (combatState.isActive) {
      intervalId = window.setInterval(processTurn, 1000);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [combatState.isActive, processTurn]);

  return {
    combatState,
    startCombat,
  };
};

export default useCombatSystem;
