import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import MapView from "./MapView";
import CombatView from "./CombatView";
import {
  createInitialGameState,
  completeNode,
  moveToNode,
} from "../hooks/gameStateManager";
import type { GameState, MapNode } from "../types";

type GameScreen = "map" | "combat" | "reward";

const GameView = () => {
  const [gameState, setGameState] = useState<GameState>(
    createInitialGameState()
  );
  const [currentScreen, setCurrentScreen] = useState<GameScreen>("map");

  const handleNodeClick = (nodeId: string) => {
    const node = gameState.map.nodes.find((n) => n.id === nodeId);
    if (!node?.available || node.completed) return;

    // Update game state to move to the new node
    const newGameState = moveToNode(gameState, nodeId);
    setGameState(newGameState);

    // If it's a combat node, transition to combat screen
    if (node.type === "combat") {
      setCurrentScreen("combat");
    }
    // Could handle other node types here later
  };

  const handleCombatComplete = (victory: boolean) => {
    if (victory) {
      // Mark current node as completed and update available nodes
      const newGameState = completeNode(gameState, gameState.currentNodeId!);
      setGameState(newGameState);
    }
    setCurrentScreen("map");
  };

  return (
    <div className="container mx-auto p-4">
      {currentScreen === "map" && (
        <div className="space-y-4">
          <Card className="p-4">
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
