import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import MapView from "./MapView";
import CombatView from "./CombatView";
import {
  createInitialGameState,
  completeNode,
  moveToNode,
} from "../hooks/gameStateManager";
import type { GameState, MapNode, Unit } from "../types";
import TeamSelectionView from "./TeamSelectionView";
import ShopView from "./ShopView";
import TreasureView from "./TreasureView";
import EventView from "./EventView";

type GameScreen =
  | "team-select"
  | "map"
  | "combat"
  | "treasure"
  | "shop"
  | "event";

const GameView = () => {
  const [gameState, setGameState] = useState<GameState>(
    createInitialGameState()
  );
  const [currentScreen, setCurrentScreen] = useState<GameScreen>("team-select");

  const handleTeamSelect = (selectedTeam: Unit[]) => {
    setGameState((prev) => ({
      ...prev,
      playerTeam: selectedTeam,
    }));
    setCurrentScreen("map");
  };

  const handleNodeClick = (nodeId: string) => {
    const node = gameState.map.nodes.find((n) => n.id === nodeId);
    if (!node?.available || node.completed) return;

    // Update game state to move to the new node
    const newGameState = moveToNode(gameState, nodeId);
    setGameState(newGameState);

    switch (node.type) {
      case "combat":
        setCurrentScreen("combat");
        break;
      case "merchant":
        setCurrentScreen("shop");
        break;
      case "treasure":
        setCurrentScreen("treasure");
        break;
      case "event":
        setCurrentScreen("event");
        break;
      // TODO Handle other node types here
    }
  };

  const handleCombatComplete = (victory: boolean) => {
    if (victory) {
      // Mark current node as completed and update available nodes
      const newGameState = completeNode(gameState, gameState.currentNodeId!);
      // TODO make gold reward variable
      setGameState((prev) => ({ ...newGameState, gold: prev.gold + 50 }));
    }
    setCurrentScreen("map");
  };

  const handleEventComplete = (result: {
    goldChange?: number;
    teamSizeIncrease?: number;
  }) => {
    setGameState((prev) => {
      const newState = {
        ...prev,
        gold: prev.gold + (result.goldChange ?? 0),
        maxTeamSize: prev.maxTeamSize + (result.teamSizeIncrease ?? 0),
      };

      // Complete the node
      return completeNode(newState, newState.currentNodeId!);
    });

    setCurrentScreen("map");
  };

  const handleBuyUnit = (unit: Unit) => {
    const unitCost = {
      Knight: 100,
      Archer: 120,
      Mage: 150,
      Cleric: 130,
      Berserker: 140,
    }[unit.name]!;

    if (
      gameState.gold >= unitCost &&
      gameState.playerTeam.length < gameState.maxTeamSize
    ) {
      // Generate a unique ID for the new unit
      const newUnit = {
        ...unit,
        id: `${unit.id}-${Date.now()}`,
      };

      setGameState((prev) => ({
        ...prev,
        gold: prev.gold - unitCost,
        playerTeam: [...prev.playerTeam, newUnit],
      }));
    }
  };

  const handleDismissUnit = (unitId: string) => {
    setGameState((prev) => ({
      ...prev,
      gold: prev.gold + 25, // Give some gold back for dismissed units
      playerTeam: prev.playerTeam.filter((unit) => unit.id !== unitId),
    }));
  };

  const handleLeaveShop = () => {
    const newGameState = completeNode(gameState, gameState.currentNodeId!);
    setGameState(newGameState);
    setCurrentScreen("map");
  };

  const handleTreasureComplete = (upgradedTeam?: Unit[]) => {
    // If no upgraded team, they chose gold
    if (!upgradedTeam) {
      setGameState((prev) => ({
        ...prev,
        gold: prev.gold + 200,
      }));
    } else {
      // They chose to upgrade a unit
      setGameState((prev) => ({
        ...prev,
        playerTeam: upgradedTeam,
      }));
    }

    // Mark node as completed and return to map
    const newGameState = completeNode(gameState, gameState.currentNodeId!);
    setGameState((prev) => ({
      ...newGameState,
      playerTeam: upgradedTeam ?? prev.playerTeam,
    }));
    setCurrentScreen("map");
  };

  return (
    <div className="container mx-auto p-4">
      {currentScreen === "team-select" && (
        <TeamSelectionView onTeamSelect={handleTeamSelect} />
      )}

      {currentScreen === "map" && (
        <div className="space-y-4">
          <Card className="p-4 bg-red-500">
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-2xl font-bold">Adventure Map</h1>
              <div className="text-lg">Gold: {gameState.gold}</div>
            </div>
            <MapView gameState={gameState} onNodeClick={handleNodeClick} />
          </Card>

          {/* Current Node Info */}
          {gameState.currentNodeId && (
            <Card className="p-4">
              <h2 className="text-xl font-bold mb-2">Current Location</h2>
              <NodeInfo
                node={
                  gameState.map.nodes.find(
                    (n) => n.id === gameState.currentNodeId
                  )!
                }
              />
            </Card>
          )}
        </div>
      )}

      {currentScreen === "combat" && (
        <div>
          <div className="mb-4">
            <Button variant="outline" onClick={() => setCurrentScreen("map")}>
              Retreat to Map
            </Button>
          </div>
          <CombatView
            initialPlayerTeam={gameState.playerTeam}
            onCombatComplete={handleCombatComplete}
          />
        </div>
      )}

      {currentScreen === "shop" && (
        <ShopView
          gold={gameState.gold}
          playerTeam={gameState.playerTeam}
          maxTeamSize={gameState.maxTeamSize}
          onClose={handleLeaveShop}
          onBuyUnit={handleBuyUnit}
          onDismissUnit={handleDismissUnit}
        />
      )}

      {currentScreen === "treasure" && (
        <TreasureView
          playerTeam={gameState.playerTeam}
          onComplete={handleTreasureComplete}
        />
      )}

      {currentScreen === "event" && (
        <EventView gold={gameState.gold} onComplete={handleEventComplete} />
      )}
    </div>
  );
};

// Helper component to display node information
const NodeInfo = ({ node }: { node: MapNode }) => {
  const nodeTypeDisplays = {
    combat: "Combat Encounter",
    merchant: "Merchant",
    treasure: "Treasure Room",
    event: "Mystery Event",
    boss: "Boss Battle",
  };

  return (
    <div>
      <p className="text-lg">{nodeTypeDisplays[node.type]}</p>
      {node.type === "combat" && !node.completed && (
        <div className="mt-2">
          <p className="text-sm text-gray-600">
            Prepare your team for battle! Click the node to begin combat.
          </p>
        </div>
      )}
      {node.completed && (
        <p className="text-sm text-green-600 mt-2">
          This area has been cleared!
        </p>
      )}
    </div>
  );
};

export default GameView;
