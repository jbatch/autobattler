import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import MapView from "./MapView";
import CombatView from "./CombatView";
import {
  createInitialGameState,
  completeNode,
  moveToNode,
  advanceToNextFloor,
} from "../hooks/gameStateManager";
import type { GameState, CombatUnit } from "../types";
import TeamSelectionView from "./TeamSelectionView";
import ShopView from "./ShopView";
import TreasureView from "./TreasureView";
import EventView from "./EventView";
import { Trophy } from "lucide-react";

type GameScreen =
  | "team-select"
  | "map"
  | "combat"
  | "treasure"
  | "shop"
  | "event"
  | "victory";

const GameView = () => {
  const [gameState, setGameState] = useState<GameState>(
    createInitialGameState()
  );
  const [currentScreen, setCurrentScreen] = useState<GameScreen>("team-select");

  const handleTeamSelect = (selectedTeam: CombatUnit[]) => {
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
      case "boss":
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
      case "victory":
        setCurrentScreen("victory");
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

  const handleBuyUnit = (unit: CombatUnit) => {
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

  const handleTreasureComplete = (upgradedTeam?: CombatUnit[]) => {
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

  const currentNode = gameState.map.nodes.find(
    (n) => n.id === gameState.currentNodeId
  )!;
  return (
    <div className="container mx-auto p-4 max-w-6xl">
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
            floor={gameState.level}
            isBossFight={currentNode.type === "boss"}
            onCombatComplete={handleCombatComplete}
          />
        </div>
      )}

      {currentScreen === "shop" && (
        <ShopView
          gold={gameState.gold}
          playerTeam={gameState.playerTeam}
          maxTeamSize={gameState.maxTeamSize}
          level={gameState.level}
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

      {currentScreen === "victory" && (
        <VictoryView
          onComplete={() => {
            setGameState((prevState) => advanceToNextFloor(prevState));
            setCurrentScreen("map");
          }}
        />
      )}
    </div>
  );
};

const VictoryView = ({ onComplete }: { onComplete: () => void }) => {
  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-6 w-6 text-yellow-500" />
            Floor Completed!
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center space-y-4">
            <p>
              You have conquered this floor! Ready to face the next challenge?
            </p>
            <Button onClick={onComplete} className="w-48">
              Proceed to Next Floor
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GameView;
