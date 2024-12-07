import { CombatState, CombatUnit } from "@/types";
import { useCallback, useEffect, useState } from "react";
import { createBossEnemy, getRandomEnemies } from "@/data/enemy-data";

export const useCombatSystem = (
  playerTeam: CombatUnit[],
  floor: number,
  isBossFight: boolean = false
) => {
  const [combatState, setCombatState] = useState<CombatState>({
    playerTeam: playerTeam,
    enemyTeam: isBossFight
      ? [createBossEnemy(floor)]
      : getRandomEnemies(floor, Math.floor(Math.random() * 2) + 1),
    turn: 0,
    isActive: false,
    logs: [],
  });

  // Rest of the combat system remains the same
  const getFrontUnit = (team: CombatUnit[]): CombatUnit | null => {
    return team.find((unit) => unit.currentHealth > 0) || null;
  };

  const processCombatRound = (
    playerUnit: CombatUnit,
    enemyUnit: CombatUnit
  ): [CombatUnit, CombatUnit, string[]] => {
    const logs: string[] = [];

    // Both units attack simultaneously
    const updatedPlayerUnit = {
      ...playerUnit,
      currentHealth: Math.max(0, playerUnit.currentHealth - enemyUnit.damage),
    };

    const updatedEnemyUnit = {
      ...enemyUnit,
      currentHealth: Math.max(0, enemyUnit.currentHealth - playerUnit.damage),
    };

    // Generate combat logs
    logs.push(`${playerUnit.name} and ${enemyUnit.name} clash!`);
    logs.push(
      `${playerUnit.name} deals ${playerUnit.damage} damage to ${enemyUnit.name}`
    );
    logs.push(
      `${enemyUnit.name} deals ${enemyUnit.damage} damage to ${playerUnit.name}`
    );

    if (updatedPlayerUnit.currentHealth <= 0) {
      logs.push(`${playerUnit.name} is defeated!`);
    }
    if (updatedEnemyUnit.currentHealth <= 0) {
      logs.push(`${enemyUnit.name} is defeated!`);
    }

    return [updatedPlayerUnit, updatedEnemyUnit, logs];
  };

  const processTurn = useCallback(() => {
    setCombatState((prevState) => {
      const playerFront = getFrontUnit(prevState.playerTeam);
      const enemyFront = getFrontUnit(prevState.enemyTeam);

      // If either team has no units left, combat is over
      if (!playerFront || !enemyFront) {
        const winner = playerFront ? "Player Team" : "Enemy Team";
        return {
          ...prevState,
          isActive: false,
          logs: [...prevState.logs, `Battle Over - ${winner} Wins!`],
        };
      }

      // Process combat between front units
      const [updatedPlayerUnit, updatedEnemyUnit, combatLogs] =
        processCombatRound(playerFront, enemyFront);

      // Update the units in their respective teams
      const newPlayerTeam = prevState.playerTeam.map((unit) =>
        unit.id === updatedPlayerUnit.id ? updatedPlayerUnit : unit
      );

      const newEnemyTeam = prevState.enemyTeam.map((unit) =>
        unit.id === updatedEnemyUnit.id ? updatedEnemyUnit : unit
      );

      return {
        ...prevState,
        playerTeam: newPlayerTeam,
        enemyTeam: newEnemyTeam,
        turn: prevState.turn + 1,
        logs: [...prevState.logs, ...combatLogs],
      };
    });
  }, []);

  const startCombat = () => {
    setCombatState((prev) => ({
      ...prev,
      isActive: true,
      logs: [isBossFight ? "The Boss approaches..." : "Battle Started!"],
    }));
  };

  useEffect(() => {
    let intervalId: number;

    if (combatState.isActive) {
      intervalId = window.setInterval(processTurn, 1500);
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
